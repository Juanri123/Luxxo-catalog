'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function GlobalTierSelector({ className = '' }: { className?: string }) {
    const { globalTier, setGlobalTier } = useCart();

    return (
        <select
            value={globalTier}
            onChange={(e) => setGlobalTier(Number(e.target.value))}
            className={`bg-neutral-950 border border-white/20 rounded-lg px-3 py-2 text-xs font-bold focus:border-gold-500 outline-none text-white hover:border-white/40 transition-colors cursor-pointer appearance-auto ${className}`}
        >
            <option className="bg-neutral-900 text-white font-medium" value={0}>Detal (0%)</option>
            <option className="bg-neutral-900 text-white font-medium" value={30}>&gt; $500,000 (-30%)</option>
            <option className="bg-neutral-900 text-white font-medium" value={40}>&gt; $1,000,000 (-40%)</option>
            <option className="bg-neutral-900 text-white font-medium" value={50}>&gt; $2,000,000 (-50%)</option>
            <option className="bg-neutral-900 text-white font-medium" value={60}>&gt; $5,000,000 (-60%)</option>
            <option className="bg-neutral-900 text-white font-medium" value={67}>&gt; $10,000,000 (-67%)</option>
            <option className="bg-neutral-900 text-gold-400 font-bold" value={74}>&gt; $20,000,000 (-74%)</option>
        </select>
    );
}
