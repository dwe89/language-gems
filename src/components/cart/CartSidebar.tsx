'use client';

import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { X, Plus, Minus, ShoppingBag, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CartSidebar() {
  const { state, updateQuantity, removeItem, toggleCart, getTotalPrice, getTotalItems } = useCart();
  const router = useRouter();

  const formatPrice = (priceCents: number | null | undefined) => {
    if (priceCents === null || priceCents === undefined || isNaN(priceCents)) {
      return 'FREE';
    }
    if (priceCents === 0) {
      return 'FREE';
    }
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  const handleCheckout = () => {
    router.push('/cart');
    toggleCart();
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Your Cart ({getTotalItems()})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Your cart is empty</h3>
              <p className="text-slate-500 mb-6">Discover our educational resources to get started</p>
              <button
                onClick={() => {
                  router.push('/shop');
                  toggleCart();
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800 mb-1 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {formatPrice(item.product.price_cents)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4 text-slate-500" />
                        </button>
                        <span className="px-3 py-1 bg-white rounded text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Plus className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total and Checkout */}
        {state.items.length > 0 && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-indigo-600">{formatPrice(getTotalPrice())}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={state.loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {state.loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  Proceed to Checkout
                  <ExternalLink className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                router.push('/shop');
                toggleCart();
              }}
              className="w-full py-2 px-4 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
} 