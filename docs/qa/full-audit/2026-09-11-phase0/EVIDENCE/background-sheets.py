from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
r=Path('C:/Dev/zero-hour-game');o=r/'docs/qa/full-audit/2026-09-11-phase0/ART_CONTACT_SHEETS'
files=list((r/'assets/backgrounds').rglob('*.png')); font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)
for start in range(0,len(files),9):
 canvas=Image.new('RGB',(1350,900),(26,34,44)); d=ImageDraw.Draw(canvas)
 for i,p in enumerate(files[start:start+9]):
  im=Image.open(p).convert('RGBA');im.thumbnail((440,260));x=(i%3)*450;y=(i//3)*300;canvas.paste(im,(x+(450-im.width)//2,y),im);d.text((x+5,y+266),p.name,font=font,fill='white')
 canvas.save(o/f'backgrounds-{start//9+1}.jpg')
print('background/CG images',len(files))
