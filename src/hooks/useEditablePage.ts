import { useState, useEffect } from 'react';
import { editablePagesService, type EditablePage } from '@/services/editablePagesService';

export function useEditablePage(pageSlug: string) {
  const [page, setPage] = useState<EditablePage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [pageSlug]);

  const loadPage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pageData = await editablePagesService.getPageBySlug(pageSlug);
      
      if (!pageData) {
        setError('Page not found');
        setPage(null);
      } else {
        setPage(pageData);
      }
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Failed to load page');
      setPage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reload = () => {
    loadPage();
  };

  return {
    page,
    pageData: page?.page_data,
    metaData: page?.meta_data,
    isLoading,
    error,
    reload
  };
}

