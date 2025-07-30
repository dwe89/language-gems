const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Reading Comprehension Populator...\n');

try {
  // Run the TypeScript file directly with ts-node
  execSync('npx ts-node populate-reading-comprehension.ts', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Error running populator:', error.message);
  process.exit(1);
}