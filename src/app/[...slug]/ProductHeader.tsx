'use client';

import { useState } from 'react';
import { FolderMetadata } from '@/lib/catalog';
import { FiTruck, FiShield, FiTag } from 'react-icons/fi';

interface ProductHeaderProps {
    metadata: FolderMetadata;
}

export default function ProductHeader({ metadata }: ProductHeaderProps) {
    const [selectedVariant, setSelectedVariant] = useState(metadata.variants?.[0] || null);

    const originalPrice = selectedVariant?.compareAtPrice || metadata.originalPrice;
    const salePrice = selectedVariant?.price || metadata.salePrice;

    return (
        <div className="mb-12 animate-fade-in space-y-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
                {metadata.isFreeShipping && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 text-sm font-medium">
                        <FiTruck className="text-base" />
                        Envío Gratis
                    </div>
                )}
                {metadata.material && (
                    <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-lg text-gold-400 text-sm font-medium">
                        <FiShield className="text-base" />
                        {metadata.material}
                    </div>
                )}
            </div>

            {/* Price section */}
            <div className="flex items-center gap-6">
                {originalPrice && (
                    <span className="text-2xl md:text-3xl text-neutral-500 line-through font-light tracking-tight">
                        ${originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </span>
                )}
                {salePrice && (
                    <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                        ${salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </span>
                )}
                {metadata.isOffer && (
                    <div className="bg-neutral-900 border border-white/10 px-4 py-1.5 rounded-full text-white text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                        <FiTag className="text-gold-400" />
                        Oferta
                    </div>
                )}
            </div>

            {/* Variants */}
            {metadata.variants && metadata.variants.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-500">Medida</h4>
                    <div className="flex flex-wrap gap-3">
                        {metadata.variants.map((v) => (
                            <button
                                key={v.label}
                                onClick={() => setSelectedVariant(v)}
                                className={`
                                    px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                                    ${selectedVariant?.label === v.label
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                        : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }
                                `}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
