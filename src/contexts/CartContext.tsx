'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { LocalCartItem, Product } from '../types/ecommerce';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase } from '../lib/supabase';
import Toast from '../components/Toast';

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  loading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string } // product id
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: LocalCartItem[] }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      } else {
        return {
          ...state,
          items: [...state.items, { product: action.payload, quantity: 1 }]
        };
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== action.payload.productId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_CART':
      return { ...state, items: action.payload };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'language-gems-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    loading: false,
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  const hasInitializedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  // Sync with server cart when user logs in (but prevent infinite loops)
  useEffect(() => {
    const currentUserId = user?.id || null;
    
    // Only sync if:
    // 1. User is authenticated
    // 2. We haven't initialized yet OR the user ID has changed
    if (isAuthenticated && user && 
        (!hasInitializedRef.current || lastUserIdRef.current !== currentUserId)) {
      
      hasInitializedRef.current = true;
      lastUserIdRef.current = currentUserId;
      syncWithServer();
    } else if (!isAuthenticated) {
      // Reset refs when user logs out
      hasInitializedRef.current = false;
      lastUserIdRef.current = null;
    }
  }, [isAuthenticated, user?.id]); // Only depend on user ID, not the entire user object

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    setToast({ 
      show: true, 
      message: `${product.name} added to cart!`, 
      type: 'success' 
    });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + (item.product.price_cents * item.quantity),
      0
    );
  };

  const syncWithServer = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Get server cart
      const { data: serverCart, error } = await supabase
        .from('user_carts')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Merge local cart with server cart
      const mergedItems: LocalCartItem[] = [];
      const localCartMap = new Map(
        state.items.map(item => [item.product.id, item])
      );

      // Add server items
      if (serverCart) {
        for (const serverItem of serverCart) {
          if (serverItem.product) {
            const localItem = localCartMap.get(serverItem.product.id);
            mergedItems.push({
              product: serverItem.product,
              quantity: localItem ? localItem.quantity + serverItem.quantity : serverItem.quantity
            });
            localCartMap.delete(serverItem.product.id);
          }
        }
      }

      // Add remaining local items
      for (const localItem of localCartMap.values()) {
        mergedItems.push(localItem);
        
        // Save local item to server
        await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            product_id: localItem.product.id,
            quantity: localItem.quantity
          });
      }

      dispatch({ type: 'SET_CART', payload: mergedItems });

    } catch (error) {
      console.error('Error syncing cart with server:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    getTotalItems,
    getTotalPrice,
    syncWithServer,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 