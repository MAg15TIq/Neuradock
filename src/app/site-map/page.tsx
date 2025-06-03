import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map, FileText, Users, Shield, Phone, Search, Home, BookOpen, TrendingUp, GraduationCap, Briefcase } from "lucide-react";
import { FadeIn, StaggeredFadeIn } from "@/components/ui/animations";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const metadata: Metadata = {
  title: "Site Map - NeuraDock Knowledge Hub",
  description: "Complete site map of NeuraDock. Find all our articles, pages, and resources on Finance, Technology, Education, and Business.",
  keywords: ["site map", "neuradock pages", "site navigation", "all articles", "content map"],
  openGraph: {
    title: "Site Map - NeuraDock Knowledge Hub",
    description: "Complete site map showing all NeuraDock pages and articles across Finance, Technology, Education, and Business.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Site Map - NeuraDock",
    description: "Complete site map of all NeuraDock pages and content.",
  },
};

export default function SitemapPage() {
  const allArticles = getAllArticles();
  const articlesByCategory = {
    finance: allArticles.filter(article => article.category === 'finance'),
    technology: allArticles.filter(article => article.category === 'technology'),
    education: allArticles.filter(article => article.category === 'education'),
    business: allArticles.filter(article => article.category === 'business'),
  };

  const staticPages = [
    { href: "/", title: "Home", icon: Home, description: "Welcome to NeuraDock Knowledge Hub" },
    { href: "/about", title: "About Us", icon: Users, description: "Learn about our mission and founder Malik Mohsin Saleem Khan" },
    { href: "/contact", title: "Contact", icon: Phone, description: "Get in touch with our team" },
    { href: "/search", title: "Search", icon: Search, description: "Search all articles and content" },
    { href: "/privacy", title: "Privacy Policy", icon: Shield, description: "Our privacy practices and data protection" },
    { href: "/terms", title: "Terms of Service", icon: FileText, description: "Terms and conditions for using NeuraDock" },
  ];

  const categoryIcons = {
    finance: TrendingUp,
    technology: BookOpen,
    education: GraduationCap,
    business: Briefcase,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Map className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Site Map</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete navigation of all pages and content on NeuraDock. Find everything from articles to resources.
          </p>
        </FadeIn>

        {/* Static Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Main Pages</h2>
          <StaggeredFadeIn
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            staggerDelay={100}
          >
            {staticPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link key={page.href} href={page.href}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 group">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {page.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {page.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </StaggeredFadeIn>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CATEGORIES).map(([key, category]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              const articleCount = articlesByCategory[key as keyof typeof articlesByCategory].length;
              
              return (
                <Link key={key} href={`/${key}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 group h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-2">{category.description}</p>
                      <p className="text-sm font-medium text-primary">
                        {articleCount} article{articleCount !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Articles by Category */}
        {Object.entries(articlesByCategory).map(([categoryKey, articles]) => {
          const category = CATEGORIES[categoryKey as keyof typeof CATEGORIES];
          const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons];
          
          if (articles.length === 0) return null;

          return (
            <div key={categoryKey} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  {category.name} Articles ({articles.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                  <Link key={article.slug} href={`/${categoryKey}/${article.slug}`}>
                    <Card className="hover:shadow-md transition-all duration-200 hover:scale-102 group">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{article.author}</span>
                          <span>{article.readTime} min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-muted-foreground mb-6">
                Use our search feature to find specific articles or topics across all categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/search" className="flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    Search Articles
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact" className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
