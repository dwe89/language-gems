# Vocabulary Mining Sound Effects

This directory contains sound effects for the vocabulary mining system.

## Gem Stage Sounds
- `rock.mp3` - Sound for Rock stage (initial encounter)
- `crystal.mp3` - Sound for Crystal stage (basic recognition)
- `gemstone.mp3` - Sound for Gemstone stage (good understanding)
- `jewel.mp3` - Sound for Jewel stage (strong mastery)
- `crown-jewel.mp3` - Sound for Crown Jewel stage (complete mastery)

## Special Effect Sounds
- `gem-levelup.mp3` - Sound played when a gem levels up
- `gem-collect.mp3` - Sound played when collecting a new gem
- `correct.mp3` - Sound for correct answers
- `incorrect.mp3` - Sound for incorrect answers
- `streak.mp3` - Sound for maintaining streaks
- `achievement.mp3` - Sound for earning achievements

## Audio Format Requirements
- Format: MP3
- Sample Rate: 44.1 kHz
- Bit Rate: 128 kbps
- Duration: 0.5-2 seconds for sound effects
- Volume: Normalized to prevent clipping

## Implementation Notes
- All sounds should be short and pleasant
- Sounds should not be intrusive or annoying with repeated play
- Consider providing volume controls in user settings
- Fallback gracefully if audio files are missing
