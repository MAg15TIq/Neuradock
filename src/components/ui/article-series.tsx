"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SeriesArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: string;
  order: number;
}

interface ArticleSeriesProps {
  series: {
    id: string;
    title: string;
    description: string;
    articles: SeriesArticle[];
  };
  currentArticleSlug?: string;
  className?: string;
}

export function ArticleSeries({ series, currentArticleSlug, className }: ArticleSeriesProps) {
  const currentIndex = series.articles.findIndex(article => article.slug === currentArticleSlug);
  const previousArticle = currentIndex > 0 ? series.articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < series.articles.length - 1 ? series.articles[currentIndex + 1] : null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Series Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Article Series</CardTitle>
          </div>
          <CardDescription>{series.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {series.articles.map((article, index) => (
              <div
                key={article.slug}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                  article.slug === currentArticleSlug
                    ? "bg-primary/10 border-primary/20"
                    : "hover:bg-muted/50"
                )}
              >
                <Badge variant={article.slug === currentArticleSlug ? "default" : "secondary"}>
                  {index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  {article.slug === currentArticleSlug ? (
                    <div>
                      <p className="font-medium text-sm truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground">Current article</p>
                    </div>
                  ) : (
                    <Link
                      href={`/${article.category}/${article.slug}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <p className="font-medium text-sm truncate hover:text-primary">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{article.readTime} read</p>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {(previousArticle || nextArticle) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previousArticle ? (
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link
                  href={`/${previousArticle.category}/${previousArticle.slug}`}
                  className="block space-y-2"
                >
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                    {previousArticle.title}
                  </h4>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div /> // Empty div for grid alignment
          )}

          {nextArticle && (
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link
                  href={`/${nextArticle.category}/${nextArticle.slug}`}
                  className="block space-y-2"
                >
                  <div className="flex items-center justify-end space-x-2 text-sm text-muted-foreground">
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2 text-right hover:text-primary transition-colors">
                    {nextArticle.title}
                  </h4>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

interface SeriesNavigationProps {
  previousArticle?: SeriesArticle;
  nextArticle?: SeriesArticle;
  className?: string;
}

export function SeriesNavigation({ previousArticle, nextArticle, className }: SeriesNavigationProps) {
  if (!previousArticle && !nextArticle) return null;

  return (
    <div className={cn("flex justify-between items-center py-6 border-t border-border", className)}>
      {previousArticle ? (
        <Link
          href={`/${previousArticle.category}/${previousArticle.slug}`}
          className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group max-w-sm"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Previous</p>
            <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {previousArticle.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextArticle && (
        <Link
          href={`/${nextArticle.category}/${nextArticle.slug}`}
          className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group max-w-sm text-right"
        >
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Next</p>
            <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {nextArticle.title}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </Link>
      )}
    </div>
  );
}
