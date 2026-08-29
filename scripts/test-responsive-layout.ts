import { getCharacterStageAnchors, getGameLayout } from '../src/ui/layout';

const devices = [
  { name: 'compact phone', width: 360, height: 740, expected: 'phone' },
  { name: 'modern phone', width: 390, height: 844, expected: 'phone' },
  { name: 'large phone', width: 430, height: 932, expected: 'phone' },
  { name: 'tablet portrait', width: 768, height: 1024, expected: 'tablet' },
  { name: 'phone landscape', width: 844, height: 390, expected: 'landscape' },
  { name: 'desktop', width: 1440, height: 900, expected: 'desktop' },
] as const;

for (const device of devices) {
  const layout = getGameLayout(device.width, device.height);
  if (layout.mode !== device.expected) {
    throw new Error(`${device.name}: expected ${device.expected}, got ${layout.mode}`);
  }
  if (layout.stageHeight < 250) {
    throw new Error(`${device.name}: scene stage is too short`);
  }
  if (!layout.overlayDialogue && device.height - layout.stageHeight < 380) {
    throw new Error(`${device.name}: dialogue area is too short`);
  }
  if (layout.spriteWidth > device.width * 0.5) {
    throw new Error(`${device.name}: character sprite obscures too much of the scene`);
  }
  const spriteAspect = layout.spriteHeight / layout.spriteWidth;
  if (Math.abs(spriteAspect - 1.5) > 0.01) {
    throw new Error(`${device.name}: character sprite would be cropped (${spriteAspect})`);
  }
  if (!layout.overlayDialogue && layout.spriteHeight > layout.stageHeight - 40) {
    throw new Error(`${device.name}: character sprite collides with the stage HUD`);
  }
  if (layout.dialogWidth > device.width) {
    throw new Error(`${device.name}: dialogue overflows horizontally`);
  }

  const singleAnchors = getCharacterStageAnchors({
    viewportWidth: device.width,
    horizontalGutter: layout.horizontalGutter,
    spriteWidth: layout.spriteWidth,
    characterCount: 1,
    overlayDialogue: layout.overlayDialogue,
  });
  const expectedSingleLeft = layout.overlayDialogue
    ? layout.horizontalGutter
    : (device.width - layout.spriteWidth) / 2;
  if (!('left' in singleAnchors[0]) || Math.abs(singleAnchors[0].left - expectedSingleLeft) > 0.01) {
    throw new Error(`${device.name}: single character is not at the required anchor`);
  }

  const duoAnchors = getCharacterStageAnchors({
    viewportWidth: device.width,
    horizontalGutter: layout.horizontalGutter,
    spriteWidth: layout.spriteWidth * 0.82,
    characterCount: 2,
    overlayDialogue: layout.overlayDialogue,
  });
  if (
    !('left' in duoAnchors[0])
    || !('right' in duoAnchors[1])
    || duoAnchors[0].left !== layout.horizontalGutter
    || duoAnchors[1].right !== layout.horizontalGutter
  ) {
    throw new Error(`${device.name}: two-character stage must use left/right anchors`);
  }
}

console.log(
  JSON.stringify(
    devices.map((device) => ({
      device: device.name,
      viewport: `${device.width}×${device.height}`,
      ...getGameLayout(device.width, device.height),
    })),
    null,
    2,
  ),
);
