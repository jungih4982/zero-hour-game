"""Run native ComfyUI BiRefNet matting; keep approved artwork RGB unchanged."""
from pathlib import Path
import ast,json,uuid
from urllib.request import urlopen,Request
out=Path(__file__).resolve().parent
comfy=Path('C:/AI/ComfyUI_windows_portable/ComfyUI')
url='http://127.0.0.1:8188'
schema=json.load(urlopen(url+'/object_info'))
# Reuse only the pure UI serializer, not the earlier generation script's side effects.
tree=ast.parse((out/'qwen-workflow.py').read_text(encoding='utf-8'))
fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='make_ui')
exec(compile(ast.Module(body=[fn],type_ignores=[]),'<workflow serializer>','exec'))
prompt={
 '1':{'class_type':'LoadImage','inputs':{'image':'ZERO_HOUR_Minseo_approved_direction_A_20260912.png'}},
 '2':{'class_type':'LoadBackgroundRemovalModel','inputs':{'bg_removal_name':'birefnet.safetensors'}},
 '3':{'class_type':'RemoveBackground','inputs':{'bg_removal_model':['2',0],'image':['1',0]}},
 '4':{'class_type':'InvertMask','inputs':{'mask':['3',0]}},
 '5':{'class_type':'JoinImageWithAlpha','inputs':{'image':['1',0],'alpha':['4',0]}},
 '6':{'class_type':'SaveImage','inputs':{'images':['5',0],'filename_prefix':'ZERO_HOUR/MINSEO_APPROVED_A_RGBA_20260912'}},
 '7':{'class_type':'MaskToImage','inputs':{'mask':['3',0]}},
 '8':{'class_type':'SaveImage','inputs':{'images':['7',0],'filename_prefix':'ZERO_HOUR/MINSEO_APPROVED_A_MASK_20260912'}},
}
workflow=make_ui(prompt)
for path,data in [(out/'cutout-api.json',prompt),(out/'cutout-workflow.json',workflow),
    (comfy/'user/default/workflows/ZERO_HOUR_MINSEO_ALPHA_20260912.json',workflow)]:
    assert not path.exists()
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
payload={'prompt':prompt,'client_id':'zero-hour-minseo-20260912','extra_data':{'extra_pnginfo':{'workflow':workflow}}}
result=json.load(urlopen(Request(url+'/prompt',json.dumps(payload).encode(),headers={'Content-Type':'application/json'})))
(out/'cutout-job.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
