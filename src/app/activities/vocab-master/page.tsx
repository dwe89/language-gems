import { redirect } from 'next/navigation';

/**
 * Legacy route redirect
 * VocabMaster has been elevated to a top-level feature at /vocab-master
 * This redirect ensures old links continue to work
 */
export default function OldVocabMasterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Preserve query parameters in redirect
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, Array.isArray(value) ? value[0] : value);
    }
  });

  const queryString = params.toString();
  const redirectUrl = queryString ? `/vocab-master?${queryString}` : '/vocab-master';

  redirect(redirectUrl);
}


