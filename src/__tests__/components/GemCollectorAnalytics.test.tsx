import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GemCollectorAnalytics from '../../components/analytics/GemCollectorAnalytics';

// Mock recharts components
vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />
}));

// Mock fetch
global.fetch = vi.fn();

const mockAnalyticsData = {
  sessions: [
    {
      id: 'session-1',
      student_id: 'user-1',
      final_score: 1200,
      correct_segments: 8,
      total_segments: 10,
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      id: 'session-2',
      student_id: 'user-2',
      final_score: 800,
      correct_segments: 6,
      total_segments: 10,
      created_at: '2024-01-01T11:00:00Z'
    }
  ],
  analytics: {
    totalSessions: 2,
    averageScore: 1000,
    averageAccuracy: 70,
    totalStudents: 2,
    completionRate: 100,
    averageTimeSpent: 8,
    totalSentencesCompleted: 15,
    totalSegmentsAttempted: 20,
    speedBoostUsage: 1.5
  },
  studentPerformance: [
    {
      studentId: 'user-1',
      studentName: 'John Doe',
      totalSessions: 1,
      averageScore: 1200,
      accuracy: 80,
      totalCorrectSegments: 8,
      totalSegments: 10
    },
    {
      studentId: 'user-2',
      studentName: 'Jane Smith',
      totalSessions: 1,
      averageScore: 800,
      accuracy: 60,
      totalCorrectSegments: 6,
      totalSegments: 10
    }
  ],
  difficultyBreakdown: {
    beginner: {
      totalSessions: 1,
      averageScore: 1200,
      averageAccuracy: 80
    },
    intermediate: {
      totalSessions: 1,
      averageScore: 800,
      averageAccuracy: 60
    }
  },
  topPerformers: [
    {
      studentId: 'user-1',
      studentName: 'John Doe',
      averageScore: 1200,
      accuracy: 80,
      totalSessions: 1
    }
  ]
};

describe('GemCollectorAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAnalyticsData
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render loading state initially', () => {
    render(<GemCollectorAnalytics />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should fetch and display analytics data', async () => {
    render(<GemCollectorAnalytics classId="class-123" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/gem-collector?classId=class-123');
    });

    await waitFor(() => {
      expect(screen.getByText('Total Students')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Average Score')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
    });
  });

  it('should display additional metrics correctly', async () => {
    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('Sentences Completed')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Speed Boost Usage')).toBeInTheDocument();
      expect(screen.getByText('1.5')).toBeInTheDocument();
    });
  });

  it('should render charts with correct data', async () => {
    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('Student Performance')).toBeInTheDocument();
      expect(screen.getByText('Performance by Difficulty')).toBeInTheDocument();
      expect(screen.getAllByTestId('bar-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
    });
  });

  it('should display top performers table', async () => {
    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('Top Performers')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('1200')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('API Error'));

    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load analytics')).toBeInTheDocument();
    });
  });

  it('should handle empty data state', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        sessions: [],
        analytics: {
          totalSessions: 0,
          averageScore: 0,
          averageAccuracy: 0,
          totalStudents: 0,
          completionRate: 0,
          averageTimeSpent: 0,
          totalSentencesCompleted: 0,
          totalSegmentsAttempted: 0,
          speedBoostUsage: 0
        },
        studentPerformance: [],
        difficultyBreakdown: {},
        topPerformers: []
      })
    });

    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  it('should include filters in API request', async () => {
    const dateRange = {
      from: '2024-01-01',
      to: '2024-01-31'
    };

    render(
      <GemCollectorAnalytics 
        classId="class-123" 
        assignmentId="assignment-456"
        dateRange={dateRange}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics/gem-collector?classId=class-123&assignmentId=assignment-456&dateFrom=2024-01-01&dateTo=2024-01-31'
      );
    });
  });

  it('should handle HTTP error responses', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Access denied' })
    });

    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch analytics')).toBeInTheDocument();
    });
  });

  it('should display correct metric icons', async () => {
    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      // Check for presence of metric cards with icons
      expect(screen.getByText('Total Students')).toBeInTheDocument();
      expect(screen.getByText('Average Score')).toBeInTheDocument();
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument();
      expect(screen.getByText('Avg. Time (min)')).toBeInTheDocument();
    });
  });

  it('should format time correctly', async () => {
    const customData = {
      ...mockAnalyticsData,
      analytics: {
        ...mockAnalyticsData.analytics,
        averageTimeSpent: 12
      }
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => customData
    });

    render(<GemCollectorAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  it('should handle assignment-specific analytics', async () => {
    render(<GemCollectorAnalytics assignmentId="assignment-123" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/gem-collector?assignmentId=assignment-123');
    });
  });
});
