from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json, csv, re
root=Path('C:/Dev/zero-hour-game')
out=root/'docs/qa/full-audit/2026-09-11-phase0'
manifest=json.loads((root/'assets/ASSET_MANIFEST.json').read_text(encoding='utf-8'))['verticalSlice']
runtime=(root/'src/ui/NarrativePlayer.tsx').read_text(encoding='utf-8')
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',14)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',12)
rows=[]
for person in ['seoyun','yujin','taejun','sea','minseo']:
    files=list((root/f'assets/characters/{person}/master').glob('*.png'))
    files+=list((root/f'assets/characters/{person}/refs').glob('*.png'))
    files+=[p for p in (root/f'assets/characters/{person}/sprites').glob('*.png') if p.name in runtime]
    cols=4; cw=320; ch=650
    sheet=Image.new('RGB',(cols*cw,((len(files)+cols-1)//cols)*ch),(26,34,44))
    d=ImageDraw.Draw(sheet)
    faces=Image.new('RGB',(cols*cw,((len(files)+cols-1)//cols)*370),(26,34,44)); fd=ImageDraw.Draw(faces)
    for i,p in enumerate(files):
        im=Image.open(p).convert('RGBA'); rel=p.relative_to(root).as_posix(); aid=p.relative_to(root/'assets').as_posix()
        status=next((k for k,v in manifest.items() if isinstance(v,list) and aid in v),'reference-approval-unverified')
        role='RUNTIME' if p.name in runtime else 'REFERENCE'
        x=(i%cols)*cw; y=(i//cols)*ch
        thumb=im.copy(); thumb.thumbnail((cw-20,ch-100)); sheet.paste(thumb,(x+(cw-thumb.width)//2,y),thumb)
        label=p.name.replace('CHAR_','').replace('_',' ')
        lines=[label[j:j+36] for j in range(0,len(label),36)]+[role,status]
        for j,l in enumerate(lines):d.text((x+8,y+ch-85+j*17),l,font=small,fill='white')
        # Transparent sprite: use alpha bounds. Reference portraits: top-center comparison window.
        bb=im.getbbox(); left,top,right,bottom=bb
        h=bottom-top; w=right-left
        # Documented heuristic crop; no facial feature retouching.
        # Manual fractions chosen after viewing every body sheet; include chin and ears.
        isclose=('FaceMaster' in p.name or 'BaseRef' in p.name or 'OldDesignRef' in p.name)
        if person=='seoyun':
            crop=im.crop((int(im.width*.08),int(im.height*.04),int(im.width*.94),int(im.height*.73)))
        elif isclose or (person in ['yujin','sea'] and 'Master_v01' in p.name):
            crop=im.crop((int(im.width*.15),int(im.height*.02),int(im.width*.88),int(im.height*.60)))
        elif person=='minseo' and 'Clinical' in p.name:
            crop=im.crop((int(im.width*.15),int(im.height*.01),int(im.width*.9),int(im.height*.50)))
        else:
            crop=im.crop((int(im.width*.29),int(im.height*.00),int(im.width*.70),int(im.height*.24)))
        crop.thumbnail((300,270)); fy=(i//cols)*370; faces.paste(crop,(x+(cw-crop.width)//2,fy),crop)
        for j,l in enumerate(lines):fd.text((x+8,fy+280+j*17),l,font=small,fill='white')
        rows.append([person,rel,role,status,im.width,im.height,str(bb),'CONTACT_SHEET_VIEW_PENDING'])
    sheet.save(out/f'ART_CONTACT_SHEETS/{person}-body.png')
    faces.save(out/f'ART_CONTACT_SHEETS/{person}-face.png')
with (out/'ART_ASSETS.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f);w.writerow(['character','path','role','manifest_status_not_new_approval','width','height','alpha_bbox','review']);w.writerows(rows)
print('Reference/runtime images:',len(rows))
