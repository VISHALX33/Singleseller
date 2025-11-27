/**
 * Cart Context - Manage shopping cart state globally with backend sync
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const initialState = {
  cartItems: [],
  itemCount: 0,
  subtotal: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload.items || [],
        itemCount: action.payload.itemCount || 0,
        subtotal: action.payload.subtotal || 0,
        loading: false,
        error: null,
      };

    case 'ADD_ITEM':
      return {
        ...state,
        cartItems: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: action.payload.subtotal,
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        cartItems: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: action.payload.subtotal,
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: action.payload.subtotal,
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        itemCount: 0,
        subtotal: 0,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        const updatedCart = await cartService.addToCart(productId, quantity);

        dispatch({
          type: 'ADD_ITEM',
          payload: {
            items: updatedCart.items || [],
            itemCount: updatedCart.itemCount || 0,
            subtotal: updatedCart.subtotal || 0,
          },
        });

        toast.success(`Added to cart (${quantity} item${quantity > 1 ? 's' : ''})`);
        return updatedCart;
      } catch (error) {
        toast.error(error.message || 'Failed to add item to cart');
        throw error;
      }
    },
    []
  );

  // Update item quantity
  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      const updatedCart = await cartService.updateCartItem(itemId, quantity);

      dispatch({
        type: 'UPDATE_ITEM',
        payload: {
          items: updatedCart.items || [],
          itemCount: updatedCart.itemCount || 0,
          subtotal: updatedCart.subtotal || 0,
        },
      });

      toast.success('Quantity updated');
      return updatedCart;
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
      throw error;
    }
  }, []);

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      const updatedCart = await cartService.removeFromCart(itemId);

      dispatch({
        type: 'REMOVE_ITEM',
        payload: {
          items: updatedCart.items || [],
          itemCount: updatedCart.itemCount || 0,
          subtotal: updatedCart.subtotal || 0,
        },
      });

      toast.success('Item removed from cart');
      return updatedCart;
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
      throw error;
    }
  }, []);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();

      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    }
  }, []);

  // Fetch cart on mount if user is authenticated
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      fetchCart();
    }
  }, [fetchCart]);

  const value = {
    cartItems: state.cartItems,
    itemCount: state.itemCount,
    subtotal: state.subtotal,
    loading: state.loading,
    error: state.error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
