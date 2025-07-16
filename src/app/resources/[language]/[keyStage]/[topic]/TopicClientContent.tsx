'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../../../contexts/CartContext';
import { CartSidebar } from '../../../../../components/cart/CartSidebar';

export default function TopicClientContent({ language, keyStage, topic, topicConfig }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, toggleCart, getTotalItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/resources/curriculum?language=${language}&keyStage=${keyStage}&topicSlug=${topic}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [language, keyStage, topic]);

  return (
    <>
      <CartSidebar />
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={toggleCart}
          className="relative p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ShoppingCart className="h-6 w-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 ml-4">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center mb-8">
          <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Products Found</h3>
          <p className="text-slate-600 mb-6">
            There are no products available for this topic yet.
          </p>
          <p className="text-sm text-slate-500">
            Products can be added through the admin dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col justify-between">
              <Link href={`/product/${product.slug}`} className="block">
                {product.thumbnail_url ? (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-indigo-50 flex items-center justify-center text-6xl">
                    📚
                  </div>
                )}
              </Link>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <Link href={`/product/${product.slug}`} className="block">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3 text-sm">
                    {product.description}
                  </p>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(product.tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {product.tags && product.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                      +{product.tags.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-2xl font-bold text-indigo-600">
                    £{(product.price_cents / 100).toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
} 