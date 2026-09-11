"""Review-only contact sheets. Sources are never retouched or overwritten."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

root = Path('C:/Dev/zero-hour-game')
out = Path(__file__).resolve().parent
font = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 17)
small = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 14)
titlefont = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 26)
current = root/'assets/characters/minseo/sprites/CHAR_Minseo_Clinical_Full_v02.png'
face = root/'assets/characters/minseo/master/CHAR_Minseo_FaceMaster_v02.png.png'
entries = [(current,'현재 런타임 v02','원본 보존 / 가운 알파 소실')] + [
    (out/f'minseo-mj-reference-{x}.png',f'검토 후보 {x}','미승인 / 불투명 회색 배경') for x in 'ABCD']

def panel(canvas, p, x, y, w, h, crop=None, trim=False):
    im = Image.open(p).convert('RGBA')
    if trim:
        im = im.crop(im.getbbox())
    if crop:
        im = im.crop(tuple(int(v * (im.width if i % 2 == 0 else im.height)) for i,v in enumerate(crop)))
    im.thumbnail((w,h), Image.Resampling.LANCZOS)
    canvas.paste(im,(x+(w-im.width)//2,y+(h-im.height)//2),im)

sheet = Image.new('RGB',(1600,670),(126,132,133)); d=ImageDraw.Draw(sheet)
d.rectangle((0,0,1600,73),fill=(22,30,40)); d.text((20,12),'민서 화풍 교정 — 런타임 교체 전 검토',font=titlefont,fill='white')
d.text((20,47),'동일 캔버스 비율로 비교. 후보는 얼굴·체형 승인 및 알파 제작 전이며 게임에 연결하지 않았다.',font=small,fill='#d0d9df')
for i,(p,label,status) in enumerate(entries):
    panel(sheet,p,320*i,82,320,500)
    d.rectangle((320*i,590,320*(i+1),670),fill=(22,30,40))
    d.text((320*i+12,600),label,font=font,fill='white'); d.text((320*i+12,629),status,font=small,fill='#d0d9df')
sheet.save(out/'minseo-body-comparison.jpg',quality=94)

# Explicit, reviewable crops include hairline/ears/chin, not biometric matching.
faces=[(current,'현재 v02',(.22,.01,.74,.36)),(face,'기존 FaceMaster v02 후보',(.14,.035,.91,.62))]+[
    (p,label,(.27,.025,.66,.34)) for p,label,_ in entries[1:]]
fsheet=Image.new('RGB',(1200,900),(126,132,133)); fd=ImageDraw.Draw(fsheet)
for i,(p,label,crop) in enumerate(faces):
    x=(i%3)*400; y=(i//3)*450; panel(fsheet,p,x,y,400,392,crop)
    status='사용 중' if i == 0 else '미승인'
    fd.rectangle((x,y+395,x+400,y+450),fill=(22,30,40)); fd.text((x+15,y+409),label+' / '+status,font=font,fill='white')
fsheet.save(out/'minseo-face-comparison.jpg',quality=95)

cast=[(current,'민서 / 현재 v02'),
 (root/'assets/characters/yujin/sprites/CHAR_Yujin_Alarmed_Full_v03.png','유진 / Alarmed v03'),
 (root/'assets/characters/taejun/sprites/CHAR_Taejun_Watchful_Full_v01.png','태준 / Watchful v01'),
 (out/'minseo-mj-reference-A.png','민서 후보 A / 미승인')]
cs=Image.new('RGB',(1280,600),(126,132,133)); cd=ImageDraw.Draw(cs)
for i,(p,label) in enumerate(cast):
    crop=None if i in (0,3) else (0,0,1,.72)
    panel(cs,p,i*320,0,320,530,crop,trim=True); cd.rectangle((i*320,535,(i+1)*320,600),fill=(22,30,40))
    cd.text((i*320+10,552),label,font=font,fill='white')
cs.save(out/'cast-style-comparison.jpg',quality=94)

for n in ['01','02']:
    im=Image.open(out/f'comfy-style-study-{n}.png')
    for key in ['prompt','workflow']:
        (out/f'comfy-style-study-{n}-{key}.json').write_text(json.dumps(json.loads(im.info[key]),ensure_ascii=False,indent=2),encoding='utf-8')

evidence=out.parent/'EVIDENCE'
before=Image.open(evidence/'054-before-f04-false-history.png').convert('RGB')
after=Image.open(evidence/'062-verified-f04-fact-feedback.png').convert('RGB')
pair=Image.new('RGB',(904,1019),(22,30,40)); pd=ImageDraw.Draw(pair)
pd.text((15,14),'수정 전 / 경험하지 않은 결말',font=font,fill='white')
pd.text((467,14),'최종 수정 / 확인한 기억 사실',font=font,fill='white')
pair.paste(before,(0,62)); pair.paste(after,(452,62))
pair.save(evidence/'f04-before-after.jpg',quality=95)
print('Review sheets created; no source asset changes.')
