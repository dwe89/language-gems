# Lava Temple Theme Enhancement Implementation Guide

This guide provides step-by-step instructions for implementing the enhanced Lava Temple theme assets and features as outlined in the todo list.

## Step 1: Create Required Directories

Run these commands in your terminal to create all necessary directories:

```bash
mkdir -p public/games/hangman/images/lava-temple/glyphs
mkdir -p public/games/hangman/images/lava-temple/pillars
mkdir -p public/games/hangman/images/lava-temple/particles
mkdir -p public/games/hangman/images/lava-temple/lava-wave
mkdir -p public/games/hangman/images/lava-temple/traps
mkdir -p public/games/hangman/sounds/lava-temple
```

## Step 2: Generate Image Assets

Use an AI image generation tool like Midjourney, DALL-E, or Stable Diffusion with the provided prompts from the todo list. For each image:

1. Generate the image using the specific prompt
2. Download at the highest resolution
3. Resize to the specified dimensions using an image editor
4. Save in the correct location with appropriate naming
5. Optimize for web if needed (tools like TinyPNG, ImageOptim)

### Required Images:

1. **Temple Door**: `public/games/hangman/images/lava-temple/temple-door.png` (800x800px)
2. **8 Glyph Tablets**: `public/games/hangman/images/lava-temple/glyphs/glyph-{1-8}.png` (200x200px each)
3. **Lava Floor**: `public/games/hangman/images/lava-temple/lava-floor.png` (1024x256px)
4. **Temple Background**: `public/games/hangman/images/lava-temple/background.jpg` (1920x1080px)
5. **Pillars**: `public/games/hangman/images/lava-temple/pillars/pillar-left.png` and `pillar-right.png` (300x800px each)
6. **Ember Particle**: `public/games/hangman/images/lava-temple/particles/ember.png` (32x32px)
7. **Lava Wave Frames**: `public/games/hangman/images/lava-temple/lava-wave/frame-{1-5}.png` (1024x256px each)
8. **Trap Effect**: `public/games/hangman/images/lava-temple/traps/trap-effect.png` (512x128px)

## Step 3: Obtain Sound Effects

1. Visit sound libraries like [FreeSound.org](https://freesound.org/), [ZapSplat](https://www.zapsplat.com/), or use a subscription service like Envato Elements
2. Search for sounds matching the descriptions in the todo list
3. Download and edit as needed (trim length, adjust volume, etc.)
4. Convert to MP3 format at 128-192kbps
5. Save in the correct location with appropriate naming

### Required Sounds:

1. **Ambient Loop**: `public/games/hangman/sounds/lava-temple/ambient-loop.mp3` (30-60s)
2. **Lava Bubbles**: `public/games/hangman/sounds/lava-temple/lava-bubble-{1-3}.mp3` (1-2s each)
3. **Stone Mechanism**: `public/games/hangman/sounds/lava-temple/stone-slide-{1-3}.mp3` (2-3s each)
4. **Glyph Activation**: `public/games/hangman/sounds/lava-temple/glyph-correct.mp3` (2s)
5. **Wrong Guess**: `public/games/hangman/sounds/lava-temple/wrong-guess.mp3` (2s)
6. **Temple Rumble**: `public/games/hangman/sounds/lava-temple/temple-rumble.mp3` (3s)
7. **Victory**: `public/games/hangman/sounds/lava-temple/victory.mp3` (5s)
8. **Defeat**: `public/games/hangman/sounds/lava-temple/defeat.mp3` (5s)

## Step 4: Update the LavaTempleAnimation Component

Open `src/app/games/hangman/components/themes/LavaTempleAnimation.tsx` and make the following changes:

### 1. Add Image Preloading

Add this after your state declarations:

```tsx
// Preload images
useEffect(() => {
  const imageUrls = [
    '/games/hangman/images/lava-temple/background.jpg',
    '/games/hangman/images/lava-temple/temple-door.png',
    '/games/hangman/images/lava-temple/lava-floor.png',
    '/games/hangman/images/lava-temple/particles/ember.png',
    '/games/hangman/images/lava-temple/pillars/pillar-left.png',
    '/games/hangman/images/lava-temple/pillars/pillar-right.png',
    '/games/hangman/images/lava-temple/traps/trap-effect.png',
  ];
  
  // Preload lava wave frames
  for (let i = 1; i <= 5; i++) {
    imageUrls.push(`/games/hangman/images/lava-temple/lava-wave/frame-${i}.png`);
  }
  
  // Preload glyph tablets
  for (let i = 1; i <= 8; i++) {
    imageUrls.push(`/games/hangman/images/lava-temple/glyphs/glyph-${i}.png`);
  }
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}, []);
```

### 2. Add Parallax Effect

Add this state and effect:

```tsx
// For parallax effect
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
```

### 3. Replace the Background

Replace the background div with:

```tsx
{/* Background with parallax effect */}
<div 
  className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
  style={{ 
    backgroundImage: 'url("/games/hangman/images/lava-temple/background.jpg")',
    transform: `translate(${scrollOffset.x * 0.5}px, ${scrollOffset.y * 0.5}px)`
  }}
></div>
```

### 4. Replace the Lava Pool

Replace the lava pool div with:

```tsx
{/* Lava pool with image texture */}
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
  {/* Lava bubbles */}
  <div className="absolute top-2 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
  <div className="absolute top-4 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
  <div className="absolute top-3 left-3/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
  
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

### 5. Replace the Temple Door

Replace the temple door section with:

```tsx
{/* Central golden temple door with ancient face */}
<div 
  className="absolute left-1/2 bottom-20 transform -translate-x-1/2 w-64 h-80"
  style={{ 
    transform: `translate(calc(-50% + ${scrollOffset.x * 0.2}px), calc(0px + ${scrollOffset.y * 0.2}px))` 
  }}
>
  <img 
    src="/games/hangman/images/lava-temple/temple-door.png" 
    alt="Ancient temple door with glyphs" 
    className="w-full h-full object-contain"
  />
  
  {/* Central glyph circle overlay - for interaction */}
  <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-44 h-44 rounded-full">
    {/* Glyph circle */}
    <div ref={glyphsRef} className="absolute inset-0">
      {glyphs.map((glyph, i) => {
        const angle = (i * (360 / glyphs.length)) * (Math.PI / 180);
        const radius = 20;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        return (
          <div 
            key={i}
            className={`absolute text-xl font-bold flex items-center justify-center w-8 h-8 rounded-full
              ${glyphPulse === i ? 'animate-glyph-pulse text-yellow-400' : 'text-amber-600'}
              ${doorUnlocking ? 'animate-glyph-unlock' : ''}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.1}s`
            }}
          >
            {glyph}
          </div>
        );
      })}
    </div>
    
    {/* Connecting lines */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
      {glyphs.map((_, i) => {
        const angle = (i * (360 / glyphs.length)) * (Math.PI / 180);
        const radius = 20;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        return (
          <line 
            key={i}
            x1="50" 
            y1="50" 
            x2={x} 
            y2={y} 
            stroke={doorUnlocking ? "#FCD34D" : "#CA8A04"} 
            strokeWidth="1"
            className={doorUnlocking ? "animate-line-glow" : ""}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        );
      })}
    </svg>
  </div>
  
  {/* Door opening animation */}
  {doorUnlocking && (
    <div className="absolute inset-0 bg-yellow-500 opacity-30 animate-door-glow"></div>
  )}
</div>
```

### 6. Replace the Temple Pillars

Replace the temple pillars section with:

```tsx
{/* Temple pillars */}
<div 
  className="absolute left-8 bottom-16 w-12 h-64"
  style={{ 
    transform: `translate(${scrollOffset.x * 0.3}px, ${scrollOffset.y * 0.1}px)` 
  }}
>
  <img 
    src="/games/hangman/images/lava-temple/pillars/pillar-left.png" 
    alt="Temple pillar" 
    className="w-full h-full object-contain"
  />
</div>

<div 
  className="absolute right-8 bottom-16 w-12 h-64"
  style={{ 
    transform: `translate(-${scrollOffset.x * 0.3}px, ${scrollOffset.y * 0.1}px)` 
  }}
>
  <img 
    src="/games/hangman/images/lava-temple/pillars/pillar-right.png" 
    alt="Temple pillar" 
    className="w-full h-full object-contain"
  />
</div>
```

### 7. Replace the Stone Tablets/Glyph Puzzle

Replace the stone tablets section with:

```tsx
{/* Stone tablets/puzzle pieces at base */}
<div 
  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 grid grid-cols-4 gap-2"
  style={{ 
    transform: `translate(-50%, ${scrollOffset.y * 0.05}px)` 
  }}
>
  {[...Array(8)].map((_, i) => (
    <div 
      key={i} 
      className={`w-16 h-16 flex items-center justify-center relative
        ${stoneSlide && i === Math.floor(Math.random() * 8) ? 'animate-slide-puzzle' : ''}
        ${mistakes > 0 && i === mistakes % 8 ? 'animate-stone-sink' : ''}`}
    >
      <img 
        src={`/games/hangman/images/lava-temple/glyphs/glyph-${i+1}.png`}
        alt={`Ancient glyph symbol ${i+1}`}
        className="w-full h-full object-contain"
      />
      <span className={`absolute text-2xl font-bold ${i < (8 - mistakes) ? 'text-amber-500' : 'text-red-600'}`}>
        {glyphs[i]}
      </span>
    </div>
  ))}
</div>
```

### 8. Replace the Trap Effects

Replace the trap effects section with:

```tsx
{/* Traps based on mistakes */}
{activeTrap === 0 && (
  <div 
    className="absolute bottom-16 left-10 right-10 h-8"
    style={{
      backgroundImage: 'url("/games/hangman/images/lava-temple/traps/trap-effect.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.8
    }}
  ></div>
)}
{activeTrap === 1 && (
  <div 
    className="absolute left-1/4 top-1/3 w-8 h-24 bg-center bg-contain bg-no-repeat animate-pulse"
    style={{
      backgroundImage: 'url("/games/hangman/images/lava-temple/traps/trap-effect.png")',
      transform: 'rotate(90deg)',
      opacity: 0.8
    }}
  ></div>
)}
{activeTrap === 2 && (
  <div 
    className="absolute right-1/4 top-1/3 w-8 h-24 bg-center bg-contain bg-no-repeat animate-pulse"
    style={{
      backgroundImage: 'url("/games/hangman/images/lava-temple/traps/trap-effect.png")',
      transform: 'rotate(90deg)',
      opacity: 0.8
    }}
  ></div>
)}
{activeTrap === 3 && (
  <div 
    className="absolute bottom-32 left-1/3 right-1/3 h-8 bg-center bg-cover animate-pulse"
    style={{
      backgroundImage: 'url("/games/hangman/images/lava-temple/traps/trap-effect.png")',
      opacity: 0.8
    }}
  ></div>
)}
```

### 9. Replace the Ember Particles

Replace the ember particles section with:

```tsx
{/* Floating ember particles */}
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
        opacity: `${Math.random() * 0.5 + 0.3}`,
        animationDuration: `${Math.random() * 5 + 3}s`,
        animationDelay: `${Math.random() * 2}s`
      }}
    ></div>
  ))}
</div>
```

## Step 5: Update the SoundEffects Component

Open `src/app/games/hangman/components/SoundEffects.tsx` and add support for the Lava Temple sounds.

Find the code related to temple theme sounds and update or add the following:

```tsx
// Lava temple specific sounds
useEffect(() => {
  if (themeId === 'temple') {
    // Load temple-specific sounds
    const soundMap = {
      correctLetter: new Audio('/games/hangman/sounds/lava-temple/glyph-correct.mp3'),
      incorrectLetter: new Audio('/games/hangman/sounds/lava-temple/wrong-guess.mp3'),
      gameWon: new Audio('/games/hangman/sounds/lava-temple/victory.mp3'),
      gameLost: new Audio('/games/hangman/sounds/lava-temple/defeat.mp3'),
      hintUsed: new Audio('/games/hangman/sounds/lava-temple/stone-slide-1.mp3'),
      templeRumble: new Audio('/games/hangman/sounds/lava-temple/temple-rumble.mp3'),
      lavaBubble: [
        new Audio('/games/hangman/sounds/lava-temple/lava-bubble-1.mp3'),
        new Audio('/games/hangman/sounds/lava-temple/lava-bubble-2.mp3'),
        new Audio('/games/hangman/sounds/lava-temple/lava-bubble-3.mp3')
      ]
    };
    
    // Set volume for all sounds
    Object.values(soundMap).forEach(sound => {
      if (Array.isArray(sound)) {
        sound.forEach(s => {
          s.volume = volumeLevel;
        });
      } else {
        sound.volume = volumeLevel;
      }
    });
    
    // Play sounds based on triggers
    if (triggers.correctLetter) {
      soundMap.correctLetter.currentTime = 0;
      soundMap.correctLetter.play();
    }
    
    if (triggers.incorrectLetter) {
      soundMap.incorrectLetter.currentTime = 0;
      soundMap.incorrectLetter.play();
      
      // Also play temple rumble
      soundMap.templeRumble.currentTime = 0;
      soundMap.templeRumble.play();
    }
    
    if (triggers.gameWon) {
      soundMap.gameWon.currentTime = 0;
      soundMap.gameWon.play();
    }
    
    if (triggers.gameLost) {
      soundMap.gameLost.currentTime = 0;
      soundMap.gameLost.play();
    }
    
    if (triggers.hintUsed) {
      soundMap.hintUsed.currentTime = 0;
      soundMap.hintUsed.play();
    }
    
    // Periodically play random lava bubble sounds
    const bubbleInterval = setInterval(() => {
      if (soundsEnabled && Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * soundMap.lavaBubble.length);
        soundMap.lavaBubble[randomIndex].currentTime = 0;
        soundMap.lavaBubble[randomIndex].volume = volumeLevel * 0.3; // Lower volume for ambient
        soundMap.lavaBubble[randomIndex].play();
      }
    }, 3000);
    
    return () => {
      clearInterval(bubbleInterval);
    };
  }
}, [triggers, themeId, soundsEnabled, volumeLevel]);
```

## Step 6: Testing and Fine-tuning

1. After implementing all changes, run the application with `npm run dev`
2. Navigate to the hangman game and select the temple theme
3. Test all features to ensure they work as expected:
   - Parallax effect on mouse movement
   - Animations when making correct/incorrect guesses
   - Sound effects
   - Responsive design on different screen sizes
4. Fine-tune any aspects that don't look or work as expected

## Step 7: Performance Optimization

Add the following to the beginning of the component to conditionally render simpler effects on lower-end devices:

```tsx
// Detect if we should use simplified effects
const [useSimplifiedEffects, setUseSimplifiedEffects] = useState(false);

useEffect(() => {
  // Simple performance detection
  const performanceCheck = () => {
    // Check if device is mobile or tablet
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if using Safari on iOS (which typically has more performance issues)
    const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                        !window.MSStream && 
                        /Safari/i.test(navigator.userAgent);
    
    // Determine if we should simplify effects
    setUseSimplifiedEffects(isMobile || isSafariIOS);
  };
  
  performanceCheck();
}, []);
```

Then use this state to conditionally render effects:

```tsx
{/* Conditionally render particle effects */}
{!useSimplifiedEffects && (
  <div className="absolute inset-0 pointer-events-none">
    {/* ... ember particles code ... */}
  </div>
)}
```

## Additional Resources

- [Freesound.org](https://freesound.org/) - Free sound effects
- [TinyPNG](https://tinypng.com/) - Image compression
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations) - MDN Web Docs 