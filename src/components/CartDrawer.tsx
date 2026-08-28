'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { FiX, FiMinus, FiPlus, FiDownload, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import GlobalTierSelector from './GlobalTierSelector';
import logoImg from '@/app/Logo-luxxo2.png';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartSubtotal, cartDiscount, cartTotal, globalTier } = useCart();

    const getMinAmountForTier = (tier: number) => {
        switch (tier) {
            case 30: return 500000;
            case 40: return 1000000;
            case 50: return 2000000;
            case 60: return 5000000;
            case 67: return 10000000;
            case 74: return 20000000;
            default: return 0;
        }
    };

    const minAmount = getMinAmountForTier(globalTier);
    const hasMetMinimum = cartTotal >= minAmount;

    if (!isCartOpen) return null;

    const handleDownloadBill = async () => {
        const doc = new jsPDF();

        // Header
        const img = new Image();
        img.src = logoImg.src;

        await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
        });

        if (img.width > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                // Make it black
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = '#111111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const blackLogoUrl = canvas.toDataURL('image/png');
                const ratio = img.height / img.width;
                const pdfWidth = 45;
                const pdfHeight = pdfWidth * ratio;

                doc.addImage(blackLogoUrl, 'PNG', 105 - (pdfWidth / 2), 10, pdfWidth, pdfHeight);
            }
        } else {
            // Fallback
            doc.setFontSize(22);
            doc.text("LUXXO", 105, 20, { align: 'center' });
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text("Comparte esta cotización con tu asesor.", 105, 32, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 44);

        const tableData = items.map(item => [
            item.name,
            item.variantLabel || '-',
            globalTier > 0 ? `${globalTier}%` : 'Detal',
            item.quantity.toString(),
            `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            `$${(item.price * (1 - globalTier / 100) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        ]);

        const footData: any[] = [];
        if (cartDiscount > 0) {
            footData.push(['', '', '', '', 'Subtotal Base', `$${cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);
            footData.push(['', '', '', '', 'Ahorro Mayorista', `-$${cartDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);
        }
        footData.push(['', '', '', '', 'TOTAL', `$${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} COP`]);

        autoTable(doc, {
            startY: 54,
            head: [['Producto', 'Variante', 'Dcto', 'Cant.', 'Precio', 'Subtotal']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [20, 20, 20], textColor: [255, 215, 0], fontStyle: 'bold' },
            styles: { fontSize: 10 },
            foot: footData,
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        });

        doc.save(`Luxxo_Pedido_${Date.now()}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-neutral-950 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-white/10">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-serif font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <FiShoppingCart className="text-gold-400" />
                            Tu Selección
                        </h2>
                        {items.length > 0 && <GlobalTierSelector />}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Contents */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                            <FiShoppingCart className="text-6xl opacity-20" />
                            <p className="font-serif italic text-lg tracking-widest">No hay piezas seleccionadas</p>
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium uppercase tracking-wider text-sm">{item.name}</h3>
                                        {item.variantLabel && (
                                            <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest">Medida: {item.variantLabel}</p>
                                        )}
                                        <div className="text-gold-400 font-bold mt-2 flex items-center gap-2">
                                            ${(item.price * (1 - globalTier / 100)).toLocaleString('en-US', { minimumFractionDigits: 2 })} COP
                                            {globalTier > 0 && (
                                                <span className="text-xs text-neutral-500 line-through">
                                                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end justify-between gap-4">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-neutral-500 hover:text-red-400 transition-colors text-lg mb-2"
                                            title="Eliminar del carrito"
                                        >
                                            <FiTrash2 />
                                        </button>
                                        <div className="flex items-center gap-3 bg-neutral-900 rounded-full px-3 py-1 border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-neutral-400 hover:text-white"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FiMinus className="text-xs" />
                                            </button>
                                            <span className="text-white text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-neutral-400 hover:text-white"
                                            >
                                                <FiPlus className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-neutral-950 space-y-4">
                        {globalTier > 0 && !hasMetMinimum && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm leading-relaxed">
                                Si es tu primera vez, aún no llegas al monto mínimo para recibir el descuento seleccionado.
                                <br />
                                <span className="font-semibold text-red-300 mt-1 block">Faltan ${(minAmount - cartTotal).toLocaleString('en-US')} COP</span>
                            </div>
                        )}

                        {cartDiscount > 0 && (
                            <>
                                <div className="flex justify-between items-center text-sm text-neutral-400">
                                    <span>Subtotal Base (Detal):</span>
                                    <span>${cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gold-500/80">
                                    <span>Ahorro Mayorista Total:</span>
                                    <span>-${cartDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="h-px bg-white/10 w-full my-2"></div>
                            </>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400 uppercase tracking-widest text-sm">Total Estimado</span>
                            <span className="text-2xl font-bold text-white tracking-tighter">
                                ${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} COP
                            </span>
                        </div>
                        <button
                            onClick={handleDownloadBill}
                            className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-[0.2em] rounded-full transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]"
                        >
                            <FiDownload className="text-lg" />
                            Descargar Cotización
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
