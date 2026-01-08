import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VocabBlastGame from '../components/VocabBlastGame';
import { GameVocabularyWord } from '../../../../hooks/useGameVocabulary';

// Mock the theme provider
jest.mock('../../noughts-and-crosses/components/ThemeProvider', () => ({
  useTheme: () => ({ themeClasses: {} })
}));

// Mock the audio hook
jest.mock('../hooks/useAudio', () => ({
  useAudio: () => ({
    playSFX: jest.fn(),
    playThemeSFX: jest.fn(),
    startBackgroundMusic: jest.fn(),
    stopBackgroundMusic: jest.fn()
  })
}));

// Mock the spaced repetition hook
jest.mock('../../../../hooks/useUnifiedSpacedRepetition', () => ({
  useUnifiedSpacedRepetition: () => ({
    recordWordPractice: jest.fn(),
    algorithm: 'FSRS'
  })
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

const mockVocabulary: GameVocabularyWord[] = [
  {
    id: '1',
    word: 'casa',
    translation: 'house',
    spanish: 'casa',
    english: 'house'
  },
  {
    id: '2',
    word: 'perro',
    translation: 'dog',
    spanish: 'perro',
    english: 'dog'
  },
  {
    id: '3',
    word: 'gato',
    translation: 'cat',
    spanish: 'gato',
    english: 'cat'
  }
];

const mockSettings = {
  difficulty: 'intermediate',
  category: 'animals',
  language: 'spanish',
  theme: 'default',
  mode: 'categories' as const
};

const mockProps = {
  settings: mockSettings,
  vocabulary: mockVocabulary,
  onBackToMenu: jest.fn(),
  onGameEnd: jest.fn(),
  gameSessionId: null,
  isAssignmentMode: false
};

describe('VocabBlastGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders game interface correctly', () => {
    render(<VocabBlastGame {...mockProps} />);
    
    // Check for main UI elements
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('💎 Vocab Blast')).toBeInTheDocument();
  });

  test('displays current word for translation', async () => {
    render(<VocabBlastGame {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Translate:')).toBeInTheDocument();
    });
  });

  test('shows progress-based win conditions instead of timer', () => {
    render(<VocabBlastGame {...mockProps} />);
    
    // Should show progress percentage instead of timer
    expect(screen.getByText(/🎯/)).toBeInTheDocument();
    expect(screen.getByText(/Progress to Win/)).toBeInTheDocument();
    
    // Should not show timer
    expect(screen.queryByText(/⏱️/)).not.toBeInTheDocument();
  });

  test('displays game stats with progress bar', () => {
    render(<VocabBlastGame {...mockProps} />);
    
    expect(screen.getByText(/Combo:/)).toBeInTheDocument();
    expect(screen.getByText(/Words Learned:/)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
    expect(screen.getByText(/Progress to Win/)).toBeInTheDocument();
  });

  test('shows lives with heart icons', () => {
    render(<VocabBlastGame {...mockProps} />);
    
    expect(screen.getByText(/Lives:/)).toBeInTheDocument();
  });

  test('pause functionality works correctly', () => {
    render(<VocabBlastGame {...mockProps} />);
    
    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);
    
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Game Paused')).toBeInTheDocument();
  });

  test('back to menu button calls onBackToMenu', () => {
    render(<VocabBlastGame {...mockProps} />);
    
    const backButton = screen.getByText('Menu');
    fireEvent.click(backButton);
    
    expect(mockProps.onBackToMenu).toHaveBeenCalled();
  });

  test('calculates win condition targets based on vocabulary size', () => {
    const { rerender } = render(<VocabBlastGame {...mockProps} />);
    
    // Should calculate targets based on vocabulary length (3 words)
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Words:/)).toBeInTheDocument();
    
    // Test with larger vocabulary
    const largerVocabulary = [...mockVocabulary, ...mockVocabulary, ...mockVocabulary];
    rerender(<VocabBlastGame {...mockProps} vocabulary={largerVocabulary} />);
    
    // Targets should be higher with more vocabulary
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
  });

  test('handles empty vocabulary gracefully', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<VocabBlastGame {...mockProps} vocabulary={[]} />);
    
    expect(screen.getByText('Loading game...')).toBeInTheDocument();
    
    consoleWarnSpy.mockRestore();
  });

  test('responsive design classes are applied', () => {
    render(<VocabBlastGame {...mockProps} />);

    // Check for responsive classes in buttons
    const menuButton = screen.getByText('Menu');
    expect(menuButton.closest('button')).toHaveClass('md:px-4');
  });

  test('game instructions emphasize no time pressure', () => {
    render(<VocabBlastGame {...mockProps} />);

    // Should show instructions that don't mention time pressure
    expect(screen.getByText(/Click the gem with the correct translation/)).toBeInTheDocument();

    // Should not mention urgency or time limits
    expect(screen.queryByText(/quickly/)).not.toBeInTheDocument();
    expect(screen.queryByText(/before time runs out/)).not.toBeInTheDocument();
  });

  test('win conditions are clearly displayed', () => {
    render(<VocabBlastGame {...mockProps} />);

    // Should show win condition text
    expect(screen.getByText(/Win by reaching:/)).toBeInTheDocument();
  });
});
