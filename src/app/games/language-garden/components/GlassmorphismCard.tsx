import { motion, MotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

// Utility function for combining class names
const cn = (...classes: (string | undefined | null | false | string[])[]) => {
  return clsx(classes.flat().filter(Boolean));
};

interface GlassmorphismCardProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  glow?: boolean;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  'aria-label'?: string;
  role?: string;
}

const variants = {
  primary: 'bg-white/10 border-white/20 text-white',
  secondary: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-50',
  accent: 'bg-purple-500/10 border-purple-400/30 text-purple-50',
  success: 'bg-green-500/10 border-green-400/30 text-green-50',
  warning: 'bg-yellow-500/10 border-yellow-400/30 text-yellow-50',
  error: 'bg-red-500/10 border-red-400/30 text-red-50'
};

const sizes = {
  sm: 'p-3 rounded-lg',
  md: 'p-4 rounded-xl',
  lg: 'p-6 rounded-2xl',
  xl: 'p-8 rounded-3xl'
};

const blurLevels = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

const glowEffects = {
  primary: 'shadow-white/20',
  secondary: 'shadow-emerald-500/20',
  accent: 'shadow-purple-500/20',
  success: 'shadow-green-500/20',
  warning: 'shadow-yellow-500/20',
  error: 'shadow-red-500/20'
};

export const GlassmorphismCard = forwardRef<HTMLDivElement, GlassmorphismCardProps>(({
  children,
  className = '',
  variant = 'primary',
  glow = false,
  interactive = false,
  size = 'md',
  blur = 'xl',
  'aria-label': ariaLabel,
  role,
  ...motionProps
}, ref) => {
  const baseClasses = cn(
    'border shadow-2xl transition-all duration-300',
    blurLevels[blur],
    sizes[size],
    variants[variant],
    glow && glowEffects[variant],
    interactive && [
      'cursor-pointer hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30',
      'transform-gpu will-change-transform'
    ],
    className
  );

  const hoverAnimation = interactive ? {
    scale: 1.02,
    boxShadow: glow ? '0 25px 50px -12px rgba(255, 255, 255, 0.15)' : '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
  } : {};

  const tapAnimation = interactive ? {
    scale: 0.98
  } : {};

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      aria-label={ariaLabel}
      role={role}
      tabIndex={interactive ? 0 : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
});

GlassmorphismCard.displayName = 'GlassmorphismCard';