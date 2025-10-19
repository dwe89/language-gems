"use client";

import { ReactNode } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useEditablePage } from '@/hooks/useEditablePage';
import { isAdmin } from '@/lib/adminCheck';
import PageEditButton from './PageEditButton';

interface EditablePageWrapperProps {
  pageSlug: string;
  children: (pageData: any, isLoading: boolean) => ReactNode;
  fallbackContent?: ReactNode;
}

/**
 * Wrapper component that provides editable page functionality
 * 
 * Usage:
 * <EditablePageWrapper pageSlug="homepage">
 *   {(pageData, isLoading) => (
 *     <div>
 *       <h1>{pageData?.hero?.headline || "Default Headline"}</h1>
 *       ...
 *     </div>
 *   )}
 * </EditablePageWrapper>
 */
export default function EditablePageWrapper({
  pageSlug,
  children,
  fallbackContent
}: EditablePageWrapperProps) {
  const { user } = useAuth();
  const { pageData, isLoading, reload } = useEditablePage(pageSlug);
  const userIsAdmin = isAdmin(user?.email);

  // Show loading state
  if (isLoading && !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if no data and fallback provided
  if (!pageData && fallbackContent) {
    return <>{fallbackContent}</>;
  }

  return (
    <>
      {children(pageData, isLoading)}
      {userIsAdmin && <PageEditButton pageSlug={pageSlug} onSave={reload} />}
    </>
  );
}

