import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

interface OGImageOptions {
  title: string;
  subtitle?: string;
  backgroundcolor?: string;
  textColor?: string;
  logoPath?: string;
  outputPath: string;
}

export async function generateOGImage({
  title,
  subtitle = 'Language Gems',
  backgroundcolor = '#3B82F6',
  textColor = '#FFFFFF',
  logoPath,
  outputPath
}: OGImageOptions) {
  // Standard OG image dimensions
  const width = 1200;
  const height = 630;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, backgroundcolor);
  gradient.addColorStop(1, adjustBrightness(backgroundcolor, -20));
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add decorative elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(width - 100, 100, 150, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(-50, height - 50, 200, 0, Math.PI * 2);
  ctx.fill();
  
  // Set text styling
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  // Title
  ctx.font = 'bold 64px Inter, sans-serif';
  const words = title.split(' ');
  let currentLine = '';
  let lines: string[] = [];
  let testLine = '';
  const maxWidth = width - 120;
  
  for (let n = 0; n < words.length; n++) {
    testLine = currentLine + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine);
      currentLine = words[n] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  // Draw title lines
  const lineHeight = 75;
  const startY = height / 2 - (lines.length * lineHeight) / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, 60, startY + (index * lineHeight));
  });
  
  // Subtitle
  if (subtitle) {
    ctx.font = '32px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(subtitle, 60, startY + (lines.length * lineHeight) + 30);
  }
  
  // Logo/Brand mark (simple gem icon)
  ctx.fillStyle = textColor;
  ctx.beginPath();
  ctx.moveTo(60, 60);
  ctx.lineTo(90, 60);
  ctx.lineTo(105, 90);
  ctx.lineTo(75, 120);
  ctx.lineTo(45, 90);
  ctx.closePath();
  ctx.fill();
  
  // Brand text
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Language Gems', 120, 70);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`✅ Generated OG image: ${outputPath}`);
}

function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Adjust brightness
  const newR = Math.max(0, Math.min(255, r + (r * percent / 100)));
  const newG = Math.max(0, Math.min(255, g + (g * percent / 100)));
  const newB = Math.max(0, Math.min(255, b + (b * percent / 100)));
  
  // Convert back to hex
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

// Generate specific images
async function generateBlogImages() {
  const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
  
  // Ensure directory exists
  if (!fs.existsSync(blogImagesDir)) {
    fs.mkdirSync(blogImagesDir, { recursive: true });
  }
  
  // AQA GCSE Speaking Photocard Guide
  await generateOGImage({
    title: 'AQA GCSE Speaking Photocard Guide',
    subtitle: 'Complete exam preparation guide',
    backgroundcolor: '#059669', // Green theme for GCSE content
    outputPath: path.join(blogImagesDir, 'aqa-gcse-speaking-photocard-og.jpg')
  });
  
  // Default blog image
  await generateOGImage({
    title: 'Language Learning Resources',
    subtitle: 'Expert guides and teaching materials',
    backgroundcolor: '#3B82F6', // Blue theme
    outputPath: path.join(process.cwd(), 'public', 'images', 'og-default.jpg')
  });
  
  console.log('🎉 All blog OG images generated successfully!');
}

// Run if called directly
if (require.main === module) {
  generateBlogImages().catch(console.error);
}

export default generateBlogImages;