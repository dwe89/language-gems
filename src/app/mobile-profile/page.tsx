'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User,
    Settings,
    Bell,
    Moon,
    Volume2,
    HelpCircle,
    FileText,
    LogOut,
    LogIn,
    ChevronRight,
    School,
    Shield,
    Crown,
    Sparkles,
    Star,
    Flame,
    Target
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { useCapacitor, MobilePageWrapper } from '../../components/capacitor';

export default function MobileProfilePage() {
    const { user, isTeacher, isStudent, isLearner, hasSubscription, signOut } = useAuth();
    const { platform } = useCapacitor();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    // Settings state
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);

    const isGuest = !user;

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await signOut();
            router.push('/mobile-home');
        } catch (error) {
            console.error('Logout error:', error);
            setLoggingOut(false);
        }
    };

    const getUserInitials = () => {
        const firstName = user?.user_metadata?.first_name || '';
        const lastName = user?.user_metadata?.last_name || '';
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || '?';
    };

    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            const { data } = await supabaseBrowser
                .from('user_profiles')
                .select('display_name')
                .eq('user_id', user.id)
                .single();

            if (data?.display_name) {
                setDisplayName(data.display_name);
            }
        };

        fetchProfile();
    }, [user]);

    const [teacherSchoolCode, setTeacherSchoolCode] = useState('');

    useEffect(() => {
        if (!user || !isTeacher) return;

        const fetchSchoolCode = async () => {
            // School code is stored in user_profiles
            const { data } = await supabaseBrowser
                .from('user_profiles')
                .select('school_code, school_initials')
                .eq('user_id', user.id)
                .single();

            if (data) {
                const code = data.school_code || data.school_initials;
                if (code) {
                    setTeacherSchoolCode(code);
                }
            }
        };

        fetchSchoolCode();
    }, [user, isTeacher]);

    const getUserName = () => {
        if (displayName) return displayName;

        // Try display_name from metadata
        if (user?.user_metadata?.display_name) {
            return user.user_metadata.display_name;
        }

        const firstName = user?.user_metadata?.first_name || '';
        const lastName = user?.user_metadata?.last_name || '';
        if (firstName || lastName) {
            return `${firstName} ${lastName}`.trim();
        }

        // Final fallback to email username if no name set
        return user?.email?.split('@')[0] || 'Student';
    };

    const getRoleBadge = () => {
        if (isTeacher) return { label: 'Teacher', color: 'bg-blue-500', icon: School };
        if (isStudent) return { label: 'Student', color: 'bg-green-500', icon: User };
        if (isLearner) return { label: 'Learner', color: 'bg-purple-500', icon: Star };
        return { label: 'User', color: 'bg-gray-500', icon: User };
    };

    const role = getRoleBadge();

    const settingsItems = [
        {
            icon: Bell,
            label: 'Notifications',
            value: notifications,
            onChange: setNotifications,
        },
        {
            icon: Moon,
            label: 'Dark Mode',
            value: darkMode,
            onChange: setDarkMode,
        },
        {
            icon: Volume2,
            label: 'Sound Effects',
            value: soundEffects,
            onChange: setSoundEffects,
        },
    ];

    const menuItems = [
        { icon: Settings, label: 'Account Settings', href: '/account/settings' },
        { icon: HelpCircle, label: 'Help & Support', href: '/contact' },
        { icon: FileText, label: 'Terms of Service', href: '/terms' },
        { icon: Shield, label: 'Privacy Policy', href: '/privacy' },
    ];

    // Load guest stats
    const [localStats, setLocalStats] = useState({ streak: 0, xp: 0, accuracy: 0 });

    useEffect(() => {
        if (isGuest) {
            import('../../lib/mobile').then(({ getProgressStats }) => {
                const stats = getProgressStats();
                setLocalStats({
                    streak: stats.streak,
                    xp: stats.totalXP,
                    accuracy: stats.accuracy
                });
            });
        }
    }, [isGuest]);

    // Stats for guests
    const guestStats = [
        { icon: Flame, label: 'Streak', value: localStats.streak.toString(), color: 'text-orange-400' },
        { icon: Star, label: 'XP', value: localStats.xp.toString(), color: 'text-yellow-400' },
        { icon: Target, label: 'Accuracy', value: `${localStats.accuracy}%`, color: 'text-emerald-400' },
    ];

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a]">
                {/* Ambient background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 px-5 pt-4 pb-32">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 className="text-2xl font-bold text-white">Profile</h1>
                    </motion.div>

                    {/* Guest Card */}
                    {isGuest ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            {/* Guest welcome */}
                            <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-3xl p-6 border border-purple-500/20 backdrop-blur-sm mb-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-2 border-white/10 flex items-center justify-center mb-4">
                                        <Sparkles className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">You're Playing as Guest</h2>
                                    <p className="text-white/60 text-sm mb-4">
                                        Sign in to save your progress and compete with friends
                                    </p>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => router.push('/auth/login')}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Sign In / Create Account
                                    </motion.button>
                                </div>
                            </div>

                            {/* What you'll get */}
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Sign in to track</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {guestStats.map((stat, i) => (
                                        <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-white/5">
                                            <stat.icon className={`w-5 h-5 ${stat.color} mb-1 opacity-50`} />
                                            <span className="text-lg font-bold text-white/30">{stat.value}</span>
                                            <span className="text-[10px] text-white/30">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Authenticated User Card */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#24243e] to-[#2a2a4a] rounded-3xl p-6 mb-6 border border-white/5"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold border-2 border-white/20 shadow-lg shadow-purple-500/20">
                                    {getUserInitials()}
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h2 className="text-xl font-bold text-white">{getUserName()}</h2>
                                        {isTeacher && hasSubscription && (
                                            <Crown className="w-5 h-5 text-yellow-400" />
                                        )}
                                    </div>
                                    {/* Email removed as requested */}
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${role.color} text-white`}>
                                        <role.icon className="w-3 h-3" />
                                        {role.label}
                                    </span>
                                </div>
                            </div>

                            {/* Teacher School Info */}
                            {isTeacher && (
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center space-x-3">
                                    <School className="w-5 h-5 text-white/50" />
                                    <div>
                                        <p className="text-xs text-white/40">School Code</p>
                                        <p className="font-medium text-white">{teacherSchoolCode || 'Not set'}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Quick Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden mb-6 border border-white/5"
                    >
                        <h3 className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Settings</h3>
                        {settingsItems.map((item, index) => (
                            <div
                                key={item.label}
                                className={`flex items-center justify-between px-4 py-3.5 ${index !== settingsItems.length - 1 ? 'border-b border-white/5' : ''
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-white/60" />
                                    </div>
                                    <span className="font-medium text-white/90">{item.label}</span>
                                </div>
                                <button
                                    onClick={() => item.onChange(!item.value)}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${item.value ? 'bg-purple-500' : 'bg-white/20'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${item.value ? 'translate-x-5' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </motion.div>

                    {/* Menu Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden mb-6 border border-white/5"
                    >
                        <h3 className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">More</h3>
                        {menuItems.map((item, index) => (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 active:bg-white/10 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-white/60" />
                                    </div>
                                    <span className="font-medium text-white/90">{item.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/30" />
                            </button>
                        ))}
                    </motion.div>

                    {/* Sign Out / Sign In Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        {isGuest ? (
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="w-full flex items-center justify-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 active:bg-purple-500/40 text-purple-400 font-medium py-4 rounded-2xl transition-colors"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>Sign In to Save Progress</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 font-medium py-4 rounded-2xl transition-colors disabled:opacity-50"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>{loggingOut ? 'Logging out...' : 'Log Out'}</span>
                            </button>
                        )}
                    </motion.div>

                    {/* App Version */}
                    <div className="text-center text-white/20 text-xs">
                        <p>Language Gems v1.0.0</p>
                        <p className="mt-0.5 capitalize">{platform}</p>
                    </div>
                </div>
            </div>
        </MobilePageWrapper>
    );
}
