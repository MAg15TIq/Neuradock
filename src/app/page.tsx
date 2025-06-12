import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCard } from "@/components/ui/article-card";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FadeIn, StaggeredFadeIn } from "@/components/ui/animations";
import { ContentDiscovery } from "@/components/ui/content-discovery";
import { HomepageAdLayout } from "@/components/layout/ad-layout-wrapper";
import { BetweenContentAd, ContentAd } from "@/components/ui/universal-ad-system";
import { getFeaturedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import { formatDateForDisplay } from "@/lib/date-utils";
import { ArrowRight, BookOpen, TrendingUp, GraduationCap, Briefcase, Sparkles, Zap } from "lucide-react";

export default function Home() {
  const featuredArticles = getFeaturedArticles(6);

  const categoryIcons = {
    finance: TrendingUp,
    technology: BookOpen,
    education: GraduationCap,
    business: Briefcase,
  };

  // Mock trending topics for demonstration
  const trendingTopics = [
    { name: "Artificial Intelligence", count: 24, trend: "up" as const },
    { name: "Sustainable Finance", count: 18, trend: "up" as const },
    { name: "Remote Learning", count: 15, trend: "stable" as const },
    { name: "Digital Transformation", count: 21, trend: "up" as const },
    { name: "Cryptocurrency", count: 12, trend: "down" as const },
    { name: "Leadership", count: 19, trend: "stable" as const },
  ];

  const popularTags = [
    "AI", "Machine Learning", "Blockchain", "ESG", "Innovation",
    "Leadership", "Strategy", "Digital", "Sustainability", "Future"
  ];

  return (
    <HomepageAdLayout
      sidebarContent={
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardDescription className="px-6 pb-6">
            <div className="space-y-2">
              {Object.entries(CATEGORIES).map(([key, category]) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </CardDescription>
        </Card>
      }
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 transition-colors rounded-lg mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  NeuraDock
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Your comprehensive knowledge hub for insights on Finance, Technology, Education, and Business.
                Stay informed with expert analysis and cutting-edge perspectives.
              </p>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" className="text-lg px-8 btn-hover-lift" asChild>
                  <Link href="/technology">
                    Explore Articles
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="text-lg px-8 btn-hover-lift" asChild>
                  <Link href="/showcase">
                    <Zap className="mr-2 h-5 w-5" />
                    View Showcase
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Explore Our Categories</h2>
          <p className="text-lg text-muted-foreground">
            Dive deep into specialized knowledge areas curated by industry experts
          </p>
        </div>

        <StaggeredFadeIn
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          staggerDelay={150}
        >
          {Object.entries(CATEGORIES).map(([key, category]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <Link key={key} href={`/${key}`}>
                <Card hover interactive className="h-full group">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription className="text-center">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </StaggeredFadeIn>
      </section>

      {/* Content Ad */}
      <BetweenContentAd slot={2} />

      {/* Featured Articles Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Articles</h2>
          <p className="text-lg text-muted-foreground">
            Latest insights and expert analysis from our knowledge base
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
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
      </section>

      {/* Content Ad */}
      <ContentAd slot={3} />

      {/* Content Discovery Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span>Discover More</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore trending topics and discover new content tailored to your interests
            </p>
          </FadeIn>
        </div>

        <div className="max-w-4xl mx-auto">
          <ContentDiscovery
            trendingTopics={trendingTopics}
            popularTags={popularTags}
          />
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </HomepageAdLayout>
  );
}
