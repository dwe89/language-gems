# Language Gems MCP Server

A comprehensive Model Context Protocol (MCP) server for the Language Gems vocabulary learning platform. This server provides centralized backend functionality for assignments, vocabulary management, game sessions, analytics, and competitions.

## Features

### 🎯 Assignment Management
- Create and manage vocabulary assignments
- Track student progress and completion
- Generate detailed analytics for teachers
- Support for multiple game types and vocabulary sources

### 📚 Enhanced Vocabulary Management
- Create custom vocabulary lists with words, sentences, and mixed content
- Support for multiple languages (Spanish, French, German, Italian)
- Game compatibility checking and optimization
- Public and private vocabulary sharing

### 🎮 Game Session Tracking
- Start and end game sessions with detailed metrics
- Cross-game progress tracking and analytics
- XP and achievement system integration
- Real-time leaderboard updates

### 📊 Analytics & Reporting
- Cross-game leaderboards with time period filtering
- Individual student performance analytics
- Class-wide statistics and insights
- Competition tracking and management

### 🏆 Competition System
- Create and manage vocabulary competitions
- Support for different competition types (daily, weekly, monthly, special)
- Automated scoring and ranking
- Public and class-specific competitions

## Installation

1. **Clone and navigate to the MCP server directory:**
   ```bash
   cd mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Build the server:**
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for full database access)
- `NODE_ENV`: Environment (development/production)

### MCP Client Configuration

Add to your MCP client configuration (e.g., `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "language-gems": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
      }
    }
  }
}
```

## Available Tools

### Assignment Management

#### `create_assignment`
Create a new assignment for students.

**Parameters:**
- `title` (string): Assignment title
- `description` (string, optional): Assignment description
- `teacher_id` (string): Teacher UUID
- `class_id` (string): Class UUID
- `game_type` (string): Type of game for the assignment
- `vocabulary_selection` (object): Vocabulary selection configuration
- `game_settings` (object): Game-specific settings
- `due_date` (string, optional): Due date (ISO string)
- `time_limit` (number, optional): Time limit in minutes

#### `get_assignment`
Get assignment details by ID.

#### `update_assignment_progress`
Update student progress on an assignment.

#### `get_assignment_analytics`
Get analytics for an assignment.

### Vocabulary Management

#### `create_vocabulary_list`
Create a new enhanced vocabulary list with support for words, sentences, and mixed content.

#### `get_vocabulary_lists`
Get vocabulary lists with optional filtering by teacher, language, content type, etc.

#### `get_vocabulary_for_game`
Get vocabulary items formatted for a specific game with compatibility checking.

### Game Session Management

#### `start_game_session`
Start a new game session and return session ID.

#### `end_game_session`
End a game session and record detailed results including XP and achievement updates.

### Analytics & Leaderboards

#### `get_cross_game_leaderboard`
Get cross-game leaderboard data with time period filtering.

#### `get_student_analytics`
Get comprehensive analytics for a specific student.

#### `get_class_analytics`
Get analytics for an entire class.

### Competition Management

#### `create_competition`
Create a new competition with custom rules and rewards.

#### `get_active_competitions`
Get currently active competitions.

## Usage Examples

### Creating an Assignment

```typescript
const assignment = await mcpClient.callTool('create_assignment', {
  title: 'Spanish Animals Vocabulary',
  description: 'Practice animal names in Spanish using the memory game',
  teacher_id: 'teacher-uuid',
  class_id: 'class-uuid',
  game_type: 'memory-game',
  vocabulary_selection: {
    type: 'random',
    count: 20
  },
  game_settings: {
    difficulty: 'intermediate',
    time_limit: 300
  },
  due_date: '2025-02-01T23:59:59Z'
});
```

### Starting a Game Session

```typescript
const session = await mcpClient.callTool('start_game_session', {
  student_id: 'student-uuid',
  assignment_id: 'assignment-uuid',
  game_type: 'memory-game',
  session_mode: 'assignment',
  max_score_possible: 1000
});
```

### Getting Cross-Game Leaderboard

```typescript
const leaderboard = await mcpClient.callTool('get_cross_game_leaderboard', {
  class_id: 'class-uuid',
  time_period: 'weekly',
  limit: 20
});
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Database Schema

The MCP server works with the following key database tables:

- `assignments` - Assignment definitions
- `assignment_progress` - Student progress tracking
- `enhanced_vocabulary_lists` - Custom vocabulary lists
- `enhanced_vocabulary_items` - Individual vocabulary items
- `enhanced_game_sessions` - Game session tracking
- `student_game_profiles` - Student XP and achievement data
- `competitions` - Competition definitions
- `competition_entries` - Competition participation

## Error Handling

The server includes comprehensive error handling with:
- Input validation using Zod schemas
- Database error handling and rollback
- Detailed error messages for debugging
- Graceful degradation for missing data

## Security

- Uses Supabase Row Level Security (RLS) for data access control
- Service role key required for administrative operations
- Input validation and sanitization
- Secure session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
