import { createServerSideClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  reading_time_minutes: number;
  publish_date: string;
}

export async function getRelatedPosts(
  currentPostId: string,
  currentTags: string[],
  limit: number = 3
): Promise<BlogPost[]> {
  const cookieStore = cookies();
  const supabase = createServerSideClient(cookieStore);

  try {
    // Fetch published posts excluding current post
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, tags, reading_time_minutes, publish_date')
      .eq('is_published', true)
      .eq('status', 'published')
      .neq('id', currentPostId)
      .order('publish_date', { ascending: false })
      .limit(20); // Get more to filter by tags

    if (error) throw error;

    if (!posts || posts.length === 0) {
      return [];
    }

    // Score posts by tag overlap
    const scoredPosts = posts.map(post => {
      const matchingTags = post.tags?.filter((tag: string) => 
        currentTags.includes(tag)
      ).length || 0;
      return { ...post, score: matchingTags };
    });

    // Sort by score (most matching tags first), then by date
    const sortedPosts = scoredPosts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
    });

    // Return top N posts
    return sortedPosts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

