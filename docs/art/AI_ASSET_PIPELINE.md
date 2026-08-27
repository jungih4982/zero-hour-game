# AI Asset Production Pipeline

## Philosophy
Do not prompt every image from scratch. Build identities and reusable references first.

## Recommended hybrid stack
### Midjourney
Use for:
- style exploration
- character concept discovery
- key art composition
- master-reference candidates
- hero CG ideation

### Local Stable Diffusion / Draw Things / ComfyUI
Use for:
- repeatable production
- character LoRA workflows
- pose/expression variants
- ControlNet/reference-guided outputs
- inpainting
- deterministic workflow storage

### Image editor
Use Affinity Photo, Photoshop, Krita, or equivalent for:
- cleanup
- masks
- transparent sprites
- typography/signage fixes
- hand/eye fixes
- composition polish

## MacBook Air M5 24GB strategy
Prefer workflows that fit comfortably rather than chasing the largest checkpoint.

Production default:
- SDXL/Illustrious-family character workflow
- character-specific LoRA
- reference conditioning
- ControlNet/OpenPose when exact pose matters

Use heavier quantized models only for special edits or hero images where iteration speed is less important.

## Character pipeline
1. Explore 50–150 concepts, not final game assets.
2. Select ONE canonical face/body/costume.
3. Write `identity.md` with immutable traits.
4. Produce master views.
5. Curate a clean training/reference set.
6. Train or prepare character LoRA/reference workflow.
7. Stress-test 20 outputs across poses, expressions, lighting.
8. Lock character only after consistency passes.
9. Generate production sprites.
10. Log model, LoRA, seed, workflow version, references.

## Environment pipeline
1. Draw a rough floor plan first.
2. Define materials and architectural era.
3. Generate one master wide shot.
4. Establish 2–4 camera anchors.
5. Generate state variants from references, not from scratch.
6. Fix signage and spatial contradictions manually.

## Hero CG pipeline
1. storyboard thumbnail
2. lock characters and location references
3. generate composition candidates
4. select one
5. inpaint identity/costume errors
6. hand-fix critical anatomy/props
7. color-match to Visual Bible
8. archive prompt/workflow metadata

## Consistency test
A character is NOT locked until 20 random outputs satisfy:
- face immediately recognizable
- hair design stable
- costume identity stable
- signature accessories stable
- age does not drift
- body proportions do not visibly drift

Target: 16/20 acceptable without major repaint.

## Metadata
Every approved asset should have a sibling `.json` or project database entry containing:
- asset id
- generator/model
- model version
- seed
- LoRAs and weights
- references
- prompt
- negative prompt if relevant
- workflow file
- date
- manual edits performed
- commercial-license note
