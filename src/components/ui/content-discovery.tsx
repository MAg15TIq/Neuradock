"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, Clock, User, Tag, ArrowRight, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/animations";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
  tags: string[];
}

interface TrendingTopic {
  name: string;
  count: number;
  trend: "up" | "down" | "stable";
}

interface ContentDiscoveryProps {
  relatedArticles?: Article[];
  trendingTopics?: TrendingTopic[];
  popularTags?: string[];
  className?: string;
}

export function ContentDiscovery({
  relatedArticles = [],
  trendingTopics = [],
  popularTags = [],
  className
}: ContentDiscoveryProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                <span>Related Articles</span>
              </CardTitle>
              <CardDescription>
                Continue exploring with these related topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedArticles.slice(0, 5).map((article, index) => (
                  <RelatedArticleCard key={article.slug} article={article} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <FadeIn delay={200}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Trending Topics</span>
              </CardTitle>
              <CardDescription>
                What's popular in the community right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trendingTopics.map((topic, index) => (
                  <TrendingTopicCard key={topic.name} topic={topic} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <FadeIn delay={400}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-primary" />
                <span>Popular Tags</span>
              </CardTitle>
              <CardDescription>
                Explore content by popular topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="inline-block"
                  >
                    <Badge
                      variant="secondary"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}

function RelatedArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <FadeIn delay={index * 100}>
      <Link
        href={`/${article.category}/${article.slug}`}
        className="block p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {article.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.readTime}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

function TrendingTopicCard({ topic, index }: { topic: TrendingTopic; index: number }) {
  const trendIcons = {
    up: "↗",
    down: "↘",
    stable: "→"
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    stable: "text-muted-foreground"
  };

  return (
    <FadeIn delay={index * 50}>
      <Link
        href={`/search?q=${encodeURIComponent(topic.name)}`}
        className="block p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm group-hover:text-primary transition-colors">
              {topic.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {topic.count} articles
            </p>
          </div>
          <div className={cn("text-lg", trendColors[topic.trend])}>
            {trendIcons[topic.trend]}
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

interface QuickActionsProps {
  articleUrl: string;
  articleTitle: string;
  className?: string;
}

export function QuickActions({ articleUrl, articleTitle, className }: QuickActionsProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to localStorage or send to an API
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url: articleUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(articleUrl);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={cn(
          "transition-colors",
          isBookmarked ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
        <span className="sr-only">Bookmark</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-muted-foreground hover:text-primary"
      >
        <Share2 className="h-4 w-4" />
        <span className="sr-only">Share</span>
      </Button>
    </div>
  );
}
