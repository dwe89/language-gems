# Lava Temple Theme Enhancement Plan

## Overview
This document outlines the specific assets and implementation steps needed to enhance the Lava Temple theme for the hangman game. The goal is to transform the current CSS-based implementation into a visually stunning, immersive experience with custom images and sound effects.

## Image Assets

### 1. Temple Door with Ancient Face
**Location**: `public/games/hangman/images/lava-temple/temple-door.png`  
**Size**: 800x800px, PNG with transparency  
**AI Prompt**:
```
Ultra-detailed ancient golden temple door carved into volcanic rock, with a menacing stone face in the center. The face has glowing orange eyes and intricate Mayan/Aztec style carvings surrounding it. The door is decorated with ancient glyphs arranged in a circular pattern. The metal has a weathered gold appearance with amber and orange highlights. Dark temple interior background, dramatic lighting with glowing lava reflection, 4K, highly detailed texture.
```

### 2. Glyph Stone Tablets (Set of 8)
**Location**: `public/games/hangman/images/lava-temple/glyphs/glyph-{1-8}.png`  
**Size**: 200x200px each, PNG with transparency  
**AI Prompt** (run 8 times with variations):
```
Ancient stone tablet with a single glowing golden Egyptian/Mayan hieroglyph carved into weathered rock. The tablet has cracks and worn edges. The glyph is emitting a subtle amber/orange light. The stone has a dark amber/brown color with volcanic textures. Square format, isolated on transparent background, top-down lighting, highly detailed, 4K texture.
```

### 3. Lava Floor Texture
**Location**: `public/games/hangman/images/lava-temple/lava-floor.png`  
**Size**: 1024x256px, PNG  
**AI Prompt**:
```
Seamless molten lava texture from above, bright orange and red flowing magma with black volcanic rock crust forming islands and patterns. Glowing cracks, bubbling surface with yellow-hot spots, smoky wisps rising. Horizontal elongated format for floor texture, highly detailed, 4K resolution.
```

### 4. Temple Background Wall
**Location**: `public/games/hangman/images/lava-temple/background.jpg`  
**Size**: 1920x1080px, JPG  
**AI Prompt**:
```
Ancient volcanic temple interior with massive stone walls covered in mysterious glyphs and carvings. Distant lava falls flowing down the sides, amber torches casting flickering light, stalactites hanging from the cavernous ceiling. Dark atmosphere with dramatic red/orange lighting, mysterious and foreboding atmosphere, ultra detailed, 8K, cinematic lighting.
```

### 5. Stone Pillars with Carvings (Set of 2)
**Location**: `public/games/hangman/images/lava-temple/pillars/pillar-left.png`, `public/games/hangman/images/lava-temple/pillars/pillar-right.png`  
**Size**: 300x800px, PNG with transparency  
**AI Prompt**:
```
Ancient stone temple pillar with detailed hieroglyphic carvings and amber/gold inlays. The pillar is weathered with cracks and signs of age, made of dark volcanic stone. A torch bracket near the top emits orange flame. Straight vertical orientation, isolated on transparent background, dramatic side lighting creating shadows on the detailed carvings, 4K, highly detailed.
```

### 6. Ember Particle
**Location**: `public/games/hangman/images/lava-temple/particles/ember.png`  
**Size**: 32x32px, PNG with transparency  
**AI Prompt**:
```
Tiny glowing ember or spark particle, bright orange/yellow center fading to red edges with a soft glow. Isolated on transparent background, suitable for particle effects, high resolution.
```

### 7. Lava Wave Animation Frames (Set of 5)
**Location**: `public/games/hangman/images/lava-temple/lava-wave/frame-{1-5}.png`  
**Size**: 1024x256px, PNG with transparency  
**AI Prompt**:
```
Animation frame of a molten lava wave rising and cresting, bright orange and yellow magma with fluid dynamics. Black volcanic crust breaking apart as the wave rises. Semi-transparent top edge with embers and heat distortion. Horizontal orientation, isolated on transparent background, dramatic lighting from within the lava, 4K resolution.
```

### 8. Trap/Danger Effect
**Location**: `public/games/hangman/images/lava-temple/traps/trap-effect.png`  
**Size**: 512x128px, PNG with transparency  
**AI Prompt**:
```
Bright red/orange energy beam or trap effect with pulsing glow, suitable for a danger indicator in an ancient temple. The energy appears to be emanating from an ancient mechanism with glowing symbols. Semi-transparent with bright core, horizontal orientation, isolated on transparent background, 4K resolution.
```

## Sound Assets

### 1. Background Ambient Loop
**Location**: `public/games/hangman/sounds/lava-temple/ambient-loop.mp3`  
**Duration**: 30-60 seconds, looping  
**Description**: Continuous low rumbling of distant volcano, bubbling lava, occasional stone cracking sounds, and deep cavernous echoes.

### 2. Lava Bubble Pops
**Location**: `public/games/hangman/sounds/lava-temple/lava-bubble-{1-3}.mp3`  
**Duration**: 1-2 seconds each  
**Description**: Short, viscous bubble popping sounds with varying pitches, as if molten lava is bubbling up and bursting.

### 3. Stone Mechanism Sliding
**Location**: `public/games/hangman/sounds/lava-temple/stone-slide-{1-3}.mp3`  
**Duration**: 2-3 seconds each  
**Description**: Heavy stone grinding/sliding sounds for when stone tablets move, with mystical undertones.

### 4. Correct Glyph Activation
**Location**: `public/games/hangman/sounds/lava-temple/glyph-correct.mp3`  
**Duration**: 2 seconds  
**Description**: Mystical chime/resonance with a positive tone, suggesting ancient magic being activated.

### 5. Wrong Guess Effects
**Location**: `public/games/hangman/sounds/lava-temple/wrong-guess.mp3`  
**Duration**: 2 seconds  
**Description**: Ominous rumble with cracking stone sounds and a lava surge, conveying danger.

### 6. Temple Rumble
**Location**: `public/games/hangman/sounds/lava-temple/temple-rumble.mp3`  
**Duration**: 3 seconds  
**Description**: Deep earthquake-like rumbling with debris falling sounds, suggesting the temple is becoming unstable.

### 7. Victory Fanfare
**Location**: `public/games/hangman/sounds/lava-temple/victory.mp3`  
**Duration**: 5 seconds  
**Description**: Triumphant mystical sequence with stone door opening sound, suggesting successful escape/completion.

### 8. Defeat Sequence
**Location**: `public/games/hangman/sounds/lava-temple/defeat.mp3`  
**Duration**: 5 seconds  
**Description**: Dramatic collapse sequence with intense lava surge and crumbling stones, suggesting the temple is collapsing.

## Implementation Steps

### 1. Create Directory Structure
```bash
mkdir -p public/games/hangman/images/lava-temple/glyphs
mkdir -p public/games/hangman/images/lava-temple/pillars
mkdir -p public/games/hangman/images/lava-temple/particles
mkdir -p public/games/hangman/images/lava-temple/lava-wave
mkdir -p public/games/hangman/images/lava-temple/traps
mkdir -p public/games/hangman/sounds/lava-temple
```

### 2. Generate & Add Image Assets
- Use AI image generation tool (Midjourney, DALL-E, etc.) with the provided prompts
- Save each image in its designated location with the appropriate dimensions
- Optimize PNGs for web if needed

### 3. Obtain Sound Effects
- Use sound libraries like FreeSound.org or create custom effects
- Edit to appropriate lengths and normalize audio levels
- Convert to MP3 format at 128-192kbps

### 4. Enhance the LavaTempleAnimation Component
- Modify to use the new image assets instead of CSS-generated elements
- Add more complex animations using the frame sequences
- Implement parallax effects for depth
- Add particle effects using the ember asset

### 5. Integrate Sound Effects
- Update the SoundEffects component to include Lava Temple specific sounds
- Trigger appropriate sound effects based on game state and player actions
- Implement proper audio mixing and fading

### 6. Performance Optimization
- Preload critical assets
- Optimize animations for performance
- Implement conditional rendering for complex effects based on device capability

## Code Enhancement Suggestions

### 1. Update Background Implementation
```tsx
{/* Replace the CSS gradient background with an image */}
<div 
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: 'url("/games/hangman/images/lava-temple/background.jpg")' }}
></div>
```

### 2. Replace Temple Door with Image
```tsx
{/* Replace the CSS temple door with the image */}
<div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 w-64 h-80">
  <img 
    src="/games/hangman/images/lava-temple/temple-door.png" 
    alt="Ancient temple door" 
    className="w-full h-full object-contain"
  />
  
  {/* Overlay effects for animations */}
  {doorUnlocking && (
    <div className="absolute inset-0 bg-yellow-500 opacity-30 animate-door-glow"></div>
  )}
</div>
```

### 3. Implement Lava Floor with Image
```tsx
{/* Replace CSS lava with image-based implementation */}
<div 
  className="absolute left-0 right-0 overflow-hidden transition-all duration-1000"
  style={{ 
    bottom: 0,
    height: `${lavaHeight}px`,
    backgroundImage: 'url("/games/hangman/images/lava-temple/lava-floor.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* Lava wave animation with image sequence */}
  {showLavaWave && (
    <div 
      className="absolute inset-x-0 top-0 h-32 animate-rise"
      style={{ 
        backgroundImage: `url("/games/hangman/images/lava-temple/lava-wave/frame-${Math.floor(Date.now() / 200) % 5 + 1}.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
  )}
</div>
```

### 4. Enhanced Ember Particle System
```tsx
{/* Replace CSS ember particles with image-based system */}
<div className="absolute inset-0 pointer-events-none">
  {[...Array(20)].map((_, i) => (
    <div 
      key={i}
      className="absolute animate-float-ember"
      style={{ 
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 16 + 8}px`,
        height: `${Math.random() * 16 + 8}px`,
        backgroundImage: 'url("/games/hangman/images/lava-temple/particles/ember.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        animationDuration: `${Math.random() * 5 + 3}s`,
        animationDelay: `${Math.random() * 2}s`
      }}
    ></div>
  ))}
</div>
```

### 5. Add Parallax Effect for Depth
```tsx
// Add to component state
const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

// Add effect for mouse movement parallax
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setScrollOffset({ x, y });
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);

// Then use in JSX for parallax elements
<div 
  className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
  style={{ 
    backgroundImage: 'url("/games/hangman/images/lava-temple/background.jpg")',
    transform: `translate(${scrollOffset.x * 0.5}px, ${scrollOffset.y * 0.5}px)`
  }}
></div>
```

## Final Notes
- The implementation should be responsive and adapt to different screen sizes
- Consider progressive enhancement - basic version for slower devices, enhanced version for better hardware
- Ensure accessibility by providing appropriate alternative text for images and not relying solely on visual feedback 