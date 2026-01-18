'use client';

import { useCallback } from 'react';
import { useCapacitor } from '../components/capacitor/CapacitorProvider';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Hook for triggering haptic feedback in games
 * 
 * Usage:
 * const { haptic } = useHaptics();
 * haptic('success'); // On correct answer
 * haptic('error');   // On wrong answer
 * haptic('light');   // On button tap
 */
export function useHaptics() {
    const { isNativeApp } = useCapacitor();

    const haptic = useCallback(async (type: HapticType = 'light') => {
        if (!isNativeApp) return;

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
                case 'selection':
                    await Haptics.selectionStart();
                    await Haptics.selectionEnd();
                    break;
            }
        } catch {
            // Haptics not available
        }
    }, [isNativeApp]);

    // Pre-defined haptic patterns for common game events
    const onCorrectAnswer = useCallback(() => haptic('success'), [haptic]);
    const onWrongAnswer = useCallback(() => haptic('error'), [haptic]);
    const onLevelComplete = useCallback(() => haptic('heavy'), [haptic]);
    const onButtonTap = useCallback(() => haptic('light'), [haptic]);
    const onSelection = useCallback(() => haptic('selection'), [haptic]);

    return {
        haptic,
        onCorrectAnswer,
        onWrongAnswer,
        onLevelComplete,
        onButtonTap,
        onSelection,
        isNativeApp,
    };
}
