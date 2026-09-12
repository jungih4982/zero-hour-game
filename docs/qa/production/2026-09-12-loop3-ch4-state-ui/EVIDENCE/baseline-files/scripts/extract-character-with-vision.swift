import AppKit
import CoreImage
import CoreGraphics
import Foundation
import ImageIO
import Vision

enum ForegroundExtractionError: Error, CustomStringConvertible {
  case invalidArguments
  case invalidImage(String)
  case noForeground
  case renderFailed
  case encodeFailed

  var description: String {
    switch self {
    case .invalidArguments:
      return "Usage: swift scripts/extract-character-with-vision.swift <input> <output>"
    case let .invalidImage(path):
      return "Could not read image: \(path)"
    case .noForeground:
      return "No foreground subject was detected."
    case .renderFailed:
      return "Could not render the transparent foreground."
    case .encodeFailed:
      return "Could not encode the transparent PNG."
    }
  }
}

private func extractForeground(from inputPath: String, to outputPath: String) throws {
  let inputURL = URL(fileURLWithPath: inputPath)
  guard
    let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else {
    throw ForegroundExtractionError.invalidImage(inputPath)
  }

  let handler = VNImageRequestHandler(cgImage: image, options: [:])
  let request = VNGenerateForegroundInstanceMaskRequest()
  try handler.perform([request])

  guard let observation = request.results?.first else {
    throw ForegroundExtractionError.noForeground
  }

  let maskBuffer = try observation.generateScaledMaskForImage(
    forInstances: observation.allInstances,
    from: handler
  )
  let foreground = CIImage(cgImage: image)
  let rawMask = CIImage(cvPixelBuffer: maskBuffer)
  let mask = CIFilter(
    name: "CIMorphologyMinimum",
    parameters: [
      kCIInputImageKey: rawMask,
      kCIInputRadiusKey: 4.0,
    ]
  )?.outputImage?.cropped(to: foreground.extent) ?? rawMask
  let transparent = CIImage(color: CIColor.clear).cropped(to: foreground.extent)
  guard
    let blend = CIFilter(name: "CIBlendWithMask", parameters: [
      kCIInputImageKey: foreground,
      kCIInputBackgroundImageKey: transparent,
      kCIInputMaskImageKey: mask,
    ]),
    let output = blend.outputImage
  else {
    throw ForegroundExtractionError.renderFailed
  }

  let context = CIContext(options: [.useSoftwareRenderer: false])
  guard
    let rendered = context.createCGImage(
      output,
      from: foreground.extent,
      format: .RGBA8,
      colorSpace: CGColorSpaceCreateDeviceRGB()
    )
  else {
    throw ForegroundExtractionError.renderFailed
  }

  let outputURL = URL(fileURLWithPath: outputPath)
  try FileManager.default.createDirectory(
    at: outputURL.deletingLastPathComponent(),
    withIntermediateDirectories: true
  )
  guard let destination = CGImageDestinationCreateWithURL(
    outputURL as CFURL,
    "public.png" as CFString,
    1,
    nil
  ) else {
    throw ForegroundExtractionError.encodeFailed
  }
  CGImageDestinationAddImage(destination, rendered, nil)
  guard CGImageDestinationFinalize(destination) else {
    throw ForegroundExtractionError.encodeFailed
  }
}

do {
  guard CommandLine.arguments.count == 3 else {
    throw ForegroundExtractionError.invalidArguments
  }
  try extractForeground(from: CommandLine.arguments[1], to: CommandLine.arguments[2])
  print("Created transparent sprite: \(CommandLine.arguments[2])")
} catch {
  fputs("\(error)\n", stderr)
  exit(1)
}
