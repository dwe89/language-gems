'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Download, Lock, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types/ecommerce';

interface ResourceCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isAuthenticated?: boolean;
}

export default function ResourceCard({ 
  product, 
  onAddToCart,
  isAuthenticated = false 
}: ResourceCardProps) {
  const formatPrice = (priceCents: number | null | undefined) => {
    if (priceCents === null || priceCents === undefined || isNaN(priceCents)) {
      return 'FREE';
    }
    if (priceCents === 0) return 'FREE';
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  const isFree = !product.price_cents || product.price_cents === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 group flex flex-col h-full">
      {/* Thumbnail */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="h-16 w-16 text-indigo-300" />
          )}
          
          {/* Price Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
            isFree 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-slate-900'
          }`}>
            {formatPrice(product.price_cents)}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/product/${product.slug}`} className="block mb-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
            {product.description}
          </p>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center text-sm"
          >
            View Details
          </Link>
          
          {!isFree && onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              title="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

