import AppKit
import CoreGraphics
import Foundation
import ImageIO

enum SpriteExtractionError: Error, CustomStringConvertible {
  case invalidArguments
  case invalidImage(String)
  case invalidContext
  case missingOutput

  var description: String {
    switch self {
    case .invalidArguments:
      return "Usage: swift scripts/remove-character-background.swift <input> <output>"
    case let .invalidImage(path):
      return "Could not read image: \(path)"
    case .invalidContext:
      return "Could not create an RGBA image context."
    case .missingOutput:
      return "Could not encode the transparent PNG."
    }
  }
}

private func extractCharacter(from inputPath: String, to outputPath: String) throws {
  let inputURL = URL(fileURLWithPath: inputPath) as CFURL
  guard
    let source = CGImageSourceCreateWithURL(inputURL, nil),
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else {
    throw SpriteExtractionError.invalidImage(inputPath)
  }

  let width = image.width
  let height = image.height
  let bytesPerPixel = 4
  let bytesPerRow = width * bytesPerPixel
  var pixels = [UInt8](repeating: 0, count: height * bytesPerRow)
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  let bitmapInfo = CGBitmapInfo.byteOrder32Big.rawValue
    | CGImageAlphaInfo.premultipliedLast.rawValue

  guard let context = CGContext(
    data: &pixels,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: bitmapInfo
  ) else {
    throw SpriteExtractionError.invalidContext
  }
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

  // Generated sprite masters use either a pale neutral field, a baked pale
  // transparency grid, or an explicit chroma-green field. Flooding only from
  // the canvas edge preserves light and green details enclosed by the subject.
  func straightComponents(_ pixelIndex: Int) -> (red: Int, green: Int, blue: Int, alpha: Int) {
    let offset = pixelIndex * bytesPerPixel
    let alpha = Int(pixels[offset + 3])
    guard alpha > 0 else { return (0, 0, 0, 0) }

    // CGContext exposes premultiplied values. Convert back to straight RGB so
    // pale matte contamination remains detectable even on translucent pixels.
    let red = min(255, Int(pixels[offset]) * 255 / alpha)
    let green = min(255, Int(pixels[offset + 1]) * 255 / alpha)
    let blue = min(255, Int(pixels[offset + 2]) * 255 / alpha)
    return (red, green, blue, alpha)
  }

  func isPaleNeutral(_ pixelIndex: Int) -> Bool {
    let components = straightComponents(pixelIndex)
    guard components.alpha > 0 else { return false }
    let red = components.red
    let green = components.green
    let blue = components.blue
    let brightest = max(red, green, blue)
    let darkest = min(red, green, blue)
    let average = (red + green + blue) / 3
    return average >= 118 && brightest - darkest <= 52
  }

  func isChromaGreen(_ pixelIndex: Int) -> Bool {
    let components = straightComponents(pixelIndex)
    guard components.alpha > 0 else { return false }
    return components.green >= 145
      && components.green - components.red >= 48
      && components.green - components.blue >= 38
  }

  func isChromaFringe(_ pixelIndex: Int) -> Bool {
    let components = straightComponents(pixelIndex)
    guard components.alpha > 0 else { return false }
    return components.green >= 92
      && components.green - components.red >= 24
      && components.green - components.blue >= 22
  }

  func isBackdropColor(_ pixelIndex: Int) -> Bool {
    isPaleNeutral(pixelIndex) || isChromaGreen(pixelIndex)
  }

  func isBackdrop(_ pixelIndex: Int) -> Bool {
    let alpha = Int(pixels[pixelIndex * bytesPerPixel + 3])
    return alpha <= 56 || isBackdropColor(pixelIndex)
  }

  var removed = [Bool](repeating: false, count: width * height)
  var queue: [Int] = []
  queue.reserveCapacity(width * height / 2)

  func enqueue(_ index: Int) {
    guard !removed[index], isBackdrop(index) else { return }
    removed[index] = true
    queue.append(index)
  }

  for x in 0..<width {
    enqueue(x)
    enqueue((height - 1) * width + x)
  }
  for y in 0..<height {
    enqueue(y * width)
    enqueue(y * width + width - 1)
  }

  var cursor = 0
  while cursor < queue.count {
    let index = queue[cursor]
    cursor += 1
    let x = index % width
    let y = index / width
    if x > 0 { enqueue(index - 1) }
    if x + 1 < width { enqueue(index + 1) }
    if y > 0 { enqueue(index - width) }
    if y + 1 < height { enqueue(index + width) }
  }

  // Chroma green can be enclosed by loose hair or an arm and therefore remain
  // unreachable by the edge flood. It is safe to remove globally because the
  // generated character palette deliberately contains no saturated green.
  for index in removed.indices where !removed[index] && isChromaGreen(index) {
    removed[index] = true
  }

  // Some generated masters draw a dark outer ink line around a pale matte,
  // which leaves the pale fringe enclosed and unreachable by the edge flood.
  // A short distance field removes only neutral fringe close to transparency;
  // enclosed light details such as eyes remain far outside this radius.
  // Keep this deliberately narrow: it is an edge decontamination pass, not a
  // second subject mask. A broad radius erases pale clothing highlights.
  let maxFringeDistance = 4
  var distance = [Int16](repeating: -1, count: width * height)
  var distanceQueue: [Int] = []
  distanceQueue.reserveCapacity(width * height)
  for index in removed.indices where removed[index] {
    distance[index] = 0
    distanceQueue.append(index)
  }

  cursor = 0
  while cursor < distanceQueue.count {
    let index = distanceQueue[cursor]
    cursor += 1
    let currentDistance = Int(distance[index])
    guard currentDistance < maxFringeDistance else { continue }
    let x = index % width
    let y = index / width
    let neighbors = [
      x > 0 ? index - 1 : -1,
      x + 1 < width ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y + 1 < height ? index + width : -1,
    ]
    for neighbor in neighbors where neighbor >= 0 && distance[neighbor] < 0 {
      distance[neighbor] = Int16(currentDistance + 1)
      distanceQueue.append(neighbor)
    }
  }

  for index in removed.indices
    where !removed[index]
      && distance[index] > 0
      && distance[index] <= maxFringeDistance
      && (isBackdropColor(index) || isChromaFringe(index))
  {
    removed[index] = true
  }

  for index in removed.indices where removed[index] {
    let offset = index * bytesPerPixel
    pixels[offset] = 0
    pixels[offset + 1] = 0
    pixels[offset + 2] = 0
    pixels[offset + 3] = 0
  }

  // Neutralize chroma spill that is blended into antialiased hair and clothing
  // pixels. Removing those pixels entirely makes the silhouette look bitten;
  // clamping only the excess green keeps the original edge coverage intact.
  let maxSpillDistance = 8
  for index in removed.indices
    where !removed[index]
      && distance[index] > 0
      && distance[index] <= maxSpillDistance
  {
    let components = straightComponents(index)
    let neutralGreen = max(components.red, components.blue)
    guard components.green > neutralGreen + 6 else { continue }

    let offset = index * bytesPerPixel
    pixels[offset + 1] = UInt8(neutralGreen * components.alpha / 255)
  }

  // Feather one inner pixel at the matte boundary to avoid a hard cut.
  let sourcePixels = pixels
  for index in removed.indices where !removed[index] {
    let x = index % width
    let y = index / width
    let touchesRemoved =
      (x > 0 && removed[index - 1])
      || (x + 1 < width && removed[index + 1])
      || (y > 0 && removed[index - width])
      || (y + 1 < height && removed[index + width])
    guard touchesRemoved else { continue }

    let offset = index * bytesPerPixel
    let alpha = 196
    pixels[offset] = UInt8(Int(sourcePixels[offset]) * alpha / 255)
    pixels[offset + 1] = UInt8(Int(sourcePixels[offset + 1]) * alpha / 255)
    pixels[offset + 2] = UInt8(Int(sourcePixels[offset + 2]) * alpha / 255)
    pixels[offset + 3] = UInt8(alpha)
  }

  guard
    let provider = CGDataProvider(data: Data(pixels) as CFData),
    let outputImage = CGImage(
      width: width,
      height: height,
      bitsPerComponent: 8,
      bitsPerPixel: 32,
      bytesPerRow: bytesPerRow,
      space: colorSpace,
      bitmapInfo: CGBitmapInfo(rawValue: bitmapInfo),
      provider: provider,
      decode: nil,
      shouldInterpolate: true,
      intent: .defaultIntent
    )
  else {
    throw SpriteExtractionError.missingOutput
  }

  let outputURL = URL(fileURLWithPath: outputPath)
  try FileManager.default.createDirectory(
    at: outputURL.deletingLastPathComponent(),
    withIntermediateDirectories: true
  )
  let representation = NSBitmapImageRep(cgImage: outputImage)
  guard let data = representation.representation(using: .png, properties: [:]) else {
    throw SpriteExtractionError.missingOutput
  }
  try data.write(to: outputURL)
}

do {
  guard CommandLine.arguments.count == 3 else {
    throw SpriteExtractionError.invalidArguments
  }
  try extractCharacter(from: CommandLine.arguments[1], to: CommandLine.arguments[2])
  print("Created transparent sprite: \(CommandLine.arguments[2])")
} catch {
  fputs("\(error)\n", stderr)
  exit(1)
}
