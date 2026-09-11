from pathlib import Path
import csv,re
r=Path('C:/Dev/zero-hour-game');o=r/'docs/qa/full-audit/2026-09-11-phase0';doc=(r/'docs/art/ASSET_AUDIT_2026-08-29.md').read_text(encoding='utf-8')
with (o/'ART_ASSETS.csv').open(encoding='utf-8-sig') as f: rows=list(csv.DictReader(f))
for row in rows:
 n=Path(row['path']).name;match=re.search(r'\| `'+re.escape(n)+r'` \| ([^|]+) \| ([^|]+) \|',doc)
 row['prior_document_status']=match.group(2).strip() if match else 'NOT_LISTED_IN_2026_08_29_TABLE'
 row['approval_evidence']='docs/art/ASSET_AUDIT_2026-08-29.md; assets/ASSET_MANIFEST.json; no independent newer approval verified'
with (o/'ART_LOCK_COMPARISON.csv').open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
