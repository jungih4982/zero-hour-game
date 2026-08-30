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

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const FULL_BODY_SPRITE_ASPECT = 1.5;

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
  const desktop = width >= 1000 && height >= 620;
  const landscape = !desktop && width / Math.max(height, 1) >= 1.35;
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
    const desiredSpriteWidth = clamp(width * (compact ? 0.27 : 0.32), 170, 470);
    const maximumSpriteHeight = clamp(height * (compact ? 0.86 : 0.82), 250, 760);
    const spriteWidth = Math.min(
      desiredSpriteWidth,
      maximumSpriteHeight / FULL_BODY_SPRITE_ASPECT,
    );
    return {
      mode,
      overlayDialogue,
      stageHeight: height,
      dialogWidth: clamp(width * (compact ? 0.58 : 0.56), 440, 820),
      dialogMaxHeight: clamp(height * (compact ? 0.82 : 0.72), 300, 700),
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
