'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Gamepad2, BarChart3, User, Users, ClipboardList } from 'lucide-react';
import { useCapacitor } from './CapacitorProvider';
import { useAuth, supabaseBrowser } from '../auth/AuthProvider';

interface NavItem {
    icon: typeof Home;
    label: string;
    href: string;
    matchPaths: string[];
}

// Student-focused navigation
const studentNavItems: NavItem[] = [
    {
        icon: Home,
        label: 'Home',
        href: '/mobile-home',
        matchPaths: ['/mobile-home', '/learner-dashboard', '/student-dashboard'],
    },
    {
        icon: Gamepad2,
        label: 'Games',
        href: '/mobile-games',
        matchPaths: ['/mobile-games', '/activities', '/games', '/vocab-master'],
    },
    {
        icon: BarChart3,
        label: 'Progress',
        href: '/mobile-progress',
        matchPaths: ['/mobile-progress', '/learner-dashboard/progress', '/student-dashboard/vocabulary'],
    },
    {
        icon: ClipboardList,
        label: 'Tasks',
        href: '/mobile-assignments',
        matchPaths: ['/mobile-assignments', '/student-dashboard/assignments'],
    },
    {
        icon: User,
        label: 'Profile',
        href: '/mobile-profile',
        matchPaths: ['/mobile-profile', '/account'],
    },
];

// Teacher-focused navigation
const teacherNavItems: NavItem[] = [
    {
        icon: Home,
        label: 'Home',
        href: '/mobile-teacher-home',
        matchPaths: ['/mobile-teacher-home', '/dashboard'],
    },
    {
        icon: Users,
        label: 'Classes',
        href: '/mobile-classes',
        matchPaths: ['/mobile-classes', '/dashboard/classes'],
    },
    {
        icon: ClipboardList,
        label: 'Assign',
        href: '/mobile-teacher-assignments',
        matchPaths: ['/mobile-teacher-assignments', '/dashboard/assignments'],
    },
    {
        icon: BarChart3,
        label: 'Analytics',
        href: '/mobile-analytics',
        matchPaths: ['/mobile-analytics', '/dashboard/analytics'],
    },
    {
        icon: User,
        label: 'Profile',
        href: '/mobile-profile',
        matchPaths: ['/mobile-profile', '/account'],
    },
];

/**
 * Native-style bottom tab bar for mobile app
 * Shows for ALL users (guest or authenticated)
 * Teachers get different navigation once logged in
 * Only renders when running inside Capacitor
 */
export function MobileTabBar() {
    const { isNativeApp, isReady } = useCapacitor();
    const { user, isTeacher } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [taskCount, setTaskCount] = useState(0);

    // Fetch assignment count
    useEffect(() => {
        if (!user || isTeacher) return;

        const fetchCount = async () => {
            const supabase = supabaseBrowser;

            // 1. Get enrollments
            const { data: enrollments } = await supabase
                .from('class_enrollments')
                .select('class_id')
                .eq('student_id', user.id);

            if (!enrollments?.length) {
                setTaskCount(0);
                return;
            }
            const classIds = enrollments.map(e => e.class_id);

            // 2. Get active assignments IDs
            const today = new Date().toISOString();
            const { data: assignments } = await supabase
                .from('assignments')
                .select('id')
                .in('class_id', classIds)
                .gte('due_date', today);

            if (!assignments?.length) {
                setTaskCount(0);
                return;
            }

            const assignmentIds = assignments.map(a => a.id);

            // 3. Check progress for these assignments
            const { data: progress } = await supabase
                .from('enhanced_assignment_progress')
                .select('assignment_id, status')
                .in('assignment_id', assignmentIds)
                .eq('student_id', user.id);

            // 4. Count those NOT completed
            const completedIds = new Set(
                progress
                    ?.filter(p => p.status === 'completed')
                    .map(p => p.assignment_id) || []
            );

            const pendingCount = assignmentIds.filter(id => !completedIds.has(id)).length;
            setTaskCount(pendingCount);
        };

        fetchCount();

        // Refresh every 5 mins
        const interval = setInterval(fetchCount, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, isTeacher]);

    // Don't render on web or before detection completes
    if (!isReady || !isNativeApp) {
        return null;
    }

    // Don't show on auth pages
    if (pathname?.startsWith('/auth')) {
        return null;
    }

    // Select navigation items based on user role
    // Guests and students get the same student-focused navigation
    // Teachers get teacher navigation only if logged in
    const navItems = (user && isTeacher) ? teacherNavItems : studentNavItems;

    const isActive = (item: NavItem) => {
        return item.matchPaths.some(path => pathname?.startsWith(path));
    };

    const handleNavigation = (href: string) => {
        // Trigger haptic feedback on tap
        triggerHaptic('light');
        router.push(href);
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-white/10"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const active = isActive(item);
                    const Icon = item.icon;
                    // Check if this is the "Tasks" item
                    const isTasks = item.href === '/mobile-assignments';

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleNavigation(item.href)}
                            className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${active
                                ? 'text-purple-400'
                                : 'text-white/60 hover:text-white/80 active:text-white/90'
                                }`}
                        >
                            <div className="relative">
                                <Icon
                                    className={`w-6 h-6 mb-1 transition-transform duration-200 ${active ? 'scale-110' : ''
                                        }`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                {isTasks && taskCount > 0 && (
                                    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 overflow-hidden border-2 border-[#1a1a2e]">
                                        {taskCount > 9 ? '9+' : taskCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs font-medium ${active ? 'text-purple-400' : ''}`}>
                                {item.label}
                            </span>
                            {active && (
                                <div className="absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

/**
 * Trigger haptic feedback (vibration) on native platforms
 */
export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
    try {
        const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');

        switch (type) {
            case 'light':
                await Haptics.impact({ style: ImpactStyle.Light });
                break;
            case 'medium':
                await Haptics.impact({ style: ImpactStyle.Medium });
                break;
            case 'heavy':
                await Haptics.impact({ style: ImpactStyle.Heavy });
                break;
            case 'success':
                await Haptics.notification({ type: NotificationType.Success });
                break;
            case 'warning':
                await Haptics.notification({ type: NotificationType.Warning });
                break;
            case 'error':
                await Haptics.notification({ type: NotificationType.Error });
                break;
        }
    } catch {
        // Haptics not available (web or unsupported device)
    }
}
