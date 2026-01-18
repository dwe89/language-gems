'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedVocabMasterWrapper from '../../activities/vocab-master/components/UnifiedVocabMasterWrapper';
import { MobilePageWrapper } from '../../../components/capacitor';
import { SupportedLanguage } from '../../../lib/mobile';

export default function MobileVocabMasterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse params
    const langParam = searchParams.get('lang') as SupportedLanguage;
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const tierParam = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const boardParam = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;

    // Map language to code expected by Wrapper (which expects full name 'spanish' but maybe 'es' too?
    // Wrapper line 101 says: 'es': 'spanish', so it accepts code?
    // Wrapper line 88 says: const lang = searchParams.lang;
    // Wrapper line 107 maps it.
    // So passing 'spanish' is fine if map handles it, or 'es'.
    // Wrapper map keys are codes. So if I pass 'spanish', it returns undefined?
    // "const fullLanguage = languageMap[lang] || lang;"
    // So if I pass 'spanish', it uses 'spanish'. Correct.

    const params = {
        lang: langParam || 'spanish',
        level: levelParam,
        cat: catParam,
        subcat: subParam,
        tier: tierParam,
        examBoard: boardParam
    };

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={false} safeAreaBottom={false}>
            <div className="h-screen w-full">
                <UnifiedVocabMasterWrapper
                    searchParams={params}
                />
            </div>
        </MobilePageWrapper>
    );
}
