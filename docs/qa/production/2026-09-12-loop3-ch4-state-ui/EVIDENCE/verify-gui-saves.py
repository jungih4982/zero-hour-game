"""Assert exported GUI checkpoints; never modifies or injects game state."""
import json,pathlib,copy
p=pathlib.Path(__file__).resolve().parent
def read(name):return json.loads((p/(name+'.json')).read_text(encoding='utf8'))
def state(name):return read(name)['zero-hour-narrative-save']['state']['engineState']
before=state('before-loop3-choice'); migrated=state('after03-original-loop3-choice')
assert read('after03-original-loop3-choice')['zero-hour-narrative-save']['version']==6
assert before['volatile']==migrated['volatile']
expected=copy.deepcopy(before)
for m in expected['persistent']['memories']:
    if m['id']=='MEMORY_0106_SEAL':
        del m['payoff']['usableFrom'];m['payoff']['eventTime']=223
assert expected==migrated
used=state('after03-original-memory-used')
assert used['persistent']==migrated['persistent']
assert used['volatile']['time']==0 and used['volatile']['clock']['events']=={}
assert used['volatile']['flags']=={'FLAG_0106_AVOIDANCE_PLANNED':True}
assert used['volatile']['itemIds']==[] and not used['volatile'].get('deathId')
for condition in ['A','B','C']:
    s=state('after02-b1-'+condition+'-cart-repeat')
    assert s['volatile']['time']==160
    assert s['persistent']['clueIds'].count('CLUE_B1_TRANSFER_TRACKS')==1
    assert 'CLUE_B1_UNMARKED_ROOMS' not in s['persistent']['clueIds']
assert state('after02-b1-C-quota-guard')==state('after02-b1-C-cart-repeat')
for suffix in ['linen','scrolled','menu-resumed']:
    s=state('after02-b1-C-'+suffix)
    assert s['volatile']['time']==162
    assert s['volatile']['flags']['B1_LINEN_ROOM_FOUND'] is True
assert state('after02-b1-C-linen')==state('after02-b1-C-menu-resumed')
assert state('after02-b1-C-entered-linen')['volatile']['currentSceneId']=='SCENE_LOOP2_SEA_FIRST_MEETING'
map_states=[state(n) for n in ['after02-map-A-date-repeat','after02-map-B-date-repeat','after01-map-C-date-repeat']]
assert all(s==map_states[0] for s in map_states)
assert map_states[0]['volatile']['time']==177
assert state('before-map-ready')['volatile']['time']==176
print('GUI exports PASS: v5 to v6 exact preservation except intended seal metadata; no early event; A/B/C cart +2 and map date +1 once; quota, required linen, scroll, menu and linen-scene connection.')

# Final Metro 04: a separate fresh normal UI journey, then a cold launch without injection.
fresh = state('fresh-final-loop3-memory-choice')
assert fresh['persistent']['loopCount'] == 3 and fresh['volatile']['time'] == 0
assert fresh['volatile']['clock']['contractVersion'] == 1
assert fresh['volatile']['clock']['events'] == {}
assert fresh['volatile']['itemIds'] == [] and fresh['volatile']['flags'] == {}
assert [d['time'] for d in fresh['persistent']['deathRecords']] == [157, 223]
assert fresh['persistent']['flags']['BAND_CUSTODY_YUJIN'] is True
assert fresh['persistent']['flags']['TRUST_YUJIN_PROGRESS'] == 1
assert 'CLUE_B1_TRANSFER_TRACKS' not in fresh['persistent']['clueIds']
assert 'CLUE_B1_UNMARKED_ROOMS' in fresh['persistent']['clueIds']
seal = next(m for m in fresh['persistent']['memories'] if m['id'] == 'MEMORY_0106_SEAL')
assert seal['payoff']['eventTime'] == 223 and 'usableFrom' not in seal['payoff']
assert read('fresh-final-loop3-memory-choice')['zero-hour-game-preferences']['state']['lastBeatIndex'] == 8
assert state('fresh-final-loop3-memory-used')['volatile']['clock']['events'] == {}
assert state('fresh-final-loop3-memory-used')['volatile']['time'] == 0
for checkpoint in ['fresh-final-taejun-complete', 'fresh-final-cold-resumed', 'final-resume']:
    assert read(checkpoint) == read('fresh-final-taejun-complete'), checkpoint
final = state('final-resume')
assert final['volatile']['currentSceneId'] == 'SCENE_CH4_T_03'
assert final['volatile']['time'] == 53
assert final['volatile']['itemIds'] == ['B2_SECURITY_KEY']
assert final['persistent']['clueIds'].count('CCTV_ORIGINAL_GAP') == 1
assert final['volatile']['clock']['events'] == {}
assert len(final['persistent']['memories']) == 3
assert len(final['persistent']['clueIds']) == 20
assert len(final['persistent']['deductionIds']) == 4
assert state('after04-taejun-complete') == state('after04-taejun-resumed')
sea = state('after04-sea-S01-complete')
assert sea['volatile']['time'] == 157
assert sea['volatile']['clock']['events'] == {'blackout': 157}
assert sea['volatile']['itemIds'] == [] and not sea['persistent']['flags'].get('TRUST_SEA')
# Same fresh B1 checkpoint, copied only to the isolated device for the optional branch.
assert state('fresh-final-b1-ready')['volatile']['time'] == 158
assert state('final-bypass-C-cart')['volatile']['time'] == 160
assert state('final-bypass-C-cart')['persistent']['clueIds'].count('CLUE_B1_TRANSFER_TRACKS') == 1
bypass = state('final-bypass-C-upstairs-ready')
assert bypass['volatile']['time'] == 164
assert bypass['volatile']['currentSceneId'] == 'SCENE_LOOP2_SEOYUN_RECHECK'
assert 'CLUE_B1_UNMARKED_ROOMS' not in bypass['persistent']['clueIds']
assert state('final-bypass-C-return302')['volatile']['time'] == 166
assert state('final-bypass-C-return302')['volatile']['currentSceneId'] == 'SCENE_LOOP2_RETURN_302'
assert state('fresh-final-minseo-solo-ready') == state('art-solo-C-unchanged')
print('Final Metro 04 GUI exports PASS: fresh two-reset journey, earned early memory, no early seal, CH4 T03 reward once and exact parsed cold resume; Sea midnight; copied cart bypass; art scroll preserves state.')
