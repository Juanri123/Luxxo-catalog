import TopNav from '@/components/layout/TopNav';
import { getCountryConfig } from '@/config/countries';
import { getCategories } from '@/lib/catalog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import logo from '@/app/Logo-luxxo2.png';

export default async function CountryLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ country: string }>
}) {
    const { country } = await params;

    if (!getCountryConfig(country)) {
        return notFound();
    }

    const categories = await getCategories();
    const categoriesForNav = categories.map(c => ({ id: c.slug, name: c.name }));

    return (
        <div className="flex flex-col min-h-screen">
            <TopNav countryId={country} categories={categoriesForNav} />
            <main className="flex-1 mt-20 md:mt-24">
                {children}
            </main>

            <footer className="mt-32 text-center pb-12 border-t border-white/5 pt-12 max-w-7xl mx-auto w-full flex flex-col items-center gap-4">
                <Image src={logo} alt="Luxxo Logo" className="h-6 md:h-8 w-auto opacity-60 grayscale hover:grayscale-0 transition-all duration-500" />
                <p className="text-neutral-600 font-serif italic text-sm tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} LUXXO Mayoristas
                </p>
            </footer>
        </div>
    );
}
