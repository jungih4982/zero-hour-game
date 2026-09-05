import {
  getCharacterStageAnchors,
  getCoverPlacement,
  getGameLayout,
  getTitleBackgroundMotion,
  getInvestigationHotspotPosition,
} from '../src/ui/layout';
import { chapter3Investigations, SCENE_CH3_TRANSFER_YUJIN } from '../src/content/chapter3';

const devices = [
  { name: 'compact phone', width: 360, height: 740, expected: 'phone' },
  { name: 'modern phone', width: 390, height: 844, expected: 'phone' },
  { name: 'large phone', width: 430, height: 932, expected: 'phone' },
  { name: 'tablet portrait', width: 768, height: 1024, expected: 'tablet' },
  { name: 'iPad Air 11 portrait', width: 820, height: 1180, expected: 'tablet' },
  { name: 'phone landscape', width: 844, height: 390, expected: 'landscape' },
  { name: 'iPad Air 11 landscape', width: 1180, height: 820, expected: 'landscape' },
  { name: 'iPad Pro 13 landscape', width: 1366, height: 1024, expected: 'landscape' },
  { name: 'desktop', width: 1440, height: 900, expected: 'desktop' },
] as const;

for (const device of devices) {
  const layout = getGameLayout(device.width, device.height);
  const sideDialogue = layout.overlayDialogue;
  const dialogueHeight = Math.min(560, device.height * 0.47);
  const positions: { left: number; top: number }[] = [];
  for (const { x, y } of chapter3Investigations[SCENE_CH3_TRANSFER_YUJIN].hotspots) {
    const position = getInvestigationHotspotPosition({
      x, y, viewportWidth: device.width, viewportHeight: device.height,
      dialogueHeight, dialogueWidth: layout.dialogWidth, dialogueRight: layout.horizontalGutter,
      sideDialogue, safeTop: 24,
    });
    const rightBoundary = sideDialogue ? device.width - layout.dialogWidth - layout.horizontalGutter : device.width;
    const bottomBoundary = sideDialogue ? device.height : device.height - dialogueHeight;
    if (position.left < 0 || position.left + 56 > rightBoundary || position.top < 96 || position.top + 56 > bottomBoundary) {
      throw new Error(`${device.name}: CH3 inspection target overlaps dialogue or leaves the safe stage`);
    }
    for (const previous of positions) {
      if (Math.abs(previous.left - position.left) < 56 && Math.abs(previous.top - position.top) < 56) {
        throw new Error(`${device.name}: CH3 inspection touch targets overlap each other`);
      }
    }
    positions.push(position);
  }
}

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
  if (device.name.includes('iPad') && layout.overlayDialogue) {
    if (layout.dialogWidth < device.width * 0.45 || layout.dialogWidth > device.width * 0.62) {
      throw new Error(`${device.name}: dialogue column is not tablet-readable`);
    }
    if (layout.spriteHeight > device.height * 0.92) {
      throw new Error(`${device.name}: character sprite clips vertically`);
    }
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

const portraitCover = getCoverPlacement({
  viewportWidth: 390,
  viewportHeight: 844,
  imageWidth: 1456,
  imageHeight: 816,
  focalX: 0.64,
  focalY: 0.54,
  zoom: 1.08,
});
if (portraitCover.width < 390 || portraitCover.height < 844) {
  throw new Error('portrait background must cover the fullscreen stage');
}
if (portraitCover.left >= 0) {
  throw new Error('portrait focal point must shift the landscape asset crop');
}
if (portraitCover.top >= 0) {
  throw new Error('portrait zoom must allow vertical focal positioning');
}

for (const [name, viewportWidth, tabletLandscape] of [
  ['compact portrait title', 360, false],
  ['tablet landscape title', 1180, true],
] as const) {
  const motion = getTitleBackgroundMotion(tabletLandscape);
  for (const index of [0, 1] as const) {
    const horizontalOverscan = viewportWidth * (motion.scale[index] - 1) / 2;
    if (horizontalOverscan < Math.abs(motion.translateX[index])) {
      throw new Error(`${name}: title background motion can expose an empty edge`);
    }
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
