# LanguageGems Manual Testing Checklist

## 🎯 Overview
This comprehensive manual testing checklist covers all critical user journeys and functionality to ensure production readiness.

## 🧪 Pre-Testing Setup

### Environment Preparation
- [ ] Clear browser cache and cookies
- [ ] Open browser developer tools (F12)
- [ ] Enable Console and Network tabs for monitoring
  - [ ] **Console Tab:** Check for any JavaScript errors (red messages) or warnings.
  - [ ] **Network Tab:** Monitor for failed network requests (4xx, 5xx status codes) and unusual load times.
- [ ] Test in incognito/private browsing mode
- [ ] Document browser version and OS

### Test Data Preparation
- [x] Create test teacher account
- [x] Create test student accounts
- [NEEDS MORE TESTING] Prepare test vocabulary lists
- [x] Set up test assignments

## 👨‍🏫 Teacher Journey Testing

### 1. Account Registration & Authentication
- [x] **Teacher Registration**
  - Navigate to teacher registration page
  - Fill out registration form with valid data
  - Submit form and verify email verification sent
  - Check email and click verification link
  - Verify successful account activation

- [x] **Teacher Login**
  - Navigate to teacher login page
  - Enter valid credentials
  - Verify successful login and redirect to dashboard
  - Test "Remember me" functionality
  - Test password reset flow

- [x] **Profile Management**
  - Access account/profile page
  - Verify teacher information loads correctly
  - Update profile information
  - Verify changes are saved
  - Test profile picture upload (if available)

### 2. Class Management
- [x] **Create New Class**
  - Navigate to class creation page
  - Fill out class details (name, level, year group)
  - Submit and verify class is created
  - Check class appears in classes list

- [x] **Manage Existing Classes**
  - View classes list
  - Edit class details
  - Archive/delete class (if applicable)
  - Verify changes are reflected

### 3. Student Management
- [x] **Add Students to Class**
  - Navigate to student management
  - Add individual students
  - Bulk add students (if available)
  - Generate student login credentials
  - Verify student passwords are generated correctly

- [x] **Student Password Management**
  - Generate new passwords for students
  - Verify password format (adjective/color + gem + number)
  - Test password distribution methods
  - Verify students can login with generated passwords

### 4. Assignment Creation & Management
- [x] **Create Single Game Assignment**
  - Navigate to assignment creator
  - Select single game mode
  - Choose game type (VocabMaster, Memory Match, etc.)
  - Configure game settings
  - Set vocabulary source and count
  - Set due date and points
  - Assign to class
  - Verify assignment is created

- [x] **Create Multi-Game Assignment**
  - Select multi-game mode
  - Choose multiple games
  - Configure individual game settings
  - Set overall assignment parameters
  - Verify assignment complexity is handled correctly

- [ ] **Create Skills Assignment**
  - Select skills/grammar mode
  - Choose grammar topics by category
  - Configure difficulty and time limits
  - Set assessment parameters
  - Verify skills assignment is created

### 4A. Comprehensive Assignment Creation Testing

#### A. Individual Game Type Assignments

##### Vocabulary Game Assignments
- [x] **VocabMaster Assignment**
  - Create assignment with VocabMaster game
  - Test vocabulary source selection (category/custom list)
  - Verify word count configuration (10-50 words)
  - Check language selection (Spanish/French/German)
  - Verify mastery mode vs adventure mode options
  - Test assignment preview functionality

- [x] **Memory Match Assignment**
  - Create Memory Match specific assignment
  - Test grid size configuration (4x4, 6x6)
  - Verify vocabulary pairing logic
  - Check time limit settings
  - Test difficulty progression options
  - Verify gems-only-for-matches logic in preview

- [ ] **Word Towers Assignment**
  - Create Word Towers assignment
  - Test typing mode enablement
  - Verify double points configuration
  - Check tower height settings
  - Test vocabulary difficulty scaling
  - Verify completion criteria settings

- [ ] **Hangman Assignment**
  - Create Hangman game assignment
  - Test word length filtering
  - Verify hint system configuration
  - Check maximum attempts settings
  - Test vocabulary category selection
  - Verify gems-only-on-completion logic

##### Sentence-Based Game Assignments
- [ ] **Sentence Builder Assignment**
  - Create Sentence Builder assignment
  - Test sentence source selection (topic/theme)
  - Verify sentence complexity levels
  - Check grammar focus areas
  - Test vocabulary expression tracking
  - Verify multi-word expression recognition

- [ ] **Case File Translator Assignment**
  - Create Case File assignment
  - Test case difficulty selection
  - Verify translation accuracy requirements
  - Check context clue availability
  - Test vocabulary expression rewards
  - Verify detective theme consistency

##### Grammar Game Assignments
- [ ] **Conjugation Duel Assignment**
  - Create Conjugation Duel assignment
  - Test tense selection (present, past, future, conditional)
  - Verify person selection (yo, tú, él/ella, nosotros, etc.)
  - Check verb type filtering (regular/irregular)
  - Test difficulty progression settings
  - Verify Grammar Gems reward configuration

- [ ] **Verb Quest Assignment**
  - Create Verb Quest assignment
  - Test quest type selection
  - Verify verb category filtering
  - Check progression requirements
  - Test mastery tracking settings
  - Verify Grammar Gems integration

#### B. Assessment Type Assignments

##### Listening Assessment Assignments
- [ ] **AQA Listening Assignment**
  - Create AQA listening assessment
  - Test tier selection (Foundation/Higher)
  - Verify question type configuration
  - Check audio quality settings
  - Test marking scheme application
  - Verify grade boundary settings

- [ ] **Edexcel Listening Assignment**
  - Create Edexcel listening assessment
  - Test tier and crossover questions
  - Verify question format compliance
  - Check audio timing settings
  - Test marking criteria accuracy
  - Verify results reporting format

##### Reading Assessment Assignments
- [ ] **Reading Comprehension Assignment**
  - Create reading assessment
  - Test text difficulty selection
  - Verify question type variety
  - Check time allocation settings
  - Test marking scheme configuration
  - Verify detailed feedback options

##### Grammar Skills Assignments
- [ ] **Grammar Lesson Assignment**
  - Create grammar lesson assignment
  - Test topic selection by category
  - Verify content type selection (lesson/practice/test)
  - Check difficulty level configuration
  - Test time limit settings
  - Verify progress tracking setup

- [ ] **Grammar Practice Assignment**
  - Create grammar practice assignment
  - Test drill type selection
  - Verify adaptive difficulty settings
  - Check immediate feedback configuration
  - Test mastery threshold settings
  - Verify Grammar Gems reward setup

#### C. Multi-Game Assignment Testing

##### Mixed Vocabulary Assignment
- [ ] **Multi-Vocabulary Games**
  - Create assignment with VocabMaster + Memory Match + Hangman
  - Test vocabulary consistency across games
  - Verify shared vocabulary pool
  - Check individual game configuration
  - Test overall assignment scoring
  - Verify completion requirements

##### Mixed Skills Assignment
- [ ] **Comprehensive Skills Mix**
  - Create assignment with vocabulary + grammar + listening games
  - Test skill balance configuration
  - Verify cross-skill vocabulary usage
  - Check individual component weighting
  - Test overall progress tracking
  - Verify integrated gems/XP calculation

##### Assessment Battery Assignment
- [ ] **Full Assessment Suite**
  - Create assignment with listening + reading + grammar assessments
  - Test assessment sequence configuration
  - Verify time allocation across components
  - Check integrated scoring system
  - Test comprehensive results reporting
  - Verify detailed analytics provision

#### D. Vocabulary Source Configuration Testing

##### Category-Based Assignments
- [ ] **KS3 Category Assignment**
  - Test category selection (food_drink, family, etc.)
  - Verify subcategory filtering
  - Check vocabulary count limits
  - Test randomization settings
  - Verify curriculum level filtering

- [ ] **KS4 Exam Board Assignment**
  - Test exam board selection (AQA/Edexcel)
  - Verify tier selection (Foundation/Higher)
  - Check theme/topic filtering
  - Test vocabulary alignment with specifications
  - Verify exam-specific vocabulary sets

##### Custom List Assignments
- [ ] **Teacher Custom Lists**
  - Test custom vocabulary list creation
  - Verify list import functionality
  - Check vocabulary validation
  - Test list sharing between assignments
  - Verify custom list editing capabilities

##### Topic-Based Assignments
- [ ] **Thematic Vocabulary**
  - Test topic selection (daily routine, holidays, etc.)
  - Verify topic-specific vocabulary loading
  - Check cross-topic vocabulary overlap
  - Test topic difficulty progression
  - Verify cultural context integration

#### F. Curriculum Level & Vocabulary Source Testing

##### KS3 Vocabulary Testing
- [ ] **Category-Based Selection**
  - Test all KS3 categories (food_drink, family, school, etc.)
  - Verify subcategory filtering works correctly
  - Check vocabulary count per category
  - Test category-specific difficulty levels
  - Verify age-appropriate vocabulary selection

- [ ] **Cross-Category Assignments**
  - Test assignments spanning multiple categories
  - Verify vocabulary balance across categories
  - Check category-specific progress tracking
  - Test mixed-category game performance
  - Verify category mastery progression

##### KS4 Exam Board Testing
- [ ] **AQA Vocabulary Testing**
  - Test AQA Foundation tier vocabulary
  - Verify AQA Higher tier vocabulary
  - Check exam_board_code filtering accuracy
  - Test tier-specific vocabulary complexity
  - Verify AQA specification alignment

- [ ] **Edexcel Vocabulary Testing**
  - Test Edexcel Foundation tier vocabulary
  - Verify Edexcel Higher tier vocabulary
  - Check tier-specific vocabulary sets
  - Test Edexcel specification compliance
  - Verify exam board vocabulary differences

- [ ] **Theme/Topic Filtering for KS4**
  - Test theme selection (identity, relationships, etc.)
  - Verify topic filtering within themes
  - Check exam board specific themes
  - Test tier-appropriate topic complexity
  - Verify specification-aligned vocabulary

##### Vocabulary Numbering System Testing
- [ ] **Numbers Categories**
  - Test numbers_1_30 category functionality
  - Verify numbers_40_100 category separation
  - Check number range accuracy
  - Test number-specific games (Word Towers, etc.)
  - Verify number pronunciation/audio

- [ ] **Dates & Time Removal Verification**
  - Confirm Dates & Time category is removed
  - Test that no assignments reference old category
  - Verify time-related vocabulary moved to appropriate categories
  - Check calendar/time vocabulary accessibility
  - Test date-related games still function

##### Hierarchical Vocabulary Selection
- [ ] **KS2/KS5 No Vocabulary Verification**
  - Test KS2 level shows no vocabulary options
  - Verify KS5 level shows no vocabulary options
  - Check appropriate messaging for unavailable levels
  - Test graceful handling of empty vocabulary sets
  - Verify level selection validation

- [ ] **KS3 Category/Subcategory Only**
  - Test KS3 uses only category/subcategory filtering
  - Verify no exam board selection for KS3
  - Check subcategory depth and organization
  - Test category-based assignment creation
  - Verify KS3-appropriate vocabulary complexity

- [ ] **KS4 Exam Board Required Selection**
  - Test KS4 requires exam board selection first
  - Verify exam board selection enables theme/topic filters
  - Check tier selection after exam board choice
  - Test exam board-specific vocabulary loading
  - Verify proper filtering hierarchy (board → tier → theme → topic)

#### E. Assignment Configuration Validation

##### Gems & Rewards Configuration
- [ ] **Gems System Setup**
  - Test gem type selection (Mastery/Activity/Grammar)
  - Verify rarity calculation settings
  - Check XP conversion rates
  - Test mastery level cap configuration
  - Verify FSRS integration settings

##### Time & Attempt Limits
- [ ] **Time Management**
  - Test time limit configuration (per game/overall)
  - Verify attempt limit settings
  - Check time extension options
  - Test timeout behavior
  - Verify time tracking accuracy

##### Difficulty & Progression
- [ ] **Adaptive Difficulty**
  - Test difficulty level settings
  - Verify adaptive progression options
  - Check performance-based adjustments
  - Test mastery threshold configuration
  - Verify difficulty scaling validation

- [ ] **Assignment Management**
  - View assignments list with all types
  - Edit existing assignments (preserve game-specific settings)
  - Duplicate assignments (verify all configurations copy)
  - Delete assignments (confirm cascade deletion)
  - Verify all operations work correctly across assignment types

### 5. Analytics & Progress Monitoring
- [ ] **Student Progress Dashboard**
  - View individual student progress
  - Check assignment completion status
  - Verify accuracy and time tracking
  - Test progress filtering and sorting

- [ ] **Class Analytics**
  - View class-wide performance metrics
  - Check leaderboards functionality
  - Verify gem/XP tracking accuracy
  - Test analytics date range filters

- [ ] **Reports Generation**
  - Generate student progress reports
  - Export data (if available)
  - Verify report accuracy
  - Test different report formats

## 👨‍🎓 Student Journey Testing

### 1. Student Authentication
- [ ] **Student Login**
  - Navigate to student login page
  - Enter student ID and password
  - Verify successful login
  - Test invalid credentials handling
  - Verify redirect to student dashboard

### 2. Student Dashboard
- [ ] **Dashboard Overview**
  - Verify gems/XP display correctly
  - Check current level and progress
  - Verify recent activity shows
  - Test theme switching functionality

- [ ] **Assignment Access**
  - View available assignments
  - Check assignment details and due dates
  - Verify assignment status (not started, in progress, completed)
  - Test assignment filtering

### 3. Comprehensive Game Testing

#### A. Vocabulary-Based Games

##### VocabMaster Game
- [ ] **Game Launch & Setup**
  - Click on VocabMaster assignment
  - Verify game loads correctly with vocabulary
  - Test different modes (Mastery vs Adventure)
  - Check vocabulary source loading (category/assignment-based)
  - Verify language selection (Spanish/French/German)

- [ ] **Gameplay Mechanics**
  - Test all question types (translation, multiple choice, audio)
  - Verify correct/incorrect answer handling
  - Test hint system functionality and gem penalty
  - Test audio playback for vocabulary items
  - Verify skip functionality (if available)
  - Test time pressure modes

- [ ] **Gems & Progress Validation**
  - Verify gems awarded only for correct answers
  - Check gem rarity calculation (speed + accuracy)
  - Verify XP conversion (gems × rarity multiplier)
  - Test mastery level caps on gem rarity
  - Verify FSRS word selection and difficulty adjustment
  - Check session data recording (accuracy, time, attempts)

##### Memory Match Game
- [ ] **Game Mechanics**
  - Test card flipping functionality
  - Verify matching logic (word-translation pairs)
  - Check timer functionality and time pressure
  - Test different grid sizes (4x4, 6x6, etc.)
  - Verify card randomization between sessions

- [ ] **Gems Logic Validation**
  - Verify gems awarded ONLY for successful matches
  - Check NO gems awarded for failed flip attempts
  - Test gem rarity based on completion time
  - Verify session completion tracking
  - Check vocabulary mastery updates only on success

##### Word Towers Game
- [ ] **Game Modes**
  - Test clicking mode (standard points)
  - Test typing mode (double points verification)
  - Verify mode selection persistence
  - Check difficulty scaling with tower height

- [ ] **Gameplay & Rewards**
  - Test word validation accuracy
  - Verify tower building mechanics
  - Check completion criteria and thresholds
  - Test gems awarded per correct word
  - Verify double points calculation in typing mode
  - Check session progress tracking

##### Hangman Game
- [ ] **Game Mechanics**
  - Test letter guessing functionality
  - Verify word reveal logic
  - Check incorrect guess penalties (drawing progression)
  - Test hint system (if available)
  - Verify word completion detection

- [ ] **Gems & Scoring**
  - Verify gems awarded ONLY when complete word is guessed
  - Check NO penalties for incorrect letter guesses
  - Test gem rarity based on attempts and time
  - Verify vocabulary mastery tracking
  - Check session completion data

##### Word Scramble Game
- [ ] **Gameplay**
  - Test letter scrambling and unscrambling
  - Verify drag-and-drop functionality
  - Test keyboard input for word assembly
  - Check hint system (reveal letters)
  - Verify word validation

- [ ] **Progress Tracking**
  - Test gems awarded for correct unscrambling
  - Verify time-based gem rarity calculation
  - Check hint usage impact on rewards
  - Test session data accuracy

#### B. Sentence-Based Games

##### Sentence Builder Game
- [ ] **Game Setup**
  - Verify sentence loading from sentences table
  - Check category/subcategory filtering
  - Test difficulty level selection
  - Verify language-specific sentence sets

- [ ] **Gameplay Mechanics**
  - Test word/phrase drag-and-drop
  - Verify sentence construction logic
  - Check grammar validation
  - Test hint system for word order
  - Verify sentence completion detection

- [ ] **Gems & Vocabulary Tracking**
  - Test gems awarded for each recognized vocabulary expression
  - Verify multi-word expression recognition
  - Check gem calculation for sentence complexity
  - Test vocabulary mastery updates for expressions
  - Verify session progress tracking

##### Lava Temple Word Restore Game
- [ ] **Game Environment**
  - Test themed UI and animations
  - Verify word restoration mechanics
  - Check temple progression system
  - Test power-ups and special abilities

- [ ] **Sentence Restoration**
  - Test missing word identification
  - Verify context-based word selection
  - Check sentence completion validation
  - Test difficulty progression through temple levels

- [ ] **Rewards System**
  - Verify gems for each vocabulary expression restored
  - Test bonus gems for temple level completion
  - Check power-up impact on gem rewards
  - Verify session tracking and progress

##### Case File Translator Game
- [ ] **Detective Theme**
  - Test case file presentation
  - Verify translation challenge setup
  - Check evidence-based vocabulary context
  - Test case progression mechanics

- [ ] **Translation Mechanics**
  - Test sentence/phrase translation accuracy
  - Verify multiple acceptable translations
  - Check context clue system
  - Test case completion criteria

- [ ] **Progress & Rewards**
  - Verify gems for each vocabulary expression translated
  - Test case completion bonus gems
  - Check detective rank progression
  - Verify session data recording

#### C. Grammar & Conjugation Games

##### Conjugation Duel Game
- [ ] **Game Setup**
  - Verify verb loading from grammar_verbs table
  - Test tense selection (present, past, future, etc.)
  - Check person selection (yo, tú, él/ella, etc.)
  - Verify difficulty level configuration
  - Test language-specific verb sets

- [ ] **Duel Mechanics**
  - Test verb conjugation challenges
  - Verify answer validation accuracy
  - Check multiple acceptable forms
  - Test time pressure in duel mode
  - Verify opponent AI behavior

- [ ] **Grammar Gems System**
  - Test Grammar Gems awarded for correct conjugations
  - Verify conjugations table tracking
  - Check SRS tracking for base verbs
  - Test mastery progression for tenses
  - Verify session performance tracking

##### Verb Quest Game
- [ ] **Quest Progression**
  - Test verb quest storyline
  - Verify level progression mechanics
  - Check quest completion criteria
  - Test different quest types

- [ ] **Conjugation Challenges**
  - Test various tense combinations
  - Verify irregular verb handling
  - Check reflexive verb conjugations
  - Test compound tense formations

- [ ] **Rewards & Progress**
  - Verify Grammar Gems for quest milestones
  - Test XP progression through quests
  - Check verb mastery tracking
  - Verify achievement unlocks

#### D. Listening & Audio Games

##### Detective Listening Game
- [ ] **Audio Setup**
  - Test audio file loading and playback
  - Verify audio quality and clarity
  - Check playback controls (play, pause, replay)
  - Test volume controls
  - Verify audio synchronization

- [ ] **Listening Comprehension**
  - Test question types (multiple choice, fill-in-blank)
  - Verify audio-question alignment
  - Check answer validation accuracy
  - Test replay limitations (if any)
  - Verify transcript availability (if applicable)

- [ ] **Progress & Gems**
  - Test gems awarded for correct listening comprehension
  - Verify audio-based vocabulary recognition
  - Check session completion tracking
  - Test listening skill progression

#### E. Speed & Timed Games

##### Speed Builder Game
- [ ] **Speed Mechanics**
  - Test time pressure functionality
  - Verify speed bonus calculations
  - Check countdown timer accuracy
  - Test rapid-fire question delivery
  - Verify streak bonus system

- [ ] **Performance Tracking**
  - Test words-per-minute calculation
  - Verify accuracy under time pressure
  - Check speed improvement tracking
  - Test leaderboard integration

- [ ] **Gems & Rewards**
  - Verify speed-based gem rarity bonuses
  - Test streak multiplier effects
  - Check time-based achievement unlocks
  - Verify session performance data

##### Word Blast Game
- [ ] **Blast Mechanics**
  - Test rapid word presentation
  - Verify quick response validation
  - Check blast sequence timing
  - Test combo system (if available)

- [ ] **Scoring System**
  - Test rapid-fire scoring
  - Verify combo multipliers
  - Check time bonus calculations
  - Test accuracy penalties

##### Noughts and Crosses (Tic-Tac-Toe)
- [ ] **Game Board**
  - Test 3x3 grid functionality
  - Verify vocabulary-based square claiming
  - Check win condition detection
  - Test AI opponent behavior

- [ ] **Vocabulary Integration**
  - Test vocabulary questions for square claiming
  - Verify correct answer requirement
  - Check vocabulary difficulty scaling
  - Test strategic gameplay elements

- [ ] **FSRS Integration Reference**
  - Verify this game follows FSRS integration pattern
  - Test word selection based on spaced repetition
  - Check mastery level tracking
  - Verify gem rewards for vocabulary mastery

### 4. Comprehensive Assessment Testing

#### A. AQA Listening Assessments

##### Foundation Tier Testing
- [ ] **Question Type 1: Multiple Choice (4 options)**
  - Test audio playback for questions 1-4
  - Verify 4 answer options per question
  - Check single correct answer validation
  - Test audio replay functionality (2 plays + 1 final)
  - Verify 1 mark per question scoring

- [ ] **Question Type 2: Gap Fill (Single Words)**
  - Test audio playback for questions 5-8
  - Verify single word answer validation
  - Check spelling tolerance settings
  - Test case-insensitive marking
  - Verify 1 mark per question scoring

- [ ] **Question Type 3: Short Answer (2-3 words)**
  - Test audio playback for questions 9-12
  - Verify multi-word answer validation
  - Check partial credit marking
  - Test acceptable alternative answers
  - Verify 2 marks per question scoring

##### Higher Tier Testing
- [ ] **Question Type 1: Multiple Choice (Complex)**
  - Test longer audio passages
  - Verify inference-based questions
  - Check distractor option effectiveness
  - Test advanced vocabulary recognition

- [ ] **Question Type 2: Extended Gap Fill**
  - Test phrase-level gap filling
  - Verify grammatical accuracy requirements
  - Check context-dependent answers
  - Test advanced spelling requirements

- [ ] **Assessment Completion & Scoring**
  - Verify total score calculation (Foundation: 12 marks, Higher: varies)
  - Test grade boundary application
  - Check detailed feedback provision
  - Verify results storage and retrieval

#### B. Edexcel Listening Assessments

##### Foundation Tier Testing
- [ ] **Section A: Fill-in-the-gap (Q1-Q2)**
  - Test single word gap completion
  - Verify 1 mark per question
  - Check audio clarity and pacing
  - Test spelling accuracy requirements

- [ ] **Section B: Complete sentences (Q3-Q6)**
  - Test sentence completion tasks
  - Verify 2 marks per question
  - Check grammatical accuracy requirements
  - Test context comprehension

##### Higher Tier Testing
- [ ] **Advanced Question Types**
  - Test complex inference questions
  - Verify opinion/attitude recognition
  - Check detailed comprehension tasks
  - Test extended response validation

- [ ] **Crossover Questions**
  - Test questions appearing in both tiers
  - Verify consistent marking standards
  - Check difficulty progression
  - Test adaptive scoring

#### C. Reading Comprehension Assessments

##### Text-Based Questions
- [ ] **Multiple Choice Reading**
  - Test text comprehension accuracy
  - Verify question-text alignment
  - Check answer option validity
  - Test reading time allocation

- [ ] **Gap Fill Reading**
  - Test context-based word selection
  - Verify grammatical accuracy
  - Check vocabulary level appropriateness
  - Test completion validation

- [ ] **Short Answer Reading**
  - Test comprehension-based responses
  - Verify answer length requirements
  - Check marking criteria application
  - Test partial credit allocation

#### D. Grammar Assessments & Skills Tests

##### Grammar Category Testing
- [ ] **Verbs Assessment**
  - Test present tense conjugations (regular/irregular)
  - Verify past tense formations
  - Check future tense constructions
  - Test conditional mood usage
  - Verify subjunctive mood (advanced)
  - Check imperative form recognition

- [ ] **Adjectives Assessment**
  - Test gender agreement rules
  - Verify number agreement (singular/plural)
  - Check comparative forms
  - Test superlative constructions
  - Verify position rules (before/after noun)

- [ ] **Nouns Assessment**
  - Test gender identification
  - Verify plural formation rules
  - Check article agreement (definite/indefinite)
  - Test noun-adjective agreement
  - Verify compound noun recognition

- [ ] **Pronouns Assessment**
  - Test subject pronoun usage
  - Verify object pronoun placement
  - Check reflexive pronoun usage
  - Test possessive pronoun agreement
  - Verify relative pronoun usage

##### Skills Integration Testing
- [ ] **Lesson Components**
  - Test grammar explanation clarity
  - Verify example sentence relevance
  - Check interactive exercise functionality
  - Test progress tracking through lessons

- [ ] **Practice Components**
  - Test drill exercise variety
  - Verify immediate feedback provision
  - Check difficulty progression
  - Test adaptive practice algorithms

- [ ] **Test Components**
  - Test comprehensive grammar assessment
  - Verify mixed question types
  - Check time limit enforcement
  - Test detailed results analysis

#### E. Four Skills Assessment Testing

##### Listening Component
- [ ] **Audio Quality & Delivery**
  - Test native speaker recordings
  - Verify audio clarity and volume
  - Check background noise levels
  - Test playback reliability

- [ ] **Question Variety**
  - Test multiple choice questions
  - Verify gap-fill exercises
  - Check true/false statements
  - Test short answer responses

##### Reading Component
- [ ] **Text Variety**
  - Test authentic material usage
  - Verify appropriate difficulty levels
  - Check cultural content relevance
  - Test text length appropriateness

- [ ] **Comprehension Tasks**
  - Test main idea identification
  - Verify detail extraction
  - Check inference questions
  - Test vocabulary in context

##### Writing Component (if applicable)
- [ ] **Writing Tasks**
  - Test guided writing exercises
  - Verify prompt clarity
  - Check word count requirements
  - Test assessment criteria application

##### Speaking Component (if applicable)
- [ ] **Speaking Tasks**
  - Test pronunciation assessment
  - Verify fluency evaluation
  - Check vocabulary usage
  - Test interactive elements

### 5. Progress & Analytics
- [ ] **Personal Progress**
  - View personal statistics
  - Check gem collection by type (Mastery, Activity, Grammar)
  - Verify XP and level progression
  - Test achievement system unlocks
  - Check vocabulary mastery tracking

- [ ] **Assignment Progress**
  - View assignment completion status
  - Check scores and accuracy by game type
  - Verify time tracking accuracy
  - Test progress persistence across sessions
  - Check detailed performance analytics

## 🔧 Technical Testing

### 1. Cross-Browser & Responsiveness
- [ ] **Chrome** (latest version)
  - Test all core functionality
  - Verify responsive design
- [ ] **Firefox** (latest version)
  - Test all core functionality
  - Verify responsive design
- [ ] **Safari** (latest version)
  - Test all core functionality
  - Verify responsive design
- [ ] **Edge** (latest version)
  - Test all core functionality
  - Verify responsive design
- [ ] **Mobile Devices**
  - Test on actual mobile devices (various screen sizes)
  - Verify touch interactions
  - Check responsive layout
  - Test game functionality on mobile
- [ ] **Tablet Devices**
  - Test on tablet devices (various screen sizes)
  - Verify touch interactions
  - Check responsive layout
  - Test game functionality on tablet

### 2. Performance Testing
- [ ] **Page Load Times**
  - Measure dashboard load times
  - Test game loading performance
  - Check image and asset loading
  - Verify acceptable performance
- [ ] **Concurrent Users**
  - Test multiple students playing simultaneously
  - Verify system stability
  - Check database performance
  - Monitor server response times

## 💎 Comprehensive Gems Logic Validation

### A. Mastery Gems (Vocabulary Learning)
- [ ] **Correct Award Conditions**
  - Verify gems awarded ONLY for correct vocabulary answers
  - Test no gems for incorrect answers in skill-based games
  - Check gems awarded for successful matches in Memory Match
  - Verify gems for complete word guessing in Hangman
  - Test gems for vocabulary expressions in sentence games

- [ ] **Gem Rarity Calculation**
  - Test speed-based rarity (faster = higher rarity)
  - Verify streak bonus impact on rarity
  - Check accuracy impact on gem quality
  - Test mastery level caps (prevent grinding)
  - Verify performance threshold calculations

- [ ] **FSRS Integration**
  - Test spaced repetition word selection
  - Verify difficulty adjustment based on performance
  - Check mastery level progression
  - Test review scheduling accuracy
  - Verify long-term retention tracking

### B. Activity Gems (Engagement Rewards)
- [ ] **Immediate Performance Rewards**
  - Test 2-5 XP gems for game engagement
  - Verify consistent reward across all games
  - Check session completion bonuses
  - Test streak maintenance rewards
  - Verify daily activity bonuses

- [ ] **Game-Specific Activity Rewards**
  - Test Memory Match: gems for game completion (not individual matches)
  - Verify Speed Builder: time-based activity gems
  - Check Word Towers: typing mode engagement bonuses
  - Test Detective Listening: audio engagement rewards
  - Verify Conjugation Duel: duel participation gems

### C. Grammar Gems (Grammar Mastery)
- [ ] **Conjugation Tracking**
  - Test Grammar Gems for correct conjugations
  - Verify conjugations table granular tracking
  - Check tense-specific mastery progression
  - Test person-specific accuracy tracking
  - Verify verb-specific performance data

- [ ] **SRS Integration for Base Verbs**
  - Test spaced repetition for infinitive verbs
  - Verify base verb difficulty adjustment
  - Check review scheduling for verb families
  - Test mastery progression for verb types
  - Verify long-term retention for grammar concepts

- [ ] **Grammar Dashboard Analytics**
  - Test student grammar performance heatmaps
  - Verify teacher grammar insights dashboard
  - Check actionable grammar weakness identification
  - Test grammar mastery progression tracking
  - Verify comprehensive grammar reporting

### D. XP Conversion & Level Progression
- [ ] **Conversion Accuracy**
  - Test Mastery Gems: 5-200 XP based on rarity
  - Verify Activity Gems: 2-5 XP consistent rewards
  - Check Grammar Gems: variable XP based on difficulty
  - Test total XP calculation accuracy
  - Verify level progression thresholds

- [ ] **Level System Validation**
  - Test level progression calculations
  - Verify XP requirements per level
  - Check level-based feature unlocks
  - Test prestige/advanced level systems
  - Verify level display accuracy

### E. Anti-Grinding Mechanisms
- [ ] **Mastery Level Caps**
  - Test maximum gem rarity restrictions
  - Verify mastery level progression requirements
  - Check diminishing returns for repeated words
  - Test vocabulary rotation enforcement
  - Verify balanced progression curves

- [ ] **Session Limits**
  - Test daily/weekly gem caps (if applicable)
  - Verify session length impact on rewards
  - Check quality over quantity enforcement
  - Test break encouragement systems
  - Verify healthy usage pattern promotion

### F. Cross-Game Consistency
- [ ] **Unified Reward Logic**
  - Test same vocabulary word across different games
  - Verify consistent gem rarity calculations
  - Check unified mastery tracking
  - Test cross-game progress synchronization
  - Verify consistent XP conversion rates

- [ ] **Assignment vs Free Play**
  - Test assignment mode gem calculations
  - Verify free play mode reward consistency
  - Check assignment-specific bonus gems
  - Test teacher-configured reward multipliers
  - Verify assignment completion bonuses

### G. Session Data Recording
- [ ] **Comprehensive Tracking**
  - Test accuracy percentage recording
  - Verify response time tracking
  - Check attempt count logging
  - Test hint usage tracking
  - Verify completion status recording

- [ ] **Analytics Integration**
  - Test real-time dashboard updates
  - Verify historical progress tracking
  - Check detailed performance analytics
  - Test teacher insight generation
  - Verify student progress visualization

### 3. Security & Error Handling
- [ ] **Authorization Checks:**
  - [ ] As a student, attempt to access teacher-only pages directly via URL. Verify access is denied.
  - [ ] As Teacher A, attempt to view/edit another teacher's class/assignment data via URL manipulation. Verify unauthorized access is prevented.
  - [ ] As Student A, attempt to view another student's personal progress data via URL manipulation. Verify unauthorized access is prevented.
- [ ] **Session Management:**
  - [ ] After logging in, close the browser tab/window without logging out. Reopen and verify session state (e.g., remembered vs. logged out).
  - [ ] Log in on one device/browser, then try to log in on another with the same credentials. Observe concurrent session behavior.
- [ ] **Input Sanitization (Manual Attempt):**
  - [ ] In all text input fields (e.g., class names, descriptions, profile info), try entering simple HTML tags (e.g., `<b>bold</b>`, `<script>alert('XSS');</script>`).
  - [ ] After saving, view the content to verify that the HTML/script is not rendered or executed and is properly escaped/sanitized.
- [ ] **Error Message Disclosure:**
  - [ ] Intentionally trigger errors (e.g., invalid login attempts, malformed data if possible).
  - [ ] Verify that error messages are generic and do not leak sensitive information (e.g., database errors, server paths).
- [ ] **Network Issues:**
  - [ ] Test offline functionality (if applicable for any part of the app).
  - [ ] Test slow network conditions.
  - [ ] Verify clear error messages for network failures.
  - [ ] Test recovery after network restoration.
- [ ] **Data Validation:**
  - [ ] Test all form validation rules (e.g., required fields, min/max length, valid formats).
  - [ ] Test boundary conditions for numerical inputs (e.g., minimum/maximum points for an assignment).
  - [ ] Check clarity and helpfulness of validation error messages.

### 4. Accessibility Testing (WCAG 2.1 AA Compliance)
- [ ] **Keyboard Navigation:**
  - [ ] Verify all interactive elements (buttons, links, form fields, game controls) are reachable and operable using only the keyboard (Tab, Shift+Tab, Enter, Spacebar, arrow keys).
  - [ ] Check for clear and visible focus indicators on all interactive elements.
  - [ ] Ensure no keyboard traps exist (users can navigate away from any element).
- [ ] **Screen Reader Compatibility:**
  - [ ] Navigate through key pages (dashboard, assignment list, a game) using a screen reader (e.g., NVDA, VoiceOver).
  - [ ] Verify that all meaningful images have appropriate `alt` text.
  - [ ] Check that form fields have proper labels explicitly associated with them.
  - [ ] Ensure dynamic content updates (e.g., game scores, progress updates) are announced by the screen reader.
  - [ ] Verify proper heading structure (`<h1>`, `<h2>`, etc.) is used for semantic navigation.
- [ ] **Color Contrast:**
  - [ ] Visually inspect various pages for sufficient contrast between text and background, and between interactive elements and their background (aim for WCAG AA).
- [ ] **Zoom Functionality:**
  - [ ] Test browser zoom up to 200% without loss of content or functionality (no horizontal scrolling required for normal reading).

### 5. Localization/Internationalization (If UI language switching is implemented)
- [ ] **Language Switching (UI):**
  - [ ] If a UI language selector exists, switch between available languages (e.g., English, Spanish, French, German).
  - [ ] Verify that all static UI elements (buttons, menus, labels) update correctly to the selected language.
  - [ ] Check that dynamic messages (e.g., "Assignment Completed!") also translate appropriately.
  - [ ] Verify that date and number formats adapt to the selected locale (if applicable).

## 📊 Success Criteria

### Critical Issues (Must Fix)
- [ ] No authentication failures
- [ ] All games load and complete successfully
- [ ] Progress tracking works accurately
- [ ] No data loss during gameplay
- [ ] No unauthorized access to data or features (critical security flaws)

### Important Issues (Should Fix)
- [ ] Responsive design works on all devices
- [ ] Performance meets acceptable standards
- [ ] Error messages are user-friendly and informative
- [ ] All features work across supported browsers
- [ ] Accessibility baseline (WCAG A) met, aiming for AA

### Minor Issues (Nice to Fix)
- [ ] UI/UX improvements
- [ ] Performance optimizations
- [ ] Additional feature enhancements
- [ ] Accessibility improvements beyond AA (e.g., AAA for some elements)

## 📝 Issue Reporting Template

For each issue found, document:
- **Issue ID**: Unique identifier
- **Severity**: Critical/High/Medium/Low
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps
- **Expected Result**: What should happen
- **Actual Result**: What actually happens
- **Browser/Device**: Testing environment
- **Screenshots**: Visual evidence
- **Console Errors**: Any JavaScript errors

---

## 🔄 End-to-End Integration Testing

### Complete Teacher-Student Journey with Gems Validation

#### Phase 1: Teacher Setup & Assignment Creation
- [ ] **Teacher Account & Class Setup**
  - Create teacher account and verify email
  - Set up class with 5 test students
  - Generate student passwords (verify format: adjective/color + gem + number)
  - Verify all students can log in successfully

- [ ] **Multi-Game Assignment Creation**
  - Create assignment with VocabMaster + Memory Match + Conjugation Duel
  - Configure KS4 AQA Foundation vocabulary (20 words)
  - Set assignment due date and point values
  - Verify assignment appears in class assignment list

#### Phase 2: Student Journey & Gems Tracking
- [ ] **Student Login & Assignment Access**
  - Log in as Student 1 with generated credentials
  - Navigate to assignment and verify all 3 games visible
  - Check initial gems/XP count (should be 0)
  - Verify assignment details and requirements

- [ ] **VocabMaster Game Completion**
  - Complete VocabMaster with 80% accuracy
  - Verify Mastery Gems awarded for correct answers only
  - Check gem rarity calculation based on speed/accuracy
  - Verify XP conversion (5-200 XP range)
  - Confirm vocabulary mastery tracking updates

- [ ] **Memory Match Game Completion**
  - Complete Memory Match game successfully
  - Verify gems awarded ONLY for successful matches
  - Check NO gems awarded for failed flip attempts
  - Verify Activity Gems for game completion
  - Confirm session data recording accuracy

- [ ] **Conjugation Duel Game Completion**
  - Complete Conjugation Duel with present tense verbs
  - Verify Grammar Gems awarded for correct conjugations
  - Check conjugations table granular tracking
  - Verify SRS tracking for base verbs
  - Confirm grammar mastery progression

#### Phase 3: Progress Validation & Analytics
- [ ] **Student Progress Dashboard**
  - Verify total gems collected across all games
  - Check XP progression and level advancement
  - Confirm assignment completion status
  - Verify individual game performance metrics
  - Check vocabulary mastery indicators

- [ ] **Teacher Analytics Dashboard**
  - View student progress in teacher dashboard
  - Verify assignment completion tracking
  - Check detailed performance analytics
  - Confirm gems/XP data accuracy
  - Verify class-wide performance metrics

#### Phase 4: Cross-Game Consistency Validation
- [ ] **Same Vocabulary Across Games**
  - Identify vocabulary words that appeared in multiple games
  - Verify consistent mastery tracking across games
  - Check unified gem rarity calculations
  - Confirm cross-game progress synchronization
  - Verify vocabulary ID preservation

- [ ] **FSRS Integration Validation**
  - Complete assignment with Student 2
  - Return next day and start new assignment
  - Verify spaced repetition word selection
  - Check difficulty adjustment based on previous performance
  - Confirm review scheduling accuracy

#### Phase 5: Assessment Integration Testing
- [ ] **Mixed Assignment with Assessment**
  - Create assignment with VocabMaster + AQA Listening Assessment
  - Complete vocabulary game portion (verify gems)
  - Complete listening assessment (verify scoring)
  - Check integrated progress tracking
  - Verify separate gem systems don't interfere

#### Phase 6: Error Recovery & Edge Cases
- [ ] **Network Interruption Testing**
  - Start game session and disconnect network mid-game
  - Reconnect and verify progress preservation
  - Check gems/XP data integrity
  - Verify session recovery functionality
  - Confirm no duplicate gem awards

- [ ] **Concurrent Student Testing**
  - Have 3 students complete same assignment simultaneously
  - Verify no gem calculation interference
  - Check database consistency
  - Confirm individual progress tracking
  - Verify system stability under load

### Integration Success Criteria
- [ ] **Gems System Integrity**
  - All gem types (Mastery, Activity, Grammar) function correctly
  - Gem rarity calculations are accurate and consistent
  - XP conversion works properly across all games
  - No duplicate or missing gem awards
  - Anti-grinding mechanisms function as designed

- [ ] **Progress Tracking Accuracy**
  - Vocabulary mastery tracking is consistent across games
  - Session data recording is complete and accurate
  - Analytics dashboards reflect real student performance
  - FSRS integration works seamlessly
  - Cross-game progress synchronization is maintained

- [ ] **System Stability**
  - No critical errors during complete user journeys
  - Database integrity maintained under concurrent usage
  - Network interruption recovery works properly
  - Performance remains acceptable throughout testing
  - All user flows complete successfully

---

**Testing Status**: Ready for comprehensive execution
**Last Updated**: 2025-08-18
**Next Review**: After integration testing completion
**Estimated Testing Time**: 8-12 hours for complete validation