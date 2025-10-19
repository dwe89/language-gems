import { supabase as defaultSupabase } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface EditablePage {
  id: string;
  page_slug: string;
  page_title: string;
  page_description?: string;
  page_data: any; // JSONB data
  meta_data?: any; // SEO metadata
  is_published: boolean;
  version: number;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PageVersion {
  id: string;
  page_id: string;
  version: number;
  page_data: any;
  meta_data?: any;
  changed_by?: string;
  change_description?: string;
  created_at: string;
}

export class EditablePagesService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || defaultSupabase;
  }

  /**
   * Get a page by slug
   */
  async getPageBySlug(slug: string): Promise<EditablePage | null> {
    try {
      const { data, error} = await this.supabase
        .from('editable_pages')
        .select('*')
        .eq('page_slug', slug)
        .single();

      if (error) {
        console.error('Error fetching page:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in getPageBySlug:', err);
      return null;
    }
  }

  /**
   * Get all pages (admin only)
   */
  async getAllPages(): Promise<EditablePage[]> {
    try {
      const { data, error } = await this.supabase
        .from('editable_pages')
        .select('*')
        .order('page_slug', { ascending: true });

      if (error) {
        console.error('Error fetching pages:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getAllPages:', err);
      return [];
    }
  }

  /**
   * Update a page
   */
  async updatePage(
    slug: string,
    updates: {
      page_title?: string;
      page_description?: string;
      page_data?: any;
      meta_data?: any;
      is_published?: boolean;
      updated_by?: string;
    }
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('editable_pages')
        .update(updates)
        .eq('page_slug', slug);

      if (error) {
        console.error('Error updating page:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in updatePage:', err);
      return false;
    }
  }

  /**
   * Create a new page
   */
  async createPage(page: {
    page_slug: string;
    page_title: string;
    page_description?: string;
    page_data?: any;
    meta_data?: any;
    is_published?: boolean;
    created_by?: string;
  }): Promise<EditablePage | null> {
    try {
      const { data, error } = await this.supabase
        .from('editable_pages')
        .insert({
          ...page,
          page_data: page.page_data || {},
          meta_data: page.meta_data || {},
          is_published: page.is_published ?? true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating page:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in createPage:', err);
      return null;
    }
  }

  /**
   * Get version history for a page
   */
  async getPageHistory(pageId: string): Promise<PageVersion[]> {
    try {
      const { data, error } = await this.supabase
        .from('editable_pages_history')
        .select('*')
        .eq('page_id', pageId)
        .order('version', { ascending: false });

      if (error) {
        console.error('Error fetching page history:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getPageHistory:', err);
      return [];
    }
  }

  /**
   * Restore a page to a previous version
   */
  async restoreVersion(
    slug: string,
    versionId: string,
    userId?: string
  ): Promise<boolean> {
    try {
      // Get the version data
      const { data: versionData, error: versionError } = await this.supabase
        .from('editable_pages_history')
        .select('page_data, meta_data')
        .eq('id', versionId)
        .single();

      if (versionError || !versionData) {
        console.error('Error fetching version:', versionError);
        return false;
      }

      // Update the page with the version data
      const { error: updateError } = await this.supabase
        .from('editable_pages')
        .update({
          page_data: versionData.page_data,
          meta_data: versionData.meta_data,
          updated_by: userId,
        })
        .eq('page_slug', slug);

      if (updateError) {
        console.error('Error restoring version:', updateError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in restoreVersion:', err);
      return false;
    }
  }

  /**
   * Delete a page (admin only)
   */
  async deletePage(slug: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('editable_pages')
        .delete()
        .eq('page_slug', slug);

      if (error) {
        console.error('Error deleting page:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in deletePage:', err);
      return false;
    }
  }

  /**
   * Publish/unpublish a page
   */
  async togglePublish(slug: string, isPublished: boolean): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('editable_pages')
        .update({ is_published: isPublished })
        .eq('page_slug', slug);

      if (error) {
        console.error('Error toggling publish status:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in togglePublish:', err);
      return false;
    }
  }
}

// Export singleton instance
export const editablePagesService = new EditablePagesService();

