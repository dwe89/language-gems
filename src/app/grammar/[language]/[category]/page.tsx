import { redirect } from 'next/navigation';

interface PageProps {
    params: {
        language: string;
        category: string;
    };
}

/**
 * Category-level grammar page
 * Redirects to the main language grammar page since categories don't have their own landing pages.
 * 
 * This fixes 404 errors for URLs like:
 * - /grammar/spanish/verbs
 * - /grammar/spanish/pronouns
 * - /grammar/german/cases
 */
export default function GrammarCategoryPage({ params }: PageProps) {
    // Redirect to the main grammar page for this language with the category as a hash anchor
    redirect(`/grammar/${params.language}#${params.category}`);
}
