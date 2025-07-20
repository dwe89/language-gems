# Detective Listening Game

A themed language learning game where students play as detectives solving cases by identifying evidence through radio transmissions in Spanish, French, or German.

## Game Flow

1. **Case Selection**: Choose from different vocabulary categories (Animals, Food, Family, Colors, etc.)
2. **Radio Frequency Selection**: Select Spanish, French, or German radio station
3. **Detective Room**: Listen to radio transmissions and identify correct English translations
4. **Case Solved**: View results and choose to play again

## Features

- **Immersive Detective Theme**: Complete with detective room backgrounds, case files, and radio interface
- **Multi-language Support**: Spanish, French, and German vocabulary
- **Audio-based Learning**: Focus on listening comprehension skills
- **Progress Tracking**: Visual case file that fills up as evidence is identified
- **Replay System**: Up to 2 replays per evidence piece
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technical Implementation

### Components
- `DetectiveListeningGame.tsx` - Main game orchestrator
- `CaseSelection.tsx` - Case type selection screen
- `RadioFrequencySelection.tsx` - Language selection with radio interface
- `DetectiveRoom.tsx` - Core gameplay interface
- `CaseSolved.tsx` - Results and completion screen

### Data Structure
- Vocabulary organized by case type and language
- Audio file management system
- Progress tracking and scoring

### Audio System
- Custom audio manager with replay functionality
- Radio static effects for immersion
- Fallback handling for missing audio files

## Vocabulary Categories

- **Animals**: Common animals (dog, cat, bird, etc.)
- **Food**: Basic food items (apple, bread, milk, etc.)
- **Family**: Family members (father, mother, brother, etc.)
- **Colors**: Basic colors (red, blue, green, etc.)
- **School**: School-related items (coming soon)
- **Travel**: Travel vocabulary (coming soon)
- **Numbers**: Numbers and counting (coming soon)

## Audio Requirements

Audio files should be placed in `/public/audio/detective-listening/` with the naming convention:
- `{language}_{category}_{word}.mp3`
- Example: `es_animals_perro.mp3` for Spanish word "perro" (dog)

## Accessibility Features

- Full keyboard navigation support
- ARIA labels for screen readers
- High contrast color schemes
- Focus indicators for all interactive elements
- Alternative text for all images and icons

## Future Enhancements

- Additional vocabulary categories
- Difficulty levels (rookie/veteran detective)
- Pronunciation feedback
- Multi-case storylines
- Detective ranking system
- Voice analysis features

## Development Notes

The game is built with:
- React 18 with TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- Custom audio management hooks
- Responsive design principles

For testing without audio files, the game gracefully handles missing audio and provides visual feedback.
