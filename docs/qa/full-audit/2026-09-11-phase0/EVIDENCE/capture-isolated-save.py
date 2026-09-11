from pathlib import Path
import subprocess, sqlite3, json
out=Path('docs/qa/full-audit/2026-09-11-phase0/EVIDENCE')
r=subprocess.run(['adb','-s','emulator-5580','exec-out','run-as','com.jungih4982.zerohourgame','cat','databases/RKStorage'],capture_output=True,check=True)
if not r.stdout.startswith(b'SQLite format 3'): raise RuntimeError('No SQLite bytes; capture not saved')
p=out/'isolated-gui-save.sqlite';p.write_bytes(r.stdout)
c=sqlite3.connect('file:'+p.resolve().as_posix()+'?mode=ro',uri=True)
rows=c.execute('select key,value from catalystLocalStorage').fetchall()
(out/'isolated-gui-save.json').write_text(json.dumps({k:json.loads(v) for k,v in rows if k.startswith('zero-hour')},ensure_ascii=False,indent=2),encoding='utf-8')
print('Captured isolated audit save:',len(r.stdout),'bytes; keys:',[k for k,v in rows])
