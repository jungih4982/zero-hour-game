"""Read-only export from this batch's isolated Android device; never injects state."""
import hashlib, json, pathlib, sqlite3, subprocess, sys

out = pathlib.Path(__file__).resolve().parent
name = sys.argv[1]
assert name.replace('-', '').isalnum()
adb = r'C:\Users\hjg\AppData\Local\Android\Sdk\platform-tools\adb.exe'
cmd = [adb, '-s', 'emulator-5580', 'exec-out', 'run-as', 'com.jungih4982.zerohourgame', 'cat']
data = subprocess.check_output(cmd + ['databases/RKStorage'])
journal = subprocess.check_output(cmd + ['databases/RKStorage-journal'])
assert not journal, 'Retry when the database is idle; do not preserve a partial transaction.'
target = out / (name + '.sqlite')
assert not target.exists(), 'Preserve earlier checkpoint evidence.'
target.write_bytes(data)
db = sqlite3.connect(f'file:{target.as_posix()}?mode=ro', uri=True)
assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
rows = {key: json.loads(value) for key, value in db.execute('select key,value from catalystLocalStorage')}
db.close()
(out / (name + '.json')).write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
state = rows['zero-hour-narrative-save']['state']['engineState']
print(json.dumps({'checkpoint':name,'sha256':hashlib.sha256(data).hexdigest(),
 'scene':state['volatile']['currentSceneId'],'time':state['volatile']['time'],
 'loop':state['persistent']['loopCount'], 'preferences':rows.get('zero-hour-game-preferences')}, ensure_ascii=False))
