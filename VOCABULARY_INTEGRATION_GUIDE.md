# Vocabulary & Theme Integration Guide

## 🎯 Overview

This guide shows how to integrate the enhanced game system with your existing vocabulary, themes, and topics, plus implement the new gem/diamond theme throughout the platform.

## 📊 Database Integration

### 1. **Vocabulary Enhancement**

First, enhance your existing vocabulary table to support gem types:

```sql
-- Add gem type columns to existing vocabulary table
ALTER TABLE vocabulary 
ADD COLUMN gem_type TEXT DEFAULT 'common' CHECK (gem_type IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
ADD COLUMN gem_color TEXT,
ADD COLUMN frequency_score INTEGER DEFAULT 50,
ADD COLUMN difficulty_level TEXT DEFAULT 'intermediate';

-- Update existing vocabulary with gem types based on frequency
UPDATE vocabulary 
SET gem_type = CASE 
  WHEN frequency_score > 80 THEN 'common'
  WHEN frequency_score > 60 THEN 'uncommon'
  WHEN frequency_score > 40 THEN 'rare'
  WHEN frequency_score > 20 THEN 'epic'
  ELSE 'legendary'
END;

-- Add indexes for performance
CREATE INDEX idx_vocabulary_gem_type ON vocabulary(gem_type);
CREATE INDEX idx_vocabulary_theme_topic ON vocabulary(theme, topic);
CREATE INDEX idx_vocabulary_frequency ON vocabulary(frequency_score);
```

### 2. **Theme Configuration**

Update your themes to use gem/mining terminology:

```sql
-- Create theme mapping table for gem themes
CREATE TABLE theme_gem_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_theme TEXT NOT NULL,
  gem_theme_name TEXT NOT NULL,
  gem_icon TEXT NOT NULL,
  gem_color TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert gem theme mappings
INSERT INTO theme_gem_mapping (original_theme, gem_theme_name, gem_icon, gem_color, description) VALUES
('Daily Life', 'Everyday Gem Mine', '🏠', 'from-blue-500 to-blue-700', 'Essential everyday vocabulary gems'),
('Travel', 'Adventure Gem Caves', '✈️', 'from-green-500 to-green-700', 'Travel vocabulary treasures'),
('Food', 'Culinary Crystal Caverns', '🍽️', 'from-yellow-500 to-yellow-700', 'Delicious food vocabulary gems'),
('Business', 'Professional Diamond Mines', '💼', 'from-red-500 to-red-700', 'Business vocabulary treasures'),
('Culture', 'Cultural Gem Gardens', '🎭', 'from-purple-500 to-purple-700', 'Cultural vocabulary gems'),
('Education', 'Academic Crystal Chambers', '📚', 'from-indigo-500 to-indigo-700', 'Educational vocabulary gems'),
('Technology', 'Tech Gem Laboratories', '💻', 'from-cyan-500 to-cyan-700', 'Technology vocabulary gems'),
('Health', 'Medical Crystal Clinics', '🏥', 'from-pink-500 to-pink-700', 'Health vocabulary gems'),
('Sports', 'Athletic Gem Arenas', '⚽', 'from-orange-500 to-orange-700', 'Sports vocabulary gems'),
('Nature', 'Natural Gem Forests', '🌿', 'from-emerald-500 to-emerald-700', 'Nature vocabulary gems');
```

## 🎮 Component Integration

### 1. **Replace Game Pages**

Update your existing game pages to use the new components:

```tsx
// src/app/games/gem-collector/page.tsx
import GameLauncher from '../../../components/games/GameLauncher';

export default function GemCollectorPage() {
  return (
    <GameLauncher
      mode="free_play"
      onGameComplete={(results) => {
        console.log('Game completed:', results);
        // Handle game completion
      }}
      onExit={() => {
        window.location.href = '/games';
      }}
    />
  );
}
```

### 2. **Assignment Integration**

Update your assignment creation flow:

```tsx
// src/app/dashboard/assignments/create/page.tsx
import EnhancedAssignmentCreator from '../../../../components/assignments/EnhancedAssignmentCreator';

export default function CreateAssignmentPage({ params }: { params: { classId: string } }) {
  return (
    <EnhancedAssignmentCreator
      classId={params.classId}
      onAssignmentCreated={(assignmentId) => {
        window.location.href = `/dashboard/assignments/${assignmentId}`;
      }}
      onCancel={() => {
        window.location.href = '/dashboard/assignments';
      }}
    />
  );
}
```

### 3. **Assignment Game Launch**

For assignment-based games:

```tsx
// src/app/assignments/[id]/play/page.tsx
import GameLauncher from '../../../../components/games/GameLauncher';

export default function PlayAssignmentPage({ params }: { params: { id: string } }) {
  return (
    <GameLauncher
      mode="assignment"
      assignmentId={params.id}
      onGameComplete={(results) => {
        // Redirect to assignment results
        window.location.href = `/assignments/${params.id}/results`;
      }}
      onExit={() => {
        window.location.href = `/assignments/${params.id}`;
      }}
    />
  );
}
```

## 🎨 Theme Implementation

### 1. **Update Existing Components**

Replace library/office theme elements with gem theme:

```tsx
// Before (Library Theme)
<div className="bg-brown-100 border-brown-300">
  <BookOpen className="h-6 w-6 text-brown-600" />
  <span>Study in the Library</span>
</div>

// After (Gem Theme)
import { GemCard, GemIcon } from '../components/ui/GemTheme';

<GemCard
  title="Explore Gem Mines"
  icon={<Gem className="h-6 w-6 text-white" />}
  gemType="rare"
>
  <span>Discover vocabulary treasures</span>
</GemCard>
```

### 2. **Navigation Updates**

Update navigation to use gem terminology:

```tsx
// src/components/navigation/MainNav.tsx
const navItems = [
  { 
    name: 'Gem Mines', 
    href: '/games', 
    icon: <Gem className="h-5 w-5" />,
    description: 'Explore vocabulary adventures'
  },
  { 
    name: 'Treasure Vault', 
    href: '/vocabulary', 
    icon: <Diamond className="h-5 w-5" />,
    description: 'Your vocabulary collection'
  },
  { 
    name: 'Mining Missions', 
    href: '/assignments', 
    icon: <Target className="h-5 w-5" />,
    description: 'Complete learning quests'
  },
  { 
    name: 'Crystal Dashboard', 
    href: '/dashboard', 
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Track your progress'
  }
];
```

### 3. **Dashboard Theme Updates**

Update dashboard components:

```tsx
// src/components/dashboard/StudentDashboard.tsx
import { GemThemeProvider, GemCard, GemBadge, GemProgressBar } from '../ui/GemTheme';

export default function StudentDashboard() {
  return (
    <GemThemeProvider theme="crystal">
      <div className="space-y-6">
        {/* Progress Section */}
        <GemCard
          title="Your Mining Progress"
          icon={<Trophy className="h-6 w-6 text-white" />}
          gemType="epic"
        >
          <div className="space-y-4">
            <GemProgressBar
              value={currentXP}
              max={nextLevelXP}
              label="Experience Points"
              gemType="rare"
            />
            
            <div className="flex space-x-3">
              <GemBadge type="level" variant="primary">
                Level {currentLevel}
              </GemBadge>
              <GemBadge type="streak" variant="warning">
                {currentStreak} day streak
              </GemBadge>
              <GemBadge type="achievement" variant="success">
                {totalAchievements} achievements
              </GemBadge>
            </div>
          </div>
        </GemCard>

        {/* Recent Activities */}
        <GemCard
          title="Recent Gem Discoveries"
          icon={<Sparkles className="h-6 w-6 text-white" />}
        >
          {/* Activity list */}
        </GemCard>
      </div>
    </GemThemeProvider>
  );
}
```

## 🔗 API Integration

### 1. **Vocabulary API Updates**

Update your vocabulary API to support gem types:

```tsx
// src/app/api/vocabulary/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme');
  const gemTypes = searchParams.get('gemTypes')?.split(',') || [];
  const difficulty = searchParams.get('difficulty');

  let query = supabase
    .from('vocabulary')
    .select(`
      *,
      theme_gem_mapping!inner(gem_theme_name, gem_icon, gem_color)
    `);

  if (theme) {
    query = query.eq('theme', theme);
  }

  if (gemTypes.length > 0) {
    query = query.in('gem_type', gemTypes);
  }

  if (difficulty && difficulty !== 'all') {
    const difficultyRanges = {
      beginner: [80, 100],
      intermediate: [40, 80],
      advanced: [0, 40]
    };
    const range = difficultyRanges[difficulty];
    if (range) {
      query = query.gte('frequency_score', range[0]).lte('frequency_score', range[1]);
    }
  }

  const { data, error } = await query;
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ vocabulary: data });
}
```

### 2. **Game Session API**

Create API for enhanced game sessions:

```tsx
// src/app/api/games/sessions/route.ts
import { EnhancedGameService } from '../../../../services/enhancedGameService';

export async function POST(request: Request) {
  const gameService = new EnhancedGameService();
  const sessionData = await request.json();
  
  try {
    const sessionId = await gameService.startGameSession(sessionData);
    return Response.json({ sessionId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const gameService = new EnhancedGameService();
  const { sessionId, ...updateData } = await request.json();
  
  try {
    await gameService.updateGameSession(sessionId, updateData);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## 🎯 Assignment Workflow

### 1. **Teacher Assignment Creation**

Complete workflow for teachers:

```tsx
// Teacher creates assignment
const assignment = await assignmentService.createEnhancedAssignment(teacherId, {
  title: "Spanish Food Vocabulary Adventure",
  description: "Explore the culinary gem caves and discover food vocabulary",
  game_type: "gem_collector",
  class_id: classId,
  vocabulary_list_id: vocabularyListId,
  config: {
    theme: "food",
    difficulty: "intermediate",
    gemTypes: ["common", "uncommon", "rare"],
    powerUpsEnabled: true,
    hintsAllowed: true,
    maxAttempts: 3,
    timeLimit: 15
  },
  points: 100,
  due_date: new Date('2024-07-01')
});
```

### 2. **Student Assignment Access**

Students access assignments through the game launcher:

```tsx
// Student clicks on assignment
<GameLauncher
  mode="assignment"
  assignmentId={assignmentId}
  onGameComplete={(results) => {
    // Show results and update progress
    showAssignmentResults(results);
  }}
/>
```

## 📱 Mobile Optimization

### 1. **Responsive Gem Theme**

Ensure gem components work on mobile:

```tsx
// Mobile-optimized gem cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {gems.map(gem => (
    <GemCard
      key={gem.id}
      className="min-h-[120px] sm:min-h-[150px]"
      onClick={() => selectGem(gem)}
    >
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <GemIcon type={gem.type} size="lg" />
        <div className="text-center sm:text-left">
          <div className="font-bold">{gem.spanish}</div>
          <div className="text-sm text-gray-600">{gem.english}</div>
        </div>
      </div>
    </GemCard>
  ))}
</div>
```

## 🚀 Deployment Steps

### 1. **Database Migration**
```bash
# Run the enhanced schema migration
supabase db push

# Update vocabulary with gem types
psql -f vocabulary_gem_update.sql
```

### 2. **Component Updates**
```bash
# Update imports throughout the codebase
find src -name "*.tsx" -exec sed -i 's/LibraryCard/GemCard/g' {} \;
find src -name "*.tsx" -exec sed -i 's/StudyButton/GemButton/g' {} \;
```

### 3. **Theme Deployment**
```bash
# Update CSS variables for gem theme
# Update any hardcoded colors to use gem theme
# Test all components with new theme
```

## 🎉 Result

After integration, you'll have:

- **Unified gem/diamond theme** throughout the platform
- **Seamless vocabulary integration** with existing database
- **Enhanced assignment workflow** with vocabulary selection
- **Consistent UX** with mining/treasure hunting metaphors
- **Mobile-optimized** gem-themed components
- **Real-time analytics** integrated with vocabulary performance

The platform transforms from a traditional educational tool into an engaging gem mining adventure while maintaining all existing functionality and data.
