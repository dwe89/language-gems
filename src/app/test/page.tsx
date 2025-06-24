'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';

export default function TestPage() {
  const { state, clearCart, clearServerCart } = useCart();
  const { user } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [serverCartData, setServerCartData] = useState<any[]>([]);

  useEffect(() => {
    // Get localStorage data
    const cartData = localStorage.getItem('language-gems-cart');
    setLocalStorageData(cartData || 'No cart data in localStorage');
    
    // Get server cart data if user is logged in
    if (user) {
      fetchServerCart();
    }
  }, [user]);

  const fetchServerCart = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabaseBrowser
        .from('user_carts')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching server cart:', error);
        setServerCartData([]);
      } else {
        setServerCartData(data || []);
      }
    } catch (error) {
      console.error('Error fetching server cart:', error);
      setServerCartData([]);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('language-gems-cart');
    setLocalStorageData('Cleared');
    window.location.reload();
  };

  const clearServerCartAndRefresh = async () => {
    await clearServerCart();
    await fetchServerCart();
  };

  const immediatePhantomFix = async () => {
    // Clear localStorage
    localStorage.removeItem('language-gems-cart');
    
    // Clear server cart if user is logged in
    if (user) {
      await clearServerCart();
    }
    
    // Force a page refresh to reset everything
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Cart Debug Tool</h1>
        
        {/* Current Cart State */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Cart State</h2>
          <div className="bg-slate-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(state.items, null, 2)}
            </pre>
          </div>
          <div className="mt-4">
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Current Cart
            </button>
          </div>
        </div>

        {/* LocalStorage Data */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Cart Data</h2>
          <div className="bg-slate-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {localStorageData}
            </pre>
          </div>
          <div className="mt-4">
            <button
              onClick={clearLocalStorage}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Clear LocalStorage Cart
            </button>
          </div>
        </div>

        {/* Server Cart Data */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Server Cart Data (User: {user.email})</h2>
            <div className="bg-slate-100 p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(serverCartData, null, 2)}
              </pre>
            </div>
            <div className="mt-4 space-x-4">
              <button
                onClick={clearServerCartAndRefresh}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Server Cart
              </button>
              <button
                onClick={fetchServerCart}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh Server Data
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Please log in to view and manage server cart data.</p>
          </div>
        )}

        {/* Immediate Fix */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">🚀 Immediate Phantom Cart Fix</h3>
          <p className="text-green-700 mb-4">
            Click this button to instantly clear all phantom cart data and fix the quantity multiplication bug:
          </p>
          <button
            onClick={immediatePhantomFix}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold text-lg"
          >
            Fix Phantom Cart Now!
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          <h3 className="font-semibold mb-2">How to Fix Phantom Cart Items:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Use the "Fix Phantom Cart Now!" button above for instant fix</li>
            <li>Or manually clear both LocalStorage and Server cart data using the buttons above</li>
            <li>Refresh the page or navigate away and back</li>
            <li>Check that the cart is empty on the main site</li>
            <li>If issues persist, check browser dev tools console for debug logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 