const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const sizes = [16, 32, 48];
const images = sizes.map(size => {
  const filePath = path.join(publicDir, `favicon-${size}x${size}.png`);
  const data = fs.readFileSync(filePath);
  return { size, data };
});

const headerSize = 6;
const dirEntrySize = 16;
let offset = headerSize + dirEntrySize * images.length;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // ICO type
header.writeUInt16LE(images.length, 4); // Number of images

const entries = [];
for (const img of images) {
  const entry = Buffer.alloc(dirEntrySize);
  entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // Width
  entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // Height
  entry.writeUInt8(0, 2); // Color palette
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(img.data.length, 8); // Image size in bytes
  entry.writeUInt32LE(offset, 12); // Offset of image data
  offset += img.data.length;
  entries.push(entry);
}

const icoBuffer = Buffer.concat([header, ...entries, ...images.map(img => img.data)]);
const icoPath = path.join(publicDir, 'favicon.ico');
fs.writeFileSync(icoPath, icoBuffer);
console.log(`Generated ${icoPath} (${icoBuffer.length} bytes, ${images.length} frames)`);
