import Link from 'next/link';
import { countries } from '@/config/countries';
import { FiGlobe } from 'react-icons/fi';

export default function CountrySelector() {
  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 selection:bg-gold-500/30 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>

      <header className="mb-16 text-center animate-fade-in relative z-10 w-full max-w-4xl">
        <div className="inline-block mb-6 px-4 py-1.5 border border-gold-500/30 rounded-full bg-gold-500/5 backdrop-blur-sm">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-gold-400 flex items-center gap-2">
            <FiGlobe /> Multi-Región
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tighter">
          <span className="text-gradient-gold">
            LUXXO
          </span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed italic">
          Seleccione su país para ingresar al catálogo.
        </p>
        <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full max-w-5xl">
        {countries.map((country) => (
          <div key={country.id} className="relative group">
            {country.active ? (
              <Link
                href={`/${country.id}`}
                className="block p-8 rounded-2xl glass transition-all duration-500 hover:shadow-[0_10px_40px_rgba(197,160,89,0.15)] hover:border-gold-500/30 border border-white/5 bg-white/5 backdrop-blur-md"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <span className="text-3xl">{/* Flag emoji or icon could go here based on country, for now just text */}</span>
                  <h2 className="text-2xl font-serif font-bold text-white tracking-wide">{country.name}</h2>
                  <div className="h-px w-8 bg-gold-500/50 group-hover:w-16 transition-all duration-500"></div>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-emerald-400">
                    Catálogo Disponible
                  </span>
                </div>
              </Link>
            ) : (
              <div
                className="block p-8 rounded-2xl glass border border-white/5 bg-neutral-900/40 backdrop-blur-md opacity-60 cursor-not-allowed"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <h2 className="text-2xl font-serif font-bold text-neutral-500 tracking-wide">{country.name}</h2>
                  <div className="h-px w-8 bg-neutral-700"></div>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-600">
                    Próximamente
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </main>
  );
}
