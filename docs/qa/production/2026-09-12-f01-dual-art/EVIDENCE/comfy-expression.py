from pathlib import Path
import json, shutil
from urllib.request import urlopen, Request
out=Path(__file__).resolve().parent
root=Path.cwd();comfy=Path('C:/AI/ComfyUI_windows_portable/ComfyUI')
name='ZERO_HOUR_F01_Minseo_v03_20260912.png'
target=comfy/'input'/name
assert not target.exists(), 'Never replace a user input'
shutil.copy2(root/'assets/characters/minseo/sprites/CHAR_Minseo_Clinical_ThreeQuarter_v03.png',target)
api=json.loads((root/'docs/qa/production/2026-09-12-minseo-qwen/EVIDENCE/qwen-refinement-api.json').read_text())
api['8']['inputs']['image']=name
api['6']['inputs']['text']='Clinical noir Korean webtoon visual novel character sprite of the same adult Korean woman doctor in the input image. Preserve exactly the same narrow black eyes, long face, lip shape, apparent age, long side-parted black hair, exposed ear, matte skin, black linework, white opaque doctor coat and charcoal V-neck scrubs, waist drawstring and pose, head to mid thighs. Expression purpose: she asks a careful clinical question about a possible head injury in CH3, restrained concentration, a very slight inward tension of the eyebrows, no anger, no sadness, no smile, lips and eyes remain the same shape. Flat gray backdrop. No new accessories or objects. Same illustration style and proportions.'
api['10']['inputs'].update(seed=2026091219,steps=20,denoise=0.25)
api['12']['inputs']['filename_prefix']='ZERO_HOUR/F01_MINSEO_QWEN_2512_RAW_20260912'
api.update({
 '20':{'class_type':'SolidMask','inputs':{'value':0,'width':896,'height':1344}},
 '21':{'class_type':'SolidMask','inputs':{'value':1,'width':145,'height':55}},
 '22':{'class_type':'FeatherMask','inputs':{'mask':['21',0],'left':12,'top':12,'right':12,'bottom':12}},
 '23':{'class_type':'MaskComposite','inputs':{'destination':['20',0],'source':['22',0],'x':310,'y':182,'operation':'add'}},
 '24':{'class_type':'ImageCompositeMasked','inputs':{'destination':['8',0],'source':['11',0],'x':0,'y':0,'resize_source':False,'mask':['23',0]}},
 '25':{'class_type':'JoinImageWithAlpha','inputs':{'image':['24',0],'alpha':['8',1]}},
 '26':{'class_type':'SaveImage','inputs':{'images':['25',0],'filename_prefix':'ZERO_HOUR/F01_MINSEO_QWEN_2512_FOCUSED_20260912'}},
 '27':{'class_type':'MaskToImage','inputs':{'mask':['23',0]}},
 '28':{'class_type':'SaveImage','inputs':{'images':['27',0],'filename_prefix':'ZERO_HOUR/F01_MINSEO_BROW_MASK_20260912'}},
})
(out/'comfy-expression-api.json').write_text(json.dumps(api,indent=2),encoding='utf-8')
queue=json.load(urlopen('http://127.0.0.1:8188/queue'))
(out/'comfy-queue-before.json').write_text(json.dumps(queue,indent=2))
assert not queue.get('queue_running') and not queue.get('queue_pending'),'Wait for user jobs; do not interrupt'
result=json.load(urlopen(Request('http://127.0.0.1:8188/prompt',json.dumps({'prompt':api,'client_id':'zero-hour-f01-20260912'}).encode(),{'Content-Type':'application/json'})))
(out/'comfy-expression-job.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
