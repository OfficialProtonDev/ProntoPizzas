import React, { createContext, useContext, useReducer } from 'react';

// Create the cart context - this will hold our cart state
const CartContext = createContext();

// Initial state for our cart
const initialState = {
    items: [], // Array of cart items
    total: 0,  // Total price
    itemCount: 0 // Total number of items
};

// Reducer function - handles all cart state changes
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            // Check if item already exists in cart (same pizza and size)
            const existingItemIndex = state.items.findIndex(
                item => item.pizzaId === action.payload.pizzaId &&
                    item.size === action.payload.size
            );

            if (existingItemIndex > -1) {
                // Item exists, increase quantity
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += action.payload.quantity || 1;

                return {
                    ...state,
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                    itemCount: calculateItemCount(updatedItems)
                };
            } else {
                // New item, add to cart
                const newItem = { 
                    ...action.payload, 
                    quantity: action.payload.quantity || 1 
                };
                const updatedItems = [...state.items, newItem];

                return {
                    ...state,
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                    itemCount: calculateItemCount(updatedItems)
                };
            }

        case 'REMOVE_ITEM':
            const filteredItems = state.items.filter(
                item => !(item.pizzaId === action.payload.pizzaId &&
                    item.size === action.payload.size)
            );

            return {
                ...state,
                items: filteredItems,
                total: calculateTotal(filteredItems),
                itemCount: calculateItemCount(filteredItems)
            };

        case 'UPDATE_QUANTITY':
            const updatedItems = state.items.map(item => {
                if (item.pizzaId === action.payload.pizzaId &&
                    item.size === action.payload.size) {
                    return { ...item, quantity: action.payload.quantity };
                }
                return item;
            });

            return {
                ...state,
                items: updatedItems,
                total: calculateTotal(updatedItems),
                itemCount: calculateItemCount(updatedItems)
            };

        case 'CLEAR_CART':
            return initialState;

        default:
            return state;
    }
}

// Helper function to calculate total price
function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Helper function to calculate total item count
function calculateItemCount(items) {
    return items.reduce((count, item) => count + item.quantity, 0);
}

// Cart Provider component 
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeFromCart = (pizzaId, size) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { pizzaId, size } });
    };

    const updateQuantity = (pizzaId, size, quantity) => {
        if (quantity <= 0) {
            removeFromCart(pizzaId, size);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { pizzaId, size, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{
            ...state,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use cart context
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}