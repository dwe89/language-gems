import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { learnerProgressService } from '../../../../services/LearnerProgressService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get query param for what data to fetch
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') || 'all';

        let response: any = {};

        switch (type) {
            case 'stats':
                response.stats = await learnerProgressService.getLearnerStats(user.id);
                break;

            case 'activity':
                const limit = parseInt(searchParams.get('limit') || '10');
                response.activity = await learnerProgressService.getRecentActivity(user.id, limit);
                break;

            case 'challenges':
                response.challenges = await learnerProgressService.getDailyChallenges(user.id);
                break;

            case 'achievements':
                response.achievements = await learnerProgressService.getAchievements(user.id);
                break;

            case 'languages':
                response.languages = await learnerProgressService.getStatsByLanguage(user.id);
                break;

            case 'all':
            default:
                // Fetch all data in parallel for the dashboard
                const [stats, activity, challenges, achievements, languages] = await Promise.all([
                    learnerProgressService.getLearnerStats(user.id),
                    learnerProgressService.getRecentActivity(user.id, 10),
                    learnerProgressService.getDailyChallenges(user.id),
                    learnerProgressService.getAchievements(user.id),
                    learnerProgressService.getStatsByLanguage(user.id)
                ]);

                response = {
                    stats,
                    activity,
                    challenges,
                    achievements,
                    languages
                };
                break;
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching learner progress:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
