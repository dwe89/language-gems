# Detective Listening Game Audio Files

This directory contains all audio files for the Detective Listening Game.

## Directory Structure

```
detective-listening/
├── README.md
├── radio-static.mp3          # Background radio static
├── correct-evidence.mp3      # Sound for correct answers
├── wrong-evidence.mp3        # Sound for wrong answers
├── case-solved.mp3          # Sound for completing a case
├── radio-tune.mp3           # Sound for tuning radio
├── spanish/                 # Spanish vocabulary audio
│   ├── animals/
│   │   ├── es_animals_perro.mp3
│   │   ├── es_animals_gato.mp3
│   │   └── ...
│   └── food/
│       ├── es_food_manzana.mp3
│       └── ...
├── french/                  # French vocabulary audio
│   ├── animals/
│   │   ├── fr_animals_chien.mp3
│   │   └── ...
│   └── food/
│       └── ...
└── german/                  # German vocabulary audio
    ├── animals/
    │   ├── de_animals_hund.mp3
    │   └── ...
    └── food/
        └── ...
```

## Audio Requirements

- **Format**: MP3, 44.1kHz, 128kbps minimum
- **Duration**: 2-3 seconds per vocabulary word
- **Quality**: Clear pronunciation by native speakers
- **Effect**: Optional light radio filter for authenticity
- **Volume**: Normalized to consistent levels

## File Naming Convention

- Language prefix: `es_` (Spanish), `fr_` (French), `de_` (German)
- Category: `animals`, `food`, `family`, `school`, `travel`, `colors`, `numbers`
- Word: English equivalent or transliteration
- Example: `es_animals_perro.mp3` (Spanish word "perro" meaning "dog")

## Production Notes

For production deployment:
1. Record audio with native speakers
2. Apply light radio filter effect (optional)
3. Normalize audio levels
4. Compress to appropriate bitrate
5. Test playback across different devices

## Fallback Handling

The game includes fallback handling for missing audio files:
- Visual feedback when audio fails to load
- Graceful degradation to text-only mode
- Error logging for debugging

## Testing

For development and testing, you can:
1. Use text-to-speech tools to generate placeholder audio
2. Record temporary audio files
3. Use existing audio samples from other games
4. Test with silent/empty audio files to verify error handling
