'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string; // A unique identifier combining name and variant
    name: string;
    variantLabel?: string;
    price: number; // Base retail price
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    globalTier: number;
    setGlobalTier: (tier: number) => void;
    clearCart: () => void;
    setIsCartOpen: (isOpen: boolean) => void;
    cartSubtotal: number;
    cartDiscount: number;
    cartTotal: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [globalTier, setGlobalTier] = useState<number>(0);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('luxxo-cart');
        const savedTier = localStorage.getItem('luxxo-tier');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart data", e);
            }
        }
        if (savedTier) {
            setGlobalTier(Number(savedTier));
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('luxxo-cart', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('luxxo-tier', globalTier.toString());
    }, [globalTier]);

    const addToCart = (newItem: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prevItems, newItem];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const cartSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    // Total is calculated by applying the global tier to the item prices
    const cartTotal = items.reduce((total, item) => {
        const discountedPrice = item.price * (1 - globalTier / 100);
        return total + discountedPrice * item.quantity;
    }, 0);
    const cartDiscount = cartSubtotal - cartTotal;
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                globalTier,
                setGlobalTier,
                clearCart,
                setIsCartOpen,
                cartSubtotal,
                cartDiscount,
                cartTotal,
                itemCount
            }}
        >
            {children}
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
