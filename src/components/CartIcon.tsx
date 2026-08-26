'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';

export default function CartIcon() {
    const { itemCount, setIsCartOpen } = useCart();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (itemCount > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className={`fixed bottom-6 right-6 md:top-8 md:right-12 md:bottom-auto z-40 bg-neutral-900 border p-4 rounded-full hover:text-white transition-all group duration-300 ${isAnimating ? 'scale-125 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)]' : 'border-gold-500/30 text-gold-400 scale-100 hover:border-gold-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.3)]'}`}
        >
            <div className="relative">
                <FiShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-once">
                        {itemCount}
                    </span>
                )}
            </div>
        </button>
    );
}
