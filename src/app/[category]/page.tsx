import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryAdLayout } from "@/components/layout/ad-layout-wrapper";
import { BetweenContentAd } from "@/components/ui/universal-ad-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticlesByCategory } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import { formatDateForDisplay } from "@/lib/date-utils";
import { ArrowLeft, BookOpen } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  // Check if category exists
  if (!Object.keys(CATEGORIES).includes(category)) {
    notFound();
  }

  const articles = getArticlesByCategory(category);
  const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];

  return (
    <CategoryAdLayout
      sidebarContent={
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Category Info</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <p className="text-sm text-muted-foreground mb-4">
                {categoryInfo.description}
              </p>
              <div className="text-sm">
                <strong>{articles.length}</strong> article{articles.length !== 1 ? 's' : ''} available
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      }
    >
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: categoryInfo.name }
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-4">
          {categoryInfo.name}
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          {categoryInfo.description}
        </p>

        <div className="border-b border-border pb-4">
          <span className="text-sm text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                description={article.description}
                slug={article.slug}
                category={category}
                date={formatDateForDisplay(article.publishedAt)}
                readTime={`${article.readTime} min`}
                author={article.author}
                image={article.heroImage}
              />
            ))}
          </div>

          {/* Content Ad between articles - Slot 2 */}
          {articles.length > 4 && <BetweenContentAd slot={2} />}

          {/* Additional Content Ad - Slot 6 */}
          {articles.length > 6 && <BetweenContentAd slot={6} />}

          {articles.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.slice(4).map((article) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  description={article.description}
                  slug={article.slug}
                  category={category}
                  date={formatDateForDisplay(article.publishedAt)}
                  readTime={`${article.readTime} min`}
                  author={article.author}
                  image={article.heroImage}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600">
            Articles for this category will be added soon.
          </p>
        </div>
      )}
    </CategoryAdLayout>
  );
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    category,
  }));
}
