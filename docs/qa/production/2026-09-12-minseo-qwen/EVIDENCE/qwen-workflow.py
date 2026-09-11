"""Create a named ZERO HOUR Comfy workflow using installed nodes and the local API."""
from pathlib import Path
import json, shutil, uuid
from urllib.request import urlopen, Request

root = Path('C:/Dev/zero-hour-game')
out = Path(__file__).resolve().parent
comfy = Path('C:/AI/ComfyUI_windows_portable/ComfyUI')
url = 'http://127.0.0.1:8188'
schema = json.load(urlopen(url+'/object_info'))
source = root/'docs/qa/production/2026-09-11-safe-a/ART_REVIEW/minseo-mj-reference-A.png'
input_name = 'ZERO_HOUR_Minseo_approved_direction_A_20260912.png'
target = comfy/'input'/input_name
assert not target.exists()
shutil.copy2(source, target)

positive = ('Clinical noir Korean webtoon visual novel character sprite, single adult Korean woman doctor. '
    'Keep the input composition, face proportions, narrow almond eyes, long straight side-parted black hair, '
    'visible ear, reserved clinical expression, white opaque long doctor coat over charcoal gray V-neck scrubs, '
    'drawstring waist, one hand in the coat pocket and the other relaxed. Head to mid thighs. '
    'Fine restrained black linework, matte muted colors, subtle two-tone shadows on skin and cloth. '
    'Plain flat medium gray background. The coat is solid opaque white cloth including its lower panels. '
    'No accessories, no badge, no stethoscope, no text, no change of pose or outfit.')
negative = 'photograph, photorealistic, glossy skin, plastic, 3d render, oversized eyes, child, chibi, jewelry, wristwatch, stethoscope, badge, text, watermark, new clothing, duplicate person, hospital background'
prompt = {
 '1': {'class_type':'UNETLoader','inputs':{'unet_name':'qwen_image_2512_fp8_e4m3fn.safetensors','weight_dtype':'default'}},
 '2': {'class_type':'CLIPLoader','inputs':{'clip_name':'qwen_2.5_vl_7b_fp8_scaled.safetensors','type':'qwen_image','device':'default'}},
 '3': {'class_type':'VAELoader','inputs':{'vae_name':'qwen_image_vae.safetensors'}},
 '4': {'class_type':'ModelSamplingAuraFlow','inputs':{'model':['1',0],'shift':3.1}},
 '5': {'class_type':'CFGNorm','inputs':{'model':['4',0],'strength':1.0,'pre_cfg':False}},
 '6': {'class_type':'CLIPTextEncode','inputs':{'clip':['2',0],'text':positive}},
 '7': {'class_type':'CLIPTextEncode','inputs':{'clip':['2',0],'text':negative}},
 '8': {'class_type':'LoadImage','inputs':{'image':input_name}},
 '9': {'class_type':'VAEEncode','inputs':{'pixels':['8',0],'vae':['3',0]}},
 '10': {'class_type':'KSampler','inputs':{'model':['5',0],'seed':2026091201,'steps':20,'cfg':4.0,'sampler_name':'euler','scheduler':'simple','positive':['6',0],'negative':['7',0],'latent_image':['9',0],'denoise':0.2}},
 '11': {'class_type':'VAEDecode','inputs':{'samples':['10',0],'vae':['3',0]}},
 '12': {'class_type':'SaveImage','inputs':{'images':['11',0],'filename_prefix':'ZERO_HOUR/MINSEO_QWEN_2512_REFINEMENT_20260912'}},
}

def make_ui(prompt):
    nodes=[]; links=[]; next_link=1
    for idx,(nid,entry) in enumerate(prompt.items()):
        info=schema[entry['class_type']]
        node={'id':int(nid),'type':entry['class_type'],'pos':[(idx%4)*350,(idx//4)*430],
            'size':[320,360 if entry['class_type'] in ('CLIPTextEncode','LoadImage','SaveImage') else 230],
            'flags':{},'order':idx,'mode':0,'inputs':[],'outputs':[],
            'properties':{'Node name for S&R':entry['class_type']},'widgets_values':[], 'widgets_values_named':{}}
        for key,value in entry['inputs'].items():
            spec=info['input'].get('required',{}).get(key,info['input'].get('optional',{}).get(key))
            if isinstance(value,list):
                typ=spec[0]; link=next_link; next_link+=1
                node['inputs'].append({'name':key,'type':typ,'link':link})
                links.append([link,int(value[0]),value[1],int(nid),len(node['inputs'])-1,typ])
            else:
                typ='COMBO' if isinstance(spec[0],list) else spec[0]
                node['inputs'].append({'name':key,'type':typ,'widget':{'name':key},'link':None})
                node['widgets_values'].append(value); node['widgets_values_named'][key]=value
                if key=='seed':
                    node['widgets_values'].append('fixed'); node['widgets_values_named']['control_after_generate']='fixed'
        for i,typ in enumerate(info.get('output',[])):
            node['outputs'].append({'name':info.get('output_name',info['output'])[i],'type':typ,'links':[]})
        nodes.append(node)
    for link,src,slot,dst,inp,typ in links:
        next(n for n in nodes if n['id']==src)['outputs'][slot]['links'].append(link)
    return {'id':str(uuid.uuid4()),'revision':0,'last_node_id':max(map(int,prompt)),
        'last_link_id':next_link-1,'nodes':nodes,'links':links,'groups':[], 'config':{},
        'extra':{'ds':{'scale':0.7,'offset':[70,70]}},'version':0.4}

workflow=make_ui(prompt)
name='ZERO_HOUR_MINSEO_QWEN_2512_20260912'
for path,data in [(out/'qwen-refinement-api.json',prompt),(out/'qwen-refinement-workflow.json',workflow),
    (comfy/'user/default/workflows'/f'{name}.json',workflow)]:
    assert not path.exists()
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
payload={'prompt':prompt,'client_id':'zero-hour-minseo-20260912','extra_data':{'extra_pnginfo':{'workflow':workflow}}}
result=json.load(urlopen(Request(url+'/prompt',json.dumps(payload).encode(),headers={'Content-Type':'application/json'})))
(out/'qwen-refinement-job.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
