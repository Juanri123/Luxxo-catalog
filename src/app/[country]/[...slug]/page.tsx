import { getDirectoryContent, getCategories } from '@/lib/catalog';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';
import ProductHeader from './ProductHeader';

export async function generateStaticParams() {
    return []; // We will handle dynamic params at runtime or pre-render separately 
}

export default async function CategoryPage({ params }: { params: Promise<{ country: string, slug: string[] }> }) {
    const { country, slug } = await params;
    const content = await getDirectoryContent(slug);

    if (!content) {
        return notFound();
    }

    const { name, subcategories, images } = content;

    const parentPath = slug.length > 1 ? `/${country}/${slug.slice(0, -1).join('/')}` : `/${country}`;

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-6">
            <Link
                href={parentPath}
                className="inline-flex items-center gap-3 text-neutral-500 hover:text-gold-400 mb-12 transition-all group px-5 py-2.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm hover:border-gold-500/30 w-fit"
            >
                <BiArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium tracking-widest uppercase text-xs">Volver atrás</span>
            </Link>

            <header className="mb-16 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white capitalize tracking-tighter mb-4">
                            {name}
                        </h1>
                    </div>
                </div>
                <div className="mt-8 h-px w-full bg-gradient-to-r from-gold-500/30 via-gold-500/10 to-transparent"></div>
            </header>

            {content.metadata && (
                <ProductHeader metadata={content.metadata} productName={name} countryId={country} />
            )}

            {/* Subcategories */}
            {subcategories.length > 0 && (
                <div className="mb-24">
                    <h2 className="text-sm font-serif italic text-gold-200/60 mb-8 tracking-[0.3em] uppercase">Explorar Sub-colecciones</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {subcategories.map((sub: any) => (
                            <Link
                                key={sub.name}
                                href={`/${country}/${slug.join('/')}/${sub.slug}`}
                                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl glass transition-all duration-700 hover:shadow-[0_20px_50px_rgba(197,160,89,0.1)] hover:border-gold-500/20"
                            >
                                {sub.preview ? (
                                    <div className="absolute inset-0">
                                        <Image
                                            src={sub.preview}
                                            alt={sub.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 text-neutral-600">
                                        <span className="text-sm font-serif italic">Sin portada</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2 font-serif group-hover:text-gold-200 transition-colors uppercase tracking-tight">{sub.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Images */}
            {images.length > 0 ? (
                <div className="columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
                    {images.map((img: any, index: number) => (
                        <div
                            key={img.name}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden glass border-white/5 transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:border-gold-500/20"
                        >
                            <div className="relative w-full">
                                {img.src && (
                                    <Image
                                        src={img.src}
                                        alt={img.name}
                                        width={600}
                                        height={800}
                                        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority={index < 4}
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20">
                                <p className="text-xs md:text-sm font-medium text-white font-serif tracking-wide border-l border-gold-500/50 pl-4 py-1">
                                    {img.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                subcategories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-neutral-600 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
                        <p className="text-xl font-serif italic tracking-widest">Colección vacía</p>
                        <p className="text-xs uppercase tracking-[0.2em] mt-4 opacity-50">Próximamente nuevas piezas</p>
                    </div>
                )
            )}
        </div>
    );
}
