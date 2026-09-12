export type GameLayoutMode = 'phone' | 'tablet' | 'landscape' | 'desktop';

export type GameLayout = {
  mode: GameLayoutMode;
  overlayDialogue: boolean;
  stageHeight: number;
  dialogWidth: number;
  dialogMaxHeight: number;
  horizontalGutter: number;
  spriteWidth: number;
  spriteHeight: number;
};

export type CharacterStageAnchor = { left: number } | { right: number };

export type CoverPlacement = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type TitleBackgroundMotion = {
  scale: [number, number];
  translateX: [number, number];
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const FULL_BODY_SPRITE_ASPECT = 1.5;

// Keep inspection targets outside the dialogue dock, including landscape's
// right-hand panel. Coordinates describe the usable stage, not the whole screen.
export function getInvestigationHotspotPosition({
  x, y, viewportWidth, viewportHeight, dialogueHeight, dialogueWidth,
  dialogueRight, sideDialogue, safeTop,
}: {
  x: number; y: number; viewportWidth: number; viewportHeight: number;
  dialogueHeight: number; dialogueWidth: number; dialogueRight: number;
  sideDialogue: boolean; safeTop: number;
}): { left: number; top: number } {
  const radius = 28;
  const stageWidth = sideDialogue
    ? viewportWidth - dialogueWidth - dialogueRight
    : viewportWidth;
  const stageBottom = sideDialogue ? viewportHeight - 24 : viewportHeight - dialogueHeight;
  const stageTop = Math.max(100, safeTop + 72);
  return {
    left: 12 + clamp(x, 0, 1) * Math.max(0, stageWidth - radius * 2 - 24),
    top: stageTop + clamp(y, 0, 1) * Math.max(0, stageBottom - stageTop - radius * 2 - 12),
  };
}

export function getTitleBackgroundMotion(tabletLandscape: boolean): TitleBackgroundMotion {
  return tabletLandscape
    ? { scale: [1.035, 1.055], translateX: [0, -10] }
    : { scale: [1.04, 1.055], translateX: [0, -5] };
}

export function getCoverPlacement({
  viewportWidth,
  viewportHeight,
  imageWidth,
  imageHeight,
  focalX = 0.5,
  focalY = 0.5,
  zoom = 1,
}: {
  viewportWidth: number;
  viewportHeight: number;
  imageWidth: number;
  imageHeight: number;
  focalX?: number;
  focalY?: number;
  zoom?: number;
}): CoverPlacement {
  const imageAspect = imageWidth / Math.max(imageHeight, 1);
  const viewportAspect = viewportWidth / Math.max(viewportHeight, 1);
  const coverWidth = viewportAspect > imageAspect
    ? viewportWidth
    : viewportHeight * imageAspect;
  const coverHeight = viewportAspect > imageAspect
    ? viewportWidth / imageAspect
    : viewportHeight;
  const safeZoom = Math.max(1, zoom);
  const width = coverWidth * safeZoom;
  const height = coverHeight * safeZoom;

  return {
    width,
    height,
    left: -(width - viewportWidth) * clamp(focalX, 0, 1),
    top: -(height - viewportHeight) * clamp(focalY, 0, 1),
  };
}

export function getCharacterStageAnchors({
  viewportWidth,
  horizontalGutter,
  spriteWidth,
  characterCount,
  overlayDialogue,
}: {
  viewportWidth: number;
  horizontalGutter: number;
  spriteWidth: number;
  characterCount: number;
  overlayDialogue: boolean;
}): readonly CharacterStageAnchor[] {
  if (characterCount <= 0) return [];
  if (characterCount >= 2) {
    return [{ left: horizontalGutter }, { right: horizontalGutter }];
  }
  return overlayDialogue
    ? [{ left: horizontalGutter }]
    : [{ left: (viewportWidth - spriteWidth) / 2 }];
}

/**
 * Layout math is kept outside React so the supported device shapes can be
 * verified without relying on a particular browser or simulator.
 */
export function getGameLayout(width: number, height: number): GameLayout {
  const aspectRatio = width / Math.max(height, 1);
  // Large iPads report desktop-like logical widths in landscape. Requiring a
  // wide desktop aspect keeps 11/13-inch iPads on the touch-first layout.
  const desktop = width >= 1280 && height >= 720 && aspectRatio >= 1.5;
  const landscape = !desktop && aspectRatio >= 1.25;
  const tablet = !desktop && !landscape && width >= 700;
  const mode: GameLayoutMode = desktop
    ? 'desktop'
    : landscape
      ? 'landscape'
      : tablet
        ? 'tablet'
        : 'phone';
  const overlayDialogue = desktop || landscape;

  if (overlayDialogue) {
    const compact = mode === 'landscape';
    const tabletLandscape = compact && height >= 700;
    const desiredSpriteWidth = clamp(
      width * (tabletLandscape ? 0.34 : compact ? 0.27 : 0.32),
      170,
      470,
    );
    const maximumSpriteHeight = clamp(
      height * (tabletLandscape ? 0.91 : compact ? 0.86 : 0.82),
      250,
      820,
    );
    const spriteWidth = Math.min(
      desiredSpriteWidth,
      maximumSpriteHeight / FULL_BODY_SPRITE_ASPECT,
    );
    return {
      mode,
      overlayDialogue,
      stageHeight: height,
      dialogWidth: clamp(
        width * (tabletLandscape ? 0.54 : compact ? 0.58 : 0.56),
        tabletLandscape ? 560 : 440,
        820,
      ),
      dialogMaxHeight: clamp(
        height * (tabletLandscape ? 0.68 : compact ? 0.82 : 0.72),
        tabletLandscape ? 420 : 300,
        700,
      ),
      horizontalGutter: clamp(width * 0.045, 24, 76),
      spriteWidth,
      spriteHeight: spriteWidth * FULL_BODY_SPRITE_ASPECT,
    };
  }

  const stageHeight = tablet
    ? clamp(height * 0.46, 350, 520)
    : clamp(height * 0.43, 280, 360);
  const desiredSpriteWidth = tablet
    ? clamp(width * 0.38, 210, 300)
    : clamp(width * 0.46, 140, 190);
  const maximumSpriteHeight = stageHeight - 44;
  const spriteWidth = Math.min(
    desiredSpriteWidth,
    maximumSpriteHeight / FULL_BODY_SPRITE_ASPECT,
  );

  return {
    mode,
    overlayDialogue,
    stageHeight,
    dialogWidth: width,
    dialogMaxHeight: Math.max(360, height - stageHeight),
    horizontalGutter: tablet ? 26 : 12,
    spriteWidth,
    spriteHeight: spriteWidth * FULL_BODY_SPRITE_ASPECT,
  };
}
