# Language Gems Game Differences

This document outlines the functional differences between similar games in the Language Gems platform.

## Vocab Blast vs Word Blast

### Vocab Blast
- **Game Type**: Fast-paced action game with falling/moving vocabulary items
- **Gameplay**: Players click on correct translations as words fall or move across the screen
- **Themes**: Multiple visual themes (Tokyo Nights, Pirate Adventure, Space Explorer, Lava Temple)
- **Scoring**: Combo-based scoring system with streak multipliers
- **Win Conditions**: Multiple win paths - reach target score OR target words learned OR target combo
- **Time Pressure**: High-intensity with time limits and falling objects
- **Target Audience**: Action-oriented learners who prefer fast-paced games
- **Vocabulary Focus**: Quick recognition and reaction-based learning
- **Audio**: Theme-specific sound effects and background music

### Word Blast
- **Game Type**: More structured vocabulary practice game
- **Gameplay**: Traditional multiple-choice or matching format
- **Themes**: Classic theme with simpler visual design
- **Scoring**: Standard point-per-correct-answer system
- **Win Conditions**: Complete all vocabulary items or reach score threshold
- **Time Pressure**: Moderate, more focused on accuracy than speed
- **Target Audience**: Learners who prefer structured, methodical practice
- **Vocabulary Focus**: Comprehension and retention-based learning
- **Audio**: Basic sound effects for feedback

**Key Difference**: Vocab Blast is an action-arcade game emphasizing speed and reflexes, while Word Blast is a traditional educational game focusing on comprehension and accuracy.

## Word Towers vs Sentence Towers

### Word Towers
- **Content Type**: Individual vocabulary words and their translations
- **Building Blocks**: Each block represents a single word-translation pair
- **Complexity**: Simpler content, faster gameplay
- **Input Method**: Multiple choice selection or typing single words
- **Learning Focus**: Vocabulary acquisition and word-translation mapping
- **Difficulty Scaling**: Based on word complexity and frequency
- **Session Length**: Shorter sessions, typically 5-15 minutes
- **Cognitive Load**: Lower - focuses on individual word recognition

### Sentence Towers
- **Content Type**: Complete sentences with gap-fill exercises
- **Building Blocks**: Each block represents a completed sentence
- **Complexity**: Higher complexity with contextual understanding required
- **Input Method**: Longer input boxes for sentence completion or full sentences
- **Learning Focus**: Grammar, sentence structure, and contextual vocabulary usage
- **Difficulty Scaling**: Based on sentence complexity, grammar structures, and vocabulary level
- **Session Length**: Longer sessions, typically 10-25 minutes
- **Cognitive Load**: Higher - requires understanding of grammar and context

**Key Difference**: Word Towers focuses on individual vocabulary learning, while Sentence Towers emphasizes grammar, sentence structure, and contextual language use. Sentence Towers should use longer input boxes to accommodate full sentence responses.

## Implementation Notes

### Vocab Blast Technical Details
- Uses theme-specific engines (TokyoNightsEngine, PirateAdventureEngine, etc.)
- Implements falling/moving word mechanics
- Complex collision detection and animation systems
- Real-time combo and streak tracking
- FSRS integration for spaced repetition

### Word Blast Technical Details
- Simpler UI with standard form controls
- Assignment wrapper integration for classroom use
- Standardized progress tracking
- Basic scoring without complex multipliers

### Word Towers Technical Details
- Single word target system
- Multiple choice with 4 options typically
- Typing mode available for double points
- Block-stacking visual metaphor
- Individual word difficulty tracking

### Sentence Towers Technical Details
- Sentence-based target system
- Gap-fill or complete sentence input
- Longer input fields for sentence responses
- Grammar structure awareness
- Contextual vocabulary practice

## Recommendations

1. **Vocab Blast**: Best for kinesthetic learners and gamification enthusiasts
2. **Word Blast**: Best for traditional learners and classroom assignments
3. **Word Towers**: Best for vocabulary building and beginner language learners
4. **Sentence Towers**: Best for intermediate/advanced learners focusing on grammar and sentence construction

## UI Considerations

- **Sentence Towers** should have longer input boxes to accommodate full sentences
- **Vocab Blast** requires responsive design for action-based interactions
- **Word Towers** can use standard-sized inputs for single words
- **Word Blast** should prioritize clarity and accessibility for classroom use
