import AppKit
import CoreImage
import Foundation

guard CommandLine.arguments.count == 3 else {
  fputs("usage: overlay-evidence-number.swift <input.png> <output.png>\n", stderr)
  exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard let background = CIImage(contentsOf: inputURL) else {
  fputs("could not read input image\n", stderr)
  exit(3)
}

let labelSize = NSSize(width: 280, height: 130)
let label = NSImage(size: labelSize)
label.lockFocus()
NSColor.clear.setFill()
NSRect(origin: .zero, size: labelSize).fill()

let paragraph = NSMutableParagraphStyle()
paragraph.alignment = .center
let attributes: [NSAttributedString.Key: Any] = [
  .font: NSFont(name: "HelveticaNeue-Bold", size: 86) ?? NSFont.systemFont(ofSize: 86, weight: .bold),
  .foregroundColor: NSColor(calibratedRed: 0.72, green: 0.84, blue: 0.87, alpha: 0.88),
  .kern: 6,
  .paragraphStyle: paragraph,
]
NSString(string: "06").draw(in: NSRect(x: 0, y: 12, width: labelSize.width, height: 104), withAttributes: attributes)
label.unlockFocus()

guard let labelData = label.tiffRepresentation,
      let labelImage = CIImage(data: labelData) else {
  fputs("could not render evidence number\n", stderr)
  exit(4)
}

let perspective = CIFilter(name: "CIPerspectiveTransform")!
perspective.setValue(labelImage, forKey: kCIInputImageKey)
perspective.setValue(CIVector(x: 340, y: 854), forKey: "inputTopLeft")
perspective.setValue(CIVector(x: 487, y: 885), forKey: "inputTopRight")
perspective.setValue(CIVector(x: 515, y: 826), forKey: "inputBottomRight")
perspective.setValue(CIVector(x: 370, y: 790), forKey: "inputBottomLeft")

guard let projectedLabel = perspective.outputImage else {
  fputs("could not project evidence number\n", stderr)
  exit(5)
}

let result = projectedLabel.composited(over: background).cropped(to: background.extent)
let context = CIContext(options: [.useSoftwareRenderer: false])
guard let cgImage = context.createCGImage(result, from: background.extent) else {
  fputs("could not render output image\n", stderr)
  exit(6)
}

let representation = NSBitmapImageRep(cgImage: cgImage)
guard let png = representation.representation(using: .png, properties: [:]) else {
  fputs("could not encode output image\n", stderr)
  exit(7)
}

try png.write(to: outputURL, options: .atomic)
