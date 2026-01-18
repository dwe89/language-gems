'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Gamepad2, BarChart3, User, Settings, LogOut } from 'lucide-react';
import { useCapacitor } from './CapacitorProvider';
import { useSafeArea } from './EnhancedSafeAreaWrapper';
import { triggerHaptic } from './usePlatformGestures';

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  matchPaths: string[];
  action?: () => void;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Home',
    href: '/mobile-home',
    matchPaths: ['/mobile-home', '/student-dashboard', '/dashboard'],
  },
  {
    icon: Gamepad2,
    label: 'Games',
    href: '/activities',
    matchPaths: ['/activities', '/vocab-master'],
  },
  {
    icon: BarChart3,
    label: 'Progress',
    href: '/student-dashboard/progress',
    matchPaths: ['/student-dashboard/progress', '/student-dashboard/vocabulary'],
  },
  {
    icon: User,
    label: 'Profile',
    href: '/student-dashboard/profile',
    matchPaths: ['/account', '/student-dashboard/profile', '/student-dashboard/settings'],
  },
];

export function PlatformTabBar() {
  const { isNativeApp, isReady, platform } = useCapacitor();
  const pathname = usePathname();
  const router = useRouter();
  const { safeAreaPadding } = useSafeArea();

  if (!isReady || !isNativeApp) {
    return null;
  }

  if (pathname?.startsWith('/auth')) {
    return null;
  }

  const isActive = (item: NavItem) => {
    return item.matchPaths.some(path => pathname?.startsWith(path));
  };

  const handleNavigation = (href: string) => {
    triggerHaptic('light');
    router.push(href);
  };

  const iOS = platform === 'ios';
  const android = platform === 'android';

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        iOS
          ? 'bg-black/70 backdrop-blur-xl border-t border-white/10'
          : android
          ? 'bg-surface-elevated border-t border-white/10 shadow-xl'
          : 'bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-white/10'
      }`}
      style={safeAreaPadding}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                active
                  ? iOS
                    ? 'text-blue-500'
                    : android
                    ? 'text-indigo-600'
                    : 'text-purple-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {iOS ? (
                <>
                  <Icon
                    className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                      active ? 'scale-110' : ''
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-[10px] font-medium ${active ? 'text-blue-500' : ''}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute top-0 w-8 h-0.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
                  )}
                </>
              ) : android ? (
                <>
                  <div className={`relative ${active ? 'mb-0.5' : 'mb-1'}`}>
                    <Icon
                      className={`w-6 h-6 transition-transform duration-200 ${
                        active ? 'scale-110' : ''
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    {active && (
                      <div className="absolute inset-0 bg-indigo-600/10 rounded-xl" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? 'text-indigo-600 font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute bottom-0 w-12 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </>
              ) : (
                <>
                  <Icon
                    className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                      active ? 'scale-110' : ''
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-xs font-medium ${active ? 'text-purple-400' : ''}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface TopNavBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: React.ReactNode;
    onPress: () => void;
    ariaLabel?: string;
  };
  transparent?: boolean;
}

export function TopNavBar({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  transparent = false,
}: TopNavBarProps) {
  const { isNativeApp, isReady, platform } = useCapacitor();
  const { safeAreaPadding } = useSafeArea();

  if (!isReady || !isNativeApp) {
    return null;
  }

  const iOS = platform === 'ios';
  const android = platform === 'android';

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : iOS
          ? 'bg-black/70 backdrop-blur-xl border-b border-white/10'
          : android
          ? 'bg-surface-elevated shadow-lg'
          : 'bg-[#1a1a2e]/95 backdrop-blur-lg border-b border-white/10'
      }`}
      style={{
        paddingTop: safeAreaPadding.paddingTop,
        height: transparent
          ? `calc(${safeAreaPadding.paddingTop} + 44px)`
          : iOS
          ? `calc(${safeAreaPadding.paddingTop} + 44px)`
          : `calc(${safeAreaPadding.paddingTop} + 56px)`,
      }}
    >
      <div className="flex items-center justify-between px-4 h-12">
        {showBackButton && (
          <button
            onClick={() => {
              triggerHaptic('light');
              onBack?.();
            }}
            className={`p-2 rounded-lg transition-colors ${
              iOS
                ? 'text-blue-500 hover:bg-blue-500/10'
                : android
                ? 'text-indigo-600 hover:bg-indigo-600/10'
                : 'text-purple-400 hover:bg-purple-400/10'
            }`}
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {iOS ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              )}
            </svg>
          </button>
        )}

        <h1
          className={`flex-1 text-center font-semibold ${
            iOS
              ? 'text-base'
              : android
              ? 'text-lg'
              : 'text-base'
          } text-white`}
          style={{
            paddingLeft: showBackButton ? (iOS ? '0' : '1rem') : '0',
            paddingRight: rightAction ? (iOS ? '0' : '1rem') : '0',
          }}
        >
          {title}
        </h1>

        {rightAction && (
          <button
            onClick={() => {
              triggerHaptic('light');
              rightAction.onPress();
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={rightAction.ariaLabel || 'Action'}
          >
            {rightAction.icon}
          </button>
        )}
      </div>
    </div>
  );
}
