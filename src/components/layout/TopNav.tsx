'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiHome } from 'react-icons/fi';
import { getCountryConfig } from '@/config/countries';
import CartIcon from '../CartIcon';
import Image from 'next/image';
import logo from '@/app/Logo-luxxo2.png';

export default function TopNav({ countryId, categories }: { countryId: string, categories: { id: string, name: string }[] }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const config = getCountryConfig(countryId);

    // Generate breadcrumbs natively by splitting the pathname
    const pathParts = pathname.split('/').filter(Boolean);
    // pathParts[0] == countryId, [1] == category, [2] == subcategory

    return (
        <>
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 z-40 flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 text-white hover:text-gold-400 transition-colors"
                    >
                        <FiMenu className="text-2xl" />
                    </button>

                    <Link href={`/${countryId}`} className="flex items-center hover:opacity-80 transition-opacity">
                        <Image src={logo} alt="Luxxo Logo" className="h-8 md:h-10 w-auto opacity-90 drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                    </Link>
                </div>

                {/* Breadcrumbs - Desktop only for space */}
                <nav className="hidden md:flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-neutral-500">
                    <Link href={`/${countryId}`} className="hover:text-gold-400 transition-colors flex items-center gap-1">
                        <FiHome /> {config?.name}
                    </Link>
                    {pathParts.slice(1).map((part, index) => {
                        const routeToHere = '/' + pathParts.slice(0, index + 2).join('/');
                        const label = decodeURIComponent(part).replace(/-/g, ' ').trim();
                        return (
                            <div key={part} className="flex items-center gap-2">
                                <span className="text-neutral-700">/</span>
                                <Link href={routeToHere} className="hover:text-gold-400 transition-colors">
                                    {label}
                                </Link>
                            </div>
                        )
                    })}
                </nav>

                {/* Placeholder for visual balance, since CartIcon is floating */}
                <div className="w-10"></div>
            </header>

            {/* Hamburger Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

                    <div className="relative w-4/5 max-w-sm h-full bg-neutral-950 border-r border-white/5 p-8 flex flex-col shadow-2xl animate-slide-in-right">
                        <div className="flex items-center justify-between mb-12">
                            <span className="font-serif font-bold text-gold-500 tracking-widest text-xl">MENÚ</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-neutral-400 hover:text-white p-2">
                                <FiX className="text-2xl" />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto space-y-6">
                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/${countryId}/${cat.id}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-2xl font-serif text-white hover:text-gold-400 transition-colors capitalize tracking-wide"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                            <Link href="/" className="text-sm font-medium uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                                Cambiar País
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
