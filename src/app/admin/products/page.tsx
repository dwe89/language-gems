'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser, useAuth } from '../../../components/auth/AuthProvider';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, FileText, Package } from 'lucide-react';
import AdminModal from '../../../components/ui/AdminModal';

interface EditProductData {
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  stripe_price_id: string;
  tags: string;
  is_active: boolean;
}

interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  stripe_price_id: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminProductsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [editData, setEditData] = useState<EditProductData>({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    stripe_price_id: '',
    tags: '',
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabaseBrowser
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
      // Convert tags string to array for Supabase
      const tagsArray = editData.tags 
        ? editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const productData = {
        name: editData.name,
        slug: editData.slug,
        description: editData.description,
        price_cents: Number(editData.price_cents),
        stripe_price_id: editData.stripe_price_id || null,
        tags: tagsArray, // Send as array, not string
        is_active: editData.is_active,
      };

      console.log('Updating product with data:', productData);

      const { error } = await supabaseBrowser
        .from('products')
        .update(productData)
        .eq('id', editingProduct?.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Reset form and refresh
      resetForm();
      fetchProducts();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (product: ProductWithDetails) => {
    setEditingProduct(product);
    setEditData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price_cents: product.price_cents,
      stripe_price_id: product.stripe_price_id || '',
      tags: product.tags ? product.tags.join(',') : '',
      is_active: product.is_active,
    });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setEditData({
      name: '',
      slug: '',
      description: '',
      price_cents: 0,
      stripe_price_id: '',
      tags: '',
      is_active: true,
    });
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabaseBrowser
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const formatPrice = (pricePence: number) => {
    return `£${(pricePence / 100).toFixed(2)}`;
  };

  // Show loading state while checking authentication or fetching data
  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (layout will handle it)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Product Management</h1>
          <p className="text-slate-600 mt-2">Manage your digital products and files</p>
        </div>
        {/* Removed Add Product button */}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Price</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Created</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No products found</p>
                    <a 
                      href="/admin/new"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Create your first product
                    </a>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="font-medium text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {formatPrice(product.price_cents)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-700 p-1"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editingProduct}
        onClose={resetForm}
        title="Edit Product"
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={editData.slug}
                onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (£)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={(editData.price_cents / 100).toFixed(2)}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  price_cents: Math.round(parseFloat(e.target.value) * 100) 
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stripe Price ID (optional)
              </label>
              <input
                type="text"
                value={editData.stripe_price_id}
                onChange={(e) => setEditData({ ...editData, stripe_price_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="price_1234..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="gcse, spanish, grammar"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={editData.is_active}
              onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700">
              Product is active and visible to customers
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
} 