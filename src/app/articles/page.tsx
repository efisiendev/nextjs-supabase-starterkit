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

      {/* Category Filter - Floating Pills */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/articles"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                !category
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </Link>
            {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                href={`/articles?category=${key}`}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                  category === key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
