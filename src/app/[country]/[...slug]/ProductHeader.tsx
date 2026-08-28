'use client';

import { useState } from 'react';
import { FolderMetadata } from '@/lib/catalog';
import { FiTag, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import GlobalTierSelector from '@/components/GlobalTierSelector';
import { getCountryConfig } from '@/config/countries';

interface ProductHeaderProps {
    metadata: FolderMetadata;
    productName: string;
    countryId: string;
    children?: React.ReactNode;
}

export default function ProductHeader({ metadata, productName, countryId, children }: ProductHeaderProps) {
    const [selectedVariant, setSelectedVariant] = useState(metadata.variants?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart, globalTier, setGlobalTier } = useCart();
    const config = getCountryConfig(countryId);

    const retailPrice = selectedVariant?.price || metadata.originalPrice;

    // Multi-country Pricing Calculation!
    const isWholesale = globalTier > 0;
    const salePrice = retailPrice ? retailPrice * (1 - (globalTier / 100)) : undefined;

    const formatPrice = (price: number) => {
        const currency = config?.currencyCode || 'COP';
        return new Intl.NumberFormat(config?.locale || 'es-CO', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: currency === 'COP' ? 0 : 2
        }).format(price);
    }

    return (
        <div className="mb-12 animate-fade-in space-y-8">
            {/* Wholesale Tier Selector & Info Table */}
            <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div>
                    <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-gold-400 font-serif mb-2 flex items-center gap-2">
                        <FiTag /> Tabla de Descuentos Mayoristas
                    </h4>
                    <p className="text-xs text-neutral-400 mb-5 italic tracking-wide">
                        Selecciona tu presupuesto y agrega los productos al carrito
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { cond: 'Sin mínimo', desc: 'Detal', val: '0%', num: 0 },
                            { cond: 'mínimo $500,000', desc: 'Emprendedor', val: '-30%', num: 30 },
                            { cond: 'mínimo $1M', desc: 'Negocio', val: '-40%', num: 40 },
                            { cond: 'mínimo $2M', desc: 'Mayorista', val: '-50%', num: 50 },
                            { cond: 'mínimo $5M', desc: 'Distribuidor', val: '-60%', num: 60 },
                            { cond: 'mínimo $10M', desc: 'Premium', val: '-67%', num: 67 },
                            { cond: 'mínimo $20M', desc: 'Elite', val: '-74%', num: 74 },
                        ].map((t) => (
                            <div
                                key={t.cond}
                                onClick={() => setGlobalTier(t.num)}
                                className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center group transition-all duration-300 ${globalTier === t.num ? 'bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-black/40 border-white/5 hover:border-gold-500/50'}`}
                            >
                                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{t.cond}</span>
                                <span className={`text-lg font-bold font-serif my-1 transition-colors ${globalTier === t.num ? 'text-gold-400' : 'text-white group-hover:text-gold-300'}`}>{t.val}</span>
                                <span className={`text-xs font-medium ${globalTier === t.num ? 'text-gold-300' : 'text-gold-500/60'}`}>{t.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-neutral-500 mb-3">Simular Precio con Descuento</h4>
                    <div className="flex flex-wrap gap-2">
                        <GlobalTierSelector className="!text-sm !py-3 !px-5 !rounded-full !bg-black/60 !border-gold-500/30 !text-gold-400 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all" />
                    </div>
                </div>
            </div>

            {/* Images from Parent */}
            {children && (
                <div className="py-6">
                    {children}
                </div>
            )}

            {/* Badges Section Removed */}

            {/* Price section */}
            <div className="flex items-center gap-6">
                {isWholesale && retailPrice && (
                    <div className="flex flex-col">
                        <span className="text-sm text-gold-400 font-medium uppercase tracking-widest mb-1">Precio Detal</span>
                        <span className="text-2xl md:text-3xl text-neutral-500 line-through font-light tracking-tight">
                            {formatPrice(retailPrice)}
                        </span>
                    </div>
                )}

                <div className="flex flex-col">
                    {isWholesale && salePrice ? (
                        <>
                            <span className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-1">Precio con Descuento (-{globalTier}%)</span>
                            <span className="text-3xl md:text-5xl font-bold text-emerald-400 tracking-tighter">
                                {formatPrice(salePrice)}
                            </span>
                        </>
                    ) : (
                        <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                            {formatPrice(retailPrice || 0)}
                        </span>
                    )}
                </div>
            </div>
            {
                metadata.isOffer && (
                    <div className="bg-neutral-900 border border-white/10 px-4 py-1.5 rounded-full text-white text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                        <FiTag className="text-gold-400" />
                        Oferta
                    </div>
                )
            }

            {/* Variants */}
            {
                metadata.variants && metadata.variants.length > 0 && (
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
                )
            }

            {/* Cart Actions */}
            {
                salePrice && (
                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-white/10">
                        {/* Add to Cart logic with localized price tracking if needed */}
                        <div className="flex items-center gap-3 bg-neutral-900 rounded-full px-4 py-2 border border-white/5 w-full sm:w-auto justify-between">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="text-neutral-400 hover:text-white p-2"
                            >
                                <FiMinus className="text-xl" />
                            </button>
                            <span className="text-white text-lg font-medium w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="text-neutral-400 hover:text-white p-2"
                            >
                                <FiPlus className="text-xl" />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                addToCart({
                                    id: `${productName}-${selectedVariant?.label || 'default'}`,
                                    name: productName,
                                    variantLabel: selectedVariant?.label,
                                    price: retailPrice || 0, // Store retail price
                                    quantity
                                });
                                setAdded(true);
                                setTimeout(() => setAdded(false), 1500);
                            }}
                            className={`w-full sm:flex-1 py-4 font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-3 ${added ? 'bg-emerald-400 text-black scale-[1.02] shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'bg-white hover:bg-neutral-200 text-black'
                                }`}
                        >
                            {added ? (
                                <>
                                    <FiShoppingCart className="text-xl" />
                                    Añadido a cotización
                                </>
                            ) : (
                                <>
                                    <FiShoppingCart className="text-xl" />
                                    Agregar a cotización
                                </>
                            )}
                        </button>
                    </div>
                )
            }
        </div >
    );
}
