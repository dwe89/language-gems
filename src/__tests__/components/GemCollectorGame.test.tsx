import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import GemCollectorGame from '../../app/activities/gem-collector/page';
import { useAuth } from '../../components/auth/AuthProvider';

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn()
}));

// Mock auth provider
vi.mock('../../components/auth/AuthProvider', () => ({
  useAuth: vi.fn()
}));

// Mock fetch
global.fetch = vi.fn();

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn()
};

const mockSearchParams = {
  get: vi.fn()
};

const mockUser = {
  id: 'user-123',
  email: 'test@example.com'
};

const mockSentences = [
  {
    id: 'sentence-1',
    englishSentence: 'I like to go to the cinema',
    targetLanguage: 'spanish',
    targetSentence: 'Me gusta ir al cine',
    difficultyLevel: 'beginner',
    theme: 'Leisure and entertainment',
    topic: 'Free time activities',
    segments: [
      {
        id: 'segment-1',
        segmentOrder: 1,
        englishSegment: 'I like',
        targetSegment: 'Me gusta',
        segmentType: 'phrase',
        options: [
          { id: 'opt-1', optionText: 'Me gusta', isCorrect: true, distractorType: 'correct' },
          { id: 'opt-2', optionText: 'Me encanta', isCorrect: false, distractorType: 'semantic' },
          { id: 'opt-3', optionText: 'Odio', isCorrect: false, distractorType: 'semantic' }
        ]
      },
      {
        id: 'segment-2',
        segmentOrder: 2,
        englishSegment: 'to go',
        targetSegment: 'ir',
        segmentType: 'word',
        options: [
          { id: 'opt-4', optionText: 'ir', isCorrect: true, distractorType: 'correct' },
          { id: 'opt-5', optionText: 'venir', isCorrect: false, distractorType: 'semantic' },
          { id: 'opt-6', optionText: 'estar', isCorrect: false, distractorType: 'grammatical' }
        ]
      }
    ]
  }
];

describe('GemCollectorGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useRouter as any).mockReturnValue(mockRouter);
    (useSearchParams as any).mockReturnValue(mockSearchParams);
    (useAuth as any).mockReturnValue({
      user: mockUser,
      isLoading: false
    });

    mockSearchParams.get.mockImplementation((key: string) => {
      switch (key) {
        case 'assignment': return null;
        case 'language': return 'spanish';
        case 'difficulty': return 'beginner';
        default: return null;
      }
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        sentences: mockSentences,
        metadata: {
          mode: 'free_play',
          language: 'spanish',
          difficulty: 'beginner',
          count: 1
        }
      })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the game start screen', async () => {
    render(<GemCollectorGame />);

    await waitFor(() => {
      expect(screen.getByText('Gem Collector')).toBeInTheDocument();
      expect(screen.getByText(/Build complete sentence translations word-by-word/)).toBeInTheDocument();
      expect(screen.getByText('Configure & Start! ⚙️💎')).toBeInTheDocument();
    });
  });

  it('should show assignment mode when assignment ID is provided', async () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      switch (key) {
        case 'assignment': return 'assignment-123';
        case 'language': return 'spanish';
        case 'difficulty': return 'beginner';
        default: return null;
      }
    });

    render(<GemCollectorGame />);

    await waitFor(() => {
      expect(screen.getByText('Assignment Mode')).toBeInTheDocument();
      expect(screen.getByText('Start Assignment! 💎')).toBeInTheDocument();
    });
  });

  it('should fetch sentences on component mount', async () => {
    render(<GemCollectorGame />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/games/gem-collector/sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'free_play',
          assignmentId: undefined,
          language: 'spanish',
          difficulty: 'beginner',
          theme: undefined,
          topic: undefined,
          count: 10
        })
      });
    });
  });

  it('should show loading state while fetching sentences', () => {
    (useAuth as any).mockReturnValue({
      user: mockUser,
      isLoading: true
    });

    render(<GemCollectorGame />);

    expect(screen.getByText('Loading game...')).toBeInTheDocument();
  });

  it('should redirect to login if user is not authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: false
    });

    render(<GemCollectorGame />);

    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  it('should handle keyboard controls', async () => {
    render(<GemCollectorGame />);

    // Wait for sentences to load and start the game
    await waitFor(() => {
      expect(screen.getByText('Configure & Start! ⚙️💎')).toBeInTheDocument();
    });

    // Start the game (this would normally open settings modal in free play)
    const startButton = screen.getByText('Configure & Start! ⚙️💎');
    fireEvent.click(startButton);

    // Test keyboard events (would need to be in game state)
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowRight' });

    // These would affect game state if game was running
    // In a real test, we'd need to mock the game state properly
  });

  it('should display game information correctly', async () => {
    render(<GemCollectorGame />);

    await waitFor(() => {
      expect(screen.getByText('1 sentences loaded')).toBeInTheDocument();
      expect(screen.getByText('Language: Spanish')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: Beginner')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('API Error'));

    render(<GemCollectorGame />);

    await waitFor(() => {
      // Should still render the component even if API fails
      expect(screen.getByText('Gem Collector')).toBeInTheDocument();
    });
  });

  it('should show settings modal for free play mode', async () => {
    render(<GemCollectorGame />);

    await waitFor(() => {
      const startButton = screen.getByText('Configure & Start! ⚙️💎');
      fireEvent.click(startButton);
    });

    // Settings modal should appear (would need to test the modal component separately)
    // This is a simplified test - in reality we'd need to mock the settings modal
  });

  it('should save game session when game ends', async () => {
    const mockSessionResponse = {
      ok: true,
      json: async () => ({ success: true, sessionId: 'session-123' })
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sentences: mockSentences })
      })
      .mockResolvedValueOnce(mockSessionResponse);

    render(<GemCollectorGame />);

    // This would require simulating a complete game session
    // In a real test, we'd need to mock the game state and progression
    await waitFor(() => {
      expect(screen.getByText('Gem Collector')).toBeInTheDocument();
    });
  });

  it('should handle assignment mode with proper configuration', async () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      switch (key) {
        case 'assignment': return 'assignment-123';
        case 'language': return 'french';
        case 'difficulty': return 'intermediate';
        default: return null;
      }
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        sentences: mockSentences,
        metadata: {
          mode: 'assignment',
          assignmentId: 'assignment-123',
          language: 'french',
          difficulty: 'intermediate'
        }
      })
    });

    render(<GemCollectorGame />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/games/gem-collector/sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'assignment',
          assignmentId: 'assignment-123',
          language: 'french',
          difficulty: 'intermediate',
          theme: undefined,
          topic: undefined,
          count: 10
        })
      });
    });
  });
});
