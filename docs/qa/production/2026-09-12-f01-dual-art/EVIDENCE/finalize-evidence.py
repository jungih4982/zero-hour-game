"""Read-only repository/save verification and generation of this batch's evidence indexes."""
import csv
import hashlib
import json
import pathlib
import subprocess
from datetime import datetime, timezone
from PIL import Image, ImageDraw

root = pathlib.Path(__file__).resolve().parents[5]
evidence = pathlib.Path(__file__).resolve().parent
batch = evidence.parent
assert (root / 'src/content/prologue.ts').exists()

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def git(*args):
    return subprocess.check_output(['git', *args], cwd=root).decode('utf-8').strip()

def write_json(name, value):
    (evidence / name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')

def csv_out(path, rows, fields):
    with path.open('w', encoding='utf-8', newline='') as output:
        writer = csv.DictWriter(output, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

baseline = list(csv.DictReader((evidence / 'baseline-tracked-sha256.csv').open(encoding='utf-8-sig')))
changed = [row['path'] for row in baseline if digest(root / row['path']) != row['sha256']]
allowed = {'package.json', 'docs/qa/README.md', 'src/content/chapter3.ts', 'src/content/prologue.ts',
           'src/content/story.ts', 'src/engine/effects.ts', 'src/engine/loop.ts', 'src/engine/types.ts',
           'src/gameplay/choicePresentation.ts', 'src/gameplay/gameClock.ts', 'src/gameplay/investigation.ts',
           'src/store/useNarrativeStore.ts', 'src/ui/NarrativePlayer.tsx'}
assert set(changed) == allowed, changed
assert git('rev-parse', 'HEAD') == 'f67c6324fdc569857a8bc4e08f07ec3476446ce3'
assert git('branch', '--show-current') == 'master'
assert not git('diff', '--cached', '--name-only')
assert not git('diff', '--name-only', '--diff-filter=D')
new_files = git('ls-files', '--others', '--exclude-standard').splitlines()
baseline_info = json.loads((evidence / 'baseline-revalidation.json').read_text(encoding='utf-8-sig'))
instruction = [p for p in root.glob('*.txt') if digest(p) == baseline_info['untrackedInstructionSHA256']]
assert len(instruction) == 1
prior_save = root / 'docs/qa/production/2026-09-12-minseo-qwen/EVIDENCE/resume-final.sqlite'
assert digest(prior_save) == baseline_info['priorSaveSHA256']
source_art = root / 'assets/characters/minseo/sprites/CHAR_Minseo_Clinical_ThreeQuarter_v03.png'
assert digest(source_art) == '0cfdcb8098ffb45151a6287409e68d61948d3b180a05837bed49f65f5f6f0b77'

def save(name):
    return json.loads((evidence / (name + '.json')).read_text(encoding='utf-8'))

assert save('fresh-loop3-memory-choice') == save('resume-final')
assert digest(evidence / 'clone-b1-cart-center-before.sqlite') == digest(evidence / 'clone-b1-after-same-state.sqlite')
cart = save('clone-b1-confirmed-cart-linen')['zero-hour-narrative-save']['state']['engineState']
assert 'CLUE_B1_TRANSFER_TRACKS' in cart['persistent']['clueIds']
assert 'CLUE_B1_UNMARKED_ROOMS' not in cart['persistent']['clueIds']
assert cart['volatile']['time'] == 162
final = save('resume-final')['zero-hour-narrative-save']['state']['engineState']
assert final['volatile']['time'] == 0 and final['persistent']['loopCount'] == 3
assert final['volatile']['itemIds'] == [] and final['volatile']['flags'] == {}
assert final['volatile']['clock']['events'] == {}
assert 'CLUE_B1_TRANSFER_TRACKS' not in final['persistent']['clueIds']

write_json('final-integrity.json', {
    'checkedAtUTC': datetime.now(timezone.utc).isoformat(), 'head': git('rev-parse', 'HEAD'),
    'branch': git('branch', '--show-current'), 'stagedPaths': [],
    'baselineTrackedCount': len(baseline), 'changedTrackedPaths': changed,
    'unchangedTrackedCount': len(baseline) - len(changed), 'unexpectedChanges': [],
    'originalInstructionPreserved': instruction[0].name, 'priorSavePreservedSHA256': digest(prior_save),
    'v03PreservedSHA256': digest(source_art), 'primaryFinalSaveJSONIdentical': True,
    'resumeFinalSHA256': digest(evidence / 'resume-final.sqlite'),
    'b1BeforeAfterStateSQLiteIdentical': True, 'cartAcquisitionAndQuotaVerified': True,
    'primaryFinalKnowledgeCounts': {k: len(final['persistent'][k]) for k in ['clueIds', 'deductionIds', 'memories']},
})
(evidence / 'changed-files.txt').write_text('TRACKED MODIFIED\n' + '\n'.join(changed) +
    '\n\nUNTRACKED (includes preserved pre-existing instruction)\n' + '\n'.join(new_files) + '\n', encoding='utf-8')
(evidence / 'final-status.txt').write_text(git('status', '--short', '--untracked-files=all') + '\n', encoding='utf-8')
(evidence / 'final-unstaged.patch').write_bytes(subprocess.check_output(['git', 'diff', '--binary'], cwd=root))
result = subprocess.run(['git', 'diff', '--check'], cwd=root, capture_output=True)
(evidence / 'diff-check-final.log').write_bytes(result.stdout + result.stderr)
assert result.returncode == 0

code_paths = sorted(set(git('ls-files', 'src', 'scripts', 'package.json', 'package-lock.json', 'tsconfig.json').splitlines()
    + [p for p in new_files if p.startswith(('src/', 'scripts/'))]))
csv_out(evidence / 'code-sha256-final.csv', [{'path': p, 'sha256': digest(root / p)} for p in code_paths], ['path', 'sha256'])

# Comparison sheet only: original screenshots remain unchanged.
before = next(evidence.glob('*-clone-b1-uninspected.jpg'))
after = next(evidence.glob('*-clone-b1-after-uninspected.jpg'))
pictures = [Image.open(before).convert('RGB'), Image.open(after).convert('RGB')]
sheet = Image.new('RGB', (sum(p.width for p in pictures), max(p.height for p in pictures) + 32), '#101820')
draw = ImageDraw.Draw(sheet)
x = 0
for pic, caption in zip(pictures, ['BEFORE: same save 00:01, cart touch blocked', 'AFTER: same save 00:01, hotspot fitted']):
    draw.text((x + 8, 8), caption, fill='white')
    sheet.paste(pic, (x, 32))
    x += pic.width
sheet.save(batch / 'ART_REVIEW/b1-input-before-after.jpg', quality=92)

rows = [{'path': str(p.relative_to(batch)).replace('\\', '/'), 'bytes': p.stat().st_size, 'sha256': digest(p)}
        for p in sorted(batch.rglob('*')) if p.is_file() and p.name != 'artifact-manifest.csv' and '__pycache__' not in p.parts]
csv_out(batch / 'artifact-manifest.csv', rows, ['path', 'bytes', 'sha256'])
print(json.dumps({'artifacts': len(rows), 'codeFiles': len(code_paths), 'changedTracked': len(changed),
                  'checks': 'PASS', 'resume': digest(evidence / 'resume-final.sqlite')}))
