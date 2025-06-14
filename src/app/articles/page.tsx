import Link from "next/link";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryAdLayout } from "@/components/layout/ad-layout-wrapper";
import { BetweenContentAd } from "@/components/ui/universal-ad-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import { formatDateForDisplay } from "@/lib/date-utils";
import { ArrowLeft, BookOpen, TrendingUp, Filter } from "lucide-react";

export const metadata = {
  title: "All Articles - NeuraDock",
  description: "Browse all articles across finance, technology, education, and business categories. Expert insights and analysis from Malik Mohsin Saleem Khan.",
  keywords: "articles, finance, technology, education, business, insights, analysis",
};

export default function ArticlesPage() {
  const allArticles = getAllArticles();
  
  // Group articles by category for better organization
  const articlesByCategory = {
    finance: allArticles.filter(article => article.category === 'finance'),
    technology: allArticles.filter(article => article.category === 'technology'),
    education: allArticles.filter(article => article.category === 'education'),
    business: allArticles.filter(article => article.category === 'business'),
  };

  const totalArticles = allArticles.length;

  return (
    <CategoryAdLayout>
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "All Articles" }
          ]}
        />
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          All Articles
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Explore our complete collection of expert insights and analysis
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{totalArticles} Articles</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>4 Categories</span>
          </div>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Browse by Category
            </CardTitle>
            <CardDescription>
              Jump to specific categories or explore all articles below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(CATEGORIES).map(([key, category]) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className="group p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    <Badge variant="secondary">
                      {articlesByCategory[key as keyof typeof articlesByCategory].length}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Ad */}
      <BetweenContentAd slot={2} />

      {/* All Articles Grid */}
      {allArticles.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Latest Articles
            </h2>
            <p className="text-muted-foreground">
              All articles sorted by publication date
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allArticles.slice(0, 8).map((article) => (
              <ArticleCard
                key={`${article.category}-${article.slug}`}
                title={article.title}
                description={article.description}
                slug={article.slug}
                category={article.category}
                date={formatDateForDisplay(article.publishedAt)}
                readTime={`${article.readTime} min`}
                author={article.author}
                image={article.heroImage}
              />
            ))}
          </div>

          {/* Content Ad between articles */}
          {allArticles.length > 8 && <BetweenContentAd slot={2} />}

          {allArticles.length > 8 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allArticles.slice(8).map((article) => (
                <ArticleCard
                  key={`${article.category}-${article.slug}`}
                  title={article.title}
                  description={article.description}
                  slug={article.slug}
                  category={article.category}
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
            Articles will be added soon.
          </p>
        </div>
      )}
    </CategoryAdLayout>
  );
}
