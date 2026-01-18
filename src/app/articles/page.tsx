import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { JsonArticleRepository } from '@/infrastructure/repositories/JsonArticleRepository';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArticlesGrid } from '@/features/articles/components/ArticlesGrid';

export const metadata: Metadata = {
  title: 'Artikel - HMJF UIN Alauddin',
  description: 'Kumpulan artikel, blog, opini, publikasi, dan informasi dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const articleRepo = new JsonArticleRepository();
  const category = searchParams.category as keyof typeof ARTICLE_CATEGORIES | undefined;

  const articles = category
    ? await articleRepo.getByCategory(category as any)
    : await articleRepo.getAll();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Artikel
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Kumpulan artikel, blog, opini, publikasi ilmiah, dan informasi terkini dari HMJF
          </p>
        </div>
      </section>

      {/* Category Filter - Segmented Control - Floating Style */}
      <section className="sticky top-0 md:top-32 z-40 py-4 transition-all duration-300 pointer-events-none">
        <div className="container-custom flex justify-center pointer-events-auto">
          <div className="inline-flex items-center p-1.5 bg-gray-100/80 rounded-full border border-gray-200 shadow-inner overflow-x-auto max-w-full scrollbar-hide">
            <Link
              href="/articles"
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${!category
                ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Semua
            </Link>
            {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                href={`/articles?category=${key}`}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${category === key
                  ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Masonry Grid - Animated */}
      <section className="container-custom py-16">
        <ArticlesGrid articles={articles} />
      </section>
    </div>
  );
}
