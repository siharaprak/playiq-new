const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createFavicons() {
  const inputPath = 'C:\\Users\\Iris\\.gemini\\antigravity\\brain\\b4c4a982-58a6-4965-b38f-9e31cb823d00\\media__1776320771760.png';
  const outPathIcon = path.join(__dirname, 'src', 'app', 'icon.png');
  const outPathApple = path.join(__dirname, 'src', 'app', 'apple-icon.png');

  try {
    // We will extract just the logo text by trimming the black borders.
    // Then we resize it to fit within a square, adding black padding.
    // To make it as readable as possible, we will just use the center portion.
    
    // First, let's get metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Create icon (we'll just use fit: contain to maintain the logo but make it square)
    // To make it more readable, we might crop the bottom subtext if we can? 
    // Without exact coords, fit:'contain' is the safest.
    await sharp(inputPath)
      .trim() // removes pure black edges
      .resize({
        width: 512,
        height: 512,
        fit: 'contain',
        background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617 (slate-950)
      })
      .toFile(outPathIcon);

    // Apple touch icon
    await sharp(inputPath)
      .trim()
      .resize({
        width: 180,
        height: 180,
        fit: 'contain',
        background: { r: 2, g: 6, b: 23, alpha: 1 } 
      })
      .toFile(outPathApple);

    console.log("Success! Created icon.png and apple-icon.png");
  } catch (err) {
    console.error("Error creating favicons:", err);
  }
}

createFavicons();
