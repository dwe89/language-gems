'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCapacitor } from './CapacitorProvider';

interface Props {
    children: ReactNode;
}

const pageVariants = {
    ios: {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-30%', opacity: 0 },
    },
    android: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
    },
    web: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
};

const pageTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
};

export function PageTransition({ children }: Props) {
    const pathname = usePathname();
    const { isNativeApp, platform } = useCapacitor();

    if (!isNativeApp) {
        return <>{children}</>;
    }

    const variants = pageVariants[platform] || pageVariants.web;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                transition={pageTransition}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
