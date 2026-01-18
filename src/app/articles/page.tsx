import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { JsonArticleRepository } from '@/infrastructure/repositories/JsonArticleRepository';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artikel</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Kumpulan artikel, blog, opini, publikasi ilmiah, dan informasi terkini dari HMJF
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/articles"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                !category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </Link>
            {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                href={`/articles?category=${key}`}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  category === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-custom py-12">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Belum ada artikel tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Cover Image */}
                <Link href={`/articles/${article.slug}`} className="block relative h-48 overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      {ARTICLE_CATEGORIES[article.category]}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time>
                        {format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id })}
                      </time>
                    </div>
                    {article.views && (
                      <div className="flex items-center gap-1">
                        <span>{article.views} views</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    {article.author.avatar && (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{article.author.role}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
