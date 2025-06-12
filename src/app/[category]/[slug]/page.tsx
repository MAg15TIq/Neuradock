import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticlesByCategory, getRelatedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ReadingProgress, ScrollToTop, TableOfContents, EstimatedReadTime } from "@/components/ui/reading-progress";
import { SocialShare } from "@/components/ui/social-share";
import { FadeIn } from "@/components/ui/animations";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ArticleAdLayout } from "@/components/layout/ad-layout-wrapper";
import { ArticleTopAd, ArticleBottomAd, BetweenContentAd } from "@/components/ui/universal-ad-system";
import { ClientDateDisplay, ClientSimpleDateDisplay } from "@/components/ui/client-date-display";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  
  // Check if category exists
  if (!Object.keys(CATEGORIES).includes(category)) {
    notFound();
  }

  const article = getArticle(category, slug);

  if (!article) {
    notFound();
  }

  const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
  const relatedArticles = getRelatedArticles(article, 3);

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neuradock.com'}/${category}/${slug}`;

  // Extract headings for table of contents from HTML content
  const headings = Array.from(article.content.matchAll(/<h([2-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-6]>/g))
    .map((match) => {
      const level = parseInt(match[1]);
      const id = match[2];
      const text = match[3].replace(/<[^>]*>/g, ''); // Remove any HTML tags from heading text
      return { id, text, level };
    });

  return (
    <>
      <ReadingProgress color="primary" />
      <ArticleAdLayout
        sidebarContent={
          headings.length > 0 ? (
            <Card className="p-4">
              <TableOfContents headings={headings} />
            </Card>
          ) : undefined
        }
      >
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: categoryInfo.name, href: `/${category}` },
              { label: article.title }
            ]}
          />
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link
            href={`/${category}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {categoryInfo.name}
          </Link>
        </div>

        {/* Article Header */}
        <FadeIn>
          <header className="mb-8">
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                {categoryInfo.name}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.description}
            </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-muted-foreground border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <ClientDateDisplay
                  date={article.publishedAt}
                  options={{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }}
                />
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <EstimatedReadTime content={article.content} />
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-2">
              <SocialShare
                url={currentUrl}
                title={article.title}
                description={article.description}
                variant="inline"
              />
            </div>
          </div>
          
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          </header>
        </FadeIn>

        {/* Article Top Ad */}
        <ArticleTopAd slot={2} />

        {/* Hero Image */}
        {article.heroImage && (
          <FadeIn delay={100}>
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <OptimizedImage
                src={article.heroImage}
                alt={article.heroImageAlt || `Hero image for ${article.title}`}
                width={1200}
                height={600}
                className="w-full h-[400px] md:h-[500px] object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </FadeIn>
        )}

        {/* Floating Social Share */}
        <SocialShare
          url={currentUrl}
          title={article.title}
          description={article.description}
          variant="floating"
        />

        {/* Table of Contents - Mobile */}
        {headings.length > 0 && (
          <div className="lg:hidden mb-8">
            <Card className="p-4">
              <TableOfContents headings={headings} />
            </Card>
          </div>
        )}

        {/* Article Content */}
        <FadeIn delay={200}>
          <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700">
            <div
              dangerouslySetInnerHTML={{
                __html: article.content
              }}
            />
          </article>
        </FadeIn>

        {/* Between Content Ad */}
        <BetweenContentAd slot={3} />

        {/* Tags Section */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={`${relatedArticle.category}-${relatedArticle.slug}`}
                  href={`/${relatedArticle.category}/${relatedArticle.slug}`}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORIES[relatedArticle.category].color}`}>
                          {CATEGORIES[relatedArticle.category].name}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {relatedArticle.readTime} min
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{relatedArticle.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{relatedArticle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {relatedArticle.author}
                        </div>
                        <ClientSimpleDateDisplay date={relatedArticle.publishedAt} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Bottom Ad */}
        <ArticleBottomAd slot={4} />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <Link
              href={`/${category}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              More {categoryInfo.name} Articles
            </Link>
          </div>
        </footer>
      </ArticleAdLayout>
      <ScrollToTop />
    </>
  );
}

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];
  
  for (const category of Object.keys(CATEGORIES)) {
    const articles = getArticlesByCategory(category);
    for (const article of articles) {
      params.push({
        category,
        slug: article.slug,
      });
    }
  }
  
  return params;
}
