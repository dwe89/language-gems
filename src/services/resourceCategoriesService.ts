import { supabase as defaultSupabase } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ResourceCategory {
  id: string;
  slug: string;
  parent_id: string | null;
  language: 'spanish' | 'french' | 'german' | 'all' | null;
  key_stage: 'ks3' | 'ks4' | 'all' | null;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_published: boolean;
  show_in_nav: boolean;
  page_content: any;
  created_at: string;
  updated_at: string;
}

export class ResourceCategoriesService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || defaultSupabase;
  }

  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string): Promise<ResourceCategory | null> {
    try {
      const { data, error } = await this.supabase
        .from('resource_categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in getCategoryBySlug:', err);
      return null;
    }
  }

  /**
   * Get all top-level categories (languages)
   */
  async getTopLevelCategories(): Promise<ResourceCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from('resource_categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching top-level categories:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getTopLevelCategories:', err);
      return [];
    }
  }

  /**
   * Get child categories of a parent
   */
  async getChildCategories(parentId: string): Promise<ResourceCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from('resource_categories')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching child categories:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getChildCategories:', err);
      return [];
    }
  }

  /**
   * Get category hierarchy (category with its children)
   */
  async getCategoryHierarchy(slug: string): Promise<{
    category: ResourceCategory | null;
    children: ResourceCategory[];
    parent: ResourceCategory | null;
  }> {
    try {
      const category = await this.getCategoryBySlug(slug);
      
      if (!category) {
        return { category: null, children: [], parent: null };
      }

      const children = await this.getChildCategories(category.id);
      
      let parent: ResourceCategory | null = null;
      if (category.parent_id) {
        const { data } = await this.supabase
          .from('resource_categories')
          .select('*')
          .eq('id', category.parent_id)
          .single();
        parent = data;
      }

      return { category, children, parent };
    } catch (err) {
      console.error('Error in getCategoryHierarchy:', err);
      return { category: null, children: [], parent: null };
    }
  }

  /**
   * Update a category
   */
  async updateCategory(
    slug: string,
    updates: Partial<ResourceCategory>
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resource_categories')
        .update(updates)
        .eq('slug', slug);

      if (error) {
        console.error('Error updating category:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in updateCategory:', err);
      return false;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(category: Omit<ResourceCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ResourceCategory | null> {
    try {
      const { data, error } = await this.supabase
        .from('resource_categories')
        .insert(category)
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in createCategory:', err);
      return null;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(slug: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('resource_categories')
        .delete()
        .eq('slug', slug);

      if (error) {
        console.error('Error deleting category:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in deleteCategory:', err);
      return false;
    }
  }

  /**
   * Get products for a category
   */
  async getCategoryProducts(categoryId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching category products:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getCategoryProducts:', err);
      return [];
    }
  }

  /**
   * Get breadcrumb trail for a category
   */
  async getBreadcrumbs(slug: string): Promise<Array<{ slug: string; title: string }>> {
    try {
      const breadcrumbs: Array<{ slug: string; title: string }> = [];
      let currentSlug: string | null = slug;

      while (currentSlug) {
        const category = await this.getCategoryBySlug(currentSlug);
        if (!category) break;

        breadcrumbs.unshift({ slug: category.slug, title: category.title });

        if (category.parent_id) {
          const { data: parent } = await this.supabase
            .from('resource_categories')
            .select('slug')
            .eq('id', category.parent_id)
            .single();
          
          currentSlug = parent?.slug || null;
        } else {
          currentSlug = null;
        }
      }

      return breadcrumbs;
    } catch (err) {
      console.error('Error in getBreadcrumbs:', err);
      return [];
    }
  }
}

// Export singleton instance
export const resourceCategoriesService = new ResourceCategoriesService();

