import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryLayout } from "@/components/layout/sidebar-layout";
import { getArticlesByCategory } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Articles Grid with Sidebar */}
        <CategoryLayout showAds={true}>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  description={article.description}
                  slug={article.slug}
                  category={category}
                  date={new Date(article.publishedAt).toLocaleDateString()}
                  readTime={`${article.readTime} min`}
                  author={article.author}
                  image={article.heroImage}
                />
              ))}
            </div>
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
        </CategoryLayout>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    category,
  }));
}
