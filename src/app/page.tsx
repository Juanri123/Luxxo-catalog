import { getCategories } from '@/lib/catalog';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 selection:bg-gold-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <div className="inline-block mb-4 px-3 py-1 border border-gold-500/30 rounded-full bg-gold-500/5 backdrop-blur-sm animate-fade-in">
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-gold-400">Exclusividad & Elegancia</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tighter">
            <span className="text-gradient-gold">
              LUXXO
            </span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed italic">
            &quot;Donde el brillo encuentra su historia.&quot;
          </p>
          <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto"></div>
        </header>

        <div className="grid grid-cols-2 gap-4 md:gap-10 lg:gap-16">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group relative block aspect-[4/5] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl glass transition-all duration-700 hover:shadow-[0_20px_50px_rgba(197,160,89,0.15)] hover:border-gold-500/20"
            >
              {category.previewImage ? (
                <div className="absolute inset-0">
                  <Image
                    src={category.previewImage}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50">
                  <span className="text-neutral-600 font-serif italic text-lg">Sin imagen de portada</span>
                </div>
              )}

              {/* Sophisticated Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700 z-10" />

              {/* Border shine effect */}
              <div className="absolute inset-0 border border-white/5 rounded-2xl z-30 group-hover:border-gold-500/30 transition-colors duration-700" />

              {/* Text content */}
              <div
                className="
                  absolute bottom-0 left-0 w-full z-20
                  p-8 md:p-10
                  translate-y-4
                  group-hover:translate-y-0
                  transition-transform duration-700
                "
              >
                <h2 className="text-xl md:text-4xl font-bold mb-3 text-white font-serif tracking-tight">
                  {category.name}
                </h2>

                <div
                  className="
                    h-0
                    overflow-hidden
                    opacity-0
                    group-hover:h-8
                    group-hover:opacity-100
                    transition-all duration-700 delay-100
                  "
                >
                  <span className="text-xs text-gold-400 font-semibold uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500"></span>
                    {category.imageCount} Piezas Disponibles
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-32 text-center pb-12 border-t border-white/5 pt-12">
          <p className="text-neutral-600 font-serif italic text-sm tracking-widest uppercase">
            &copy; {new Date().getFullYear()} LUXXO Jewelry Catalogs
          </p>
        </footer>
      </div>
    </main>
  );
}
