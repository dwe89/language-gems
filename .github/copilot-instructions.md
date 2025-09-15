# Language Gems - AI Coding Assistant Instructions

## Project Overview
Language Gems is a Next.js 14 educational platform for language learning with teacher/student dashboards, interactive games, and AI-powered worksheet generation. Built with Supabase backend, featuring complex audio/TTS integrations and real-time analytics.

## Architecture Overview

### Core Components
- **Frontend**: Next.js 14 app router with TypeScript, TailwindCSS, React components
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS policies)
- **Games**: Phaser.js for interactive vocabulary games
- **Audio**: Multi-provider TTS (AWS Polly, Google Cloud TTS, Gemini) with caching
- **Analytics**: Real-time progress tracking with Console Ninja integration

### Key Directories
- `src/app/api/` - API routes (worksheets, assessments, audio, analytics)
- `src/app/api/worksheets/generate-html/generators/` - Worksheet generators (reading-comprehension.ts, vocabulary-practice.ts, etc.)
- `src/services/` - Business logic services (vocabulary, audio, assessments)
- `src/lib/` - Utilities, database types, Supabase clients
- `scripts/` - Data population, audio generation, testing scripts

## Critical Developer Workflows

### Development Server
```bash
npm run dev  # Start Next.js dev server
```

### Testing
```bash
npm test              # Run Vitest tests
npm run test:watch    # Watch mode testing
```

### Audio Generation Scripts
```bash
npm run generate-vocabulary-audio    # Generate vocabulary audio files
npm run generate-listening-audio     # Generate assessment audio
npm run test-tts-models             # Test TTS provider configurations
```

### Data Population
```bash
npm run populate-reading-comprehension  # Populate reading assessments
npm run populate-aqa-listening-assessments  # Populate AQA listening tests
npm run populate-sentences             # Populate sentence data
```

### Production Testing
```bash
npm run test:production              # Full production readiness test
npm run benchmark                    # Performance benchmarking
```

## Project-Specific Patterns

### Worksheet Generation System
- Generators in `src/app/api/worksheets/generate-html/generators/`
- Each generator handles specific worksheet types (reading comprehension, vocabulary, grammar)
- Use `rawContent` from worksheet data for dynamic content
- Example: Reading comprehension worksheets include multiple choice, true/false, word search, vocabulary sections

### Service Architecture
- Services in `src/services/` handle business logic
- Examples: `VocabularyService.ts`, `AudioFileManager.ts`, `AIVocabularyCurationService.ts`
- Services integrate with Supabase and external APIs
- Use dependency injection pattern for testability

### Data Structures
- Complex nested objects for educational content
- Example worksheet structure:
```typescript
interface WorksheetData {
  title: string;
  rawContent: {
    article_paragraphs_html: string;
    multiple_choice_questions: MultipleChoiceQuestion[];
    word_search_words: string[];
    // ... other content types
  };
}
```

### Authentication & Authorization
- Supabase auth with role-based access (teacher/student)
- Middleware in `src/middleware.ts` handles route protection
- User profiles include subscription status, school ownership
- RLS policies enforce data access controls

### Audio Management
- Multi-provider TTS with fallback logic
- Audio files cached in Supabase storage
- Use `SupabaseAudioManager.ts` for upload/download
- Audio quality testing scripts available

### Feature Flags
- Feature flags in `src/lib/feature-flags.ts`
- Environment-based feature toggling
- Used for gradual rollouts and A/B testing

## Integration Points

### External Services
- **Supabase**: Primary database, auth, file storage
- **AWS Polly**: High-quality TTS for assessments
- **Google Cloud TTS**: Alternative TTS provider
- **Gemini**: AI content generation and marking
- **OpenAI**: AI-powered features
- **Stripe**: Payment processing
- **Vercel**: Deployment platform

### API Patterns
- RESTful API routes in `src/app/api/`
- Consistent error handling with try/catch
- Use Supabase client for database operations
- File uploads handled via Supabase storage

### Real-time Features
- Console Ninja integration for runtime monitoring
- Real-time analytics in `src/services/analytics/`
- WebSocket connections for live updates

## Development Best Practices

### Code Organization
- Group related functionality in feature directories
- Use TypeScript interfaces for data structures
- Follow Next.js app router conventions
- Separate business logic into services

### Testing Strategy
- Vitest with jsdom for component testing
- Integration tests for API routes
- Mock external services for reliable testing
- Coverage thresholds: 70% branches/functions/lines/statements

### Performance Considerations
- Audio files cached and pre-generated
- Lazy loading for game components
- Database query optimization with indexes
- Bundle analysis with `@next/bundle-analyzer`

### Deployment
- Vercel for frontend deployment
- Environment variables managed in Vercel dashboard
- Database migrations handled via Supabase
- CDN for static assets and audio files

## Common Patterns & Gotchas

### Worksheet Generation
- Always check `worksheet.rawContent` before `worksheet.content.rawContent`
- Handle missing content gracefully with fallback HTML
- Word search generation uses `@blex41/word-search` library
- PDF generation via Puppeteer for downloads

### Audio Integration
- Test TTS providers before deployment
- Handle audio file cleanup to prevent storage bloat
- Use caching to avoid redundant TTS calls
- Support multiple audio formats (MP3, WAV)

### Database Operations
- Use Supabase RLS policies for security
- Batch operations for large data imports
- Handle connection timeouts gracefully
- Use transactions for related data updates

### Error Handling
- Consistent error responses from API routes
- Log errors with context for debugging
- Graceful degradation for external service failures
- User-friendly error messages in UI

## Key Files to Reference
- `src/lib/database.types.ts` - Database schema definitions
- `src/app/api/worksheets/generate-html/generators/reading-comprehension.ts` - Complex worksheet generation example
- `src/services/VocabularyService.ts` - Service pattern example
- `src/middleware.ts` - Authentication middleware
- `package.json` - Available scripts and dependencies</content>
<parameter name="filePath">/Users/home/Documents/Projects/language-gems-recovered/.github/copilot-instructions.md