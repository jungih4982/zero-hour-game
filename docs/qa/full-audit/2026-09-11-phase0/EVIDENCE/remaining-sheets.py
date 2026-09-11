from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import csv
root=Path('C:/Dev/zero-hour-game');out=root/'docs/qa/full-audit/2026-09-11-phase0'
seen={r['path'] if 'path' in r else list(r.values())[1] for r in csv.DictReader((out/'ART_ASSETS.csv').open(encoding='utf-8-sig'))}
files=[p for p in (root/'assets').rglob('*') if p.suffix.lower() in ['.png','.jpg','.jpeg'] and p.relative_to(root).as_posix() not in seen and 'backgrounds' not in p.parts]
f=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',12)
for start in range(0,len(files),8):
 s=Image.new('RGB',(1280,1040),(28,34,44));d=ImageDraw.Draw(s)
 for i,p in enumerate(files[start:start+8]):
  im=Image.open(p).convert('RGBA');im.thumbnail((302,430));x=i%4*320;y=i//4*520;s.paste(im,(x+(320-im.width)//2,y),im)
  name=p.relative_to(root).as_posix()
  for n in range(0,len(name),41):d.text((x+5,y+432+n//41*16),name[n:n+41],font=f,fill='white')
 s.save(out/f'ART_CONTACT_SHEETS/remaining-{start//8+1}.jpg')
(out/'EVIDENCE/remaining-art-index.txt').write_text('\n'.join(p.relative_to(root).as_posix() for p in files),encoding='utf-8')
print(len(files),'remaining images; sheets', (len(files)+7)//8)
