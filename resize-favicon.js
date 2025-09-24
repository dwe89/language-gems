const sharp = require('sharp');

async function resizeFavicon() {
  try {
    const inputPath = 'public/favicon.png';

    // Create multiple sizes
    const sizes = [16, 32, 64];

    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(`public/favicon-${size}x${size}.png`);

      console.log(`Created favicon-${size}x${size}.png`);
    }

    // Create a 32x32 ICO file
    await sharp(inputPath)
      .resize(32, 32)
      .toFile('public/favicon.ico');

    console.log('Created favicon.ico');
    console.log('All favicons created successfully!');
  } catch (error) {
    console.error('Error resizing favicon:', error);
  }
}

resizeFavicon();