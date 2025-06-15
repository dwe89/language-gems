'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  stripe_price_id: string;
  tags: string[];
  file_path: string;
  is_active: boolean;
  created_at: string;
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  stripe_price_id: string;
  tags: string;
  file_path: string;
  is_active: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    stripe_price_id: '',
    tags: '',
    file_path: '',
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price_cents: Number(formData.price_cents),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      if (editingId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
      }

      // Reset form and refresh
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price_cents: product.price_cents,
      stripe_price_id: product.stripe_price_id || '',
      tags: product.tags?.join(', ') || '',
      file_path: product.file_path || '',
      is_active: product.is_active,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price_cents: 0,
      stripe_price_id: '',
      tags: '',
      file_path: '',
      is_active: true,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const formatPrice = (priceCents: number) => {
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800">Product Management</h1>
        <p className="text-slate-600 mt-4">Manage your digital products here.</p>
      </div>
    </div>
  );
} 