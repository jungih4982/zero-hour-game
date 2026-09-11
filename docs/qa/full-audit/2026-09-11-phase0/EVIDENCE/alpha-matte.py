from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
r=Path('C:/Dev/zero-hour-game');o=r/'docs/qa/full-audit/2026-09-11-phase0/ART_CONTACT_SHEETS'
p=r/'assets/characters/minseo/sprites/CHAR_Minseo_Clinical_Full_v02.png'
im=Image.open(p).convert('RGBA');im.thumbnail((448,672));s=Image.new('RGB',(896,712));s.paste((225,225,225),(0,0,448,712));s.paste((90,100,120),(448,0,896,712));s.paste(im,(0,0),im);s.paste(im,(448,0),im);d=ImageDraw.Draw(s);d.text((10,680),'Clinical Full v02 - source alpha on light / gray',fill='black');s.save(o/'minseo-alpha-mattes.png')
