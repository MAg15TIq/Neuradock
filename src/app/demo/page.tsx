"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggeredFadeIn } from "@/components/ui/animations";
import { ContentDiscovery } from "@/components/ui/content-discovery";
import { ArticleSeries } from "@/components/ui/article-series";
import { ProgressBar, LoadingSpinner, PulseLoader, LoadingState } from "@/components/ui/loading-overlay";
import { ReadingProgress, TableOfContents, EstimatedReadTime, ScrollToTop } from "@/components/ui/reading-progress";
import { SocialShare } from "@/components/ui/social-share";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowLeft, Sparkles, Code, Zap, Eye, BookOpen } from "lucide-react";

export default function DemoPage() {
  const [loadingState, setLoadingState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [progress, setProgress] = React.useState(0);

  // Mock data for demonstrations
  const mockArticles = [
    {
      slug: "ai-revolution",
      title: "The AI Revolution in Modern Technology",
      description: "Exploring how artificial intelligence is transforming industries",
      category: "technology",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      author: "Tech Expert",
      tags: ["AI", "Technology", "Innovation"]
    },
    {
      slug: "sustainable-investing",
      title: "Sustainable Investing: The Future of Finance",
      description: "How ESG factors are reshaping investment strategies",
      category: "finance",
      publishedAt: "2024-01-10",
      readTime: "7 min read",
      author: "Finance Analyst",
      tags: ["ESG", "Investing", "Sustainability"]
    }
  ];

  const mockSeries = {
    id: "ai-fundamentals",
    title: "AI Fundamentals Series",
    description: "A comprehensive guide to understanding artificial intelligence",
    articles: [
      {
        slug: "intro-to-ai",
        title: "Introduction to Artificial Intelligence",
        description: "Understanding the basics of AI and machine learning",
        category: "technology",
        publishedAt: "2024-01-01",
        readTime: "8 min read",
        order: 1
      },
      {
        slug: "machine-learning-basics",
        title: "Machine Learning Fundamentals",
        description: "Core concepts and algorithms in machine learning",
        category: "technology",
        publishedAt: "2024-01-08",
        readTime: "12 min read",
        order: 2
      },
      {
        slug: "deep-learning-intro",
        title: "Deep Learning Introduction",
        description: "Neural networks and deep learning principles",
        category: "technology",
        publishedAt: "2024-01-15",
        readTime: "15 min read",
        order: 3
      }
    ]
  };

  const trendingTopics = [
    { name: "Artificial Intelligence", count: 24, trend: "up" as const },
    { name: "Sustainable Finance", count: 18, trend: "up" as const },
    { name: "Remote Learning", count: 15, trend: "stable" as const },
    { name: "Digital Transformation", count: 21, trend: "up" as const }
  ];

  const popularTags = ["AI", "Machine Learning", "Blockchain", "ESG", "Innovation"];

  const mockHeadings = [
    { id: "introduction", text: "Introduction", level: 2 },
    { id: "key-features", text: "Key Features", level: 2 },
    { id: "performance", text: "Performance Improvements", level: 3 },
    { id: "accessibility", text: "Accessibility Enhancements", level: 3 },
    { id: "conclusion", text: "Conclusion", level: 2 }
  ];

  const handleLoadingDemo = (type: "loading" | "success" | "error") => {
    setLoadingState("loading");
    setTimeout(() => {
      setLoadingState(type);
      setTimeout(() => setLoadingState("idle"), 2000);
    }, 2000);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <ReadingProgress color="primary" />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Demo Features" }
              ]}
            />
            <div className="mt-4">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Section */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 flex items-center justify-center space-x-3">
              <Sparkles className="h-12 w-12 text-primary" />
              <span>Phase 3+ Enhancements Demo</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the latest improvements including enhanced reading experience, content discovery,
              loading states, and advanced UI components.
            </p>
          </FadeIn>

          {/* Demo Sections */}
          <div className="space-y-16">
            {/* Enhanced Reading Experience */}
            <StaggeredFadeIn className="space-y-8">
              {[
              <Card key="reading-experience">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Enhanced Reading Experience</span>
                  </CardTitle>
                  <CardDescription>
                    Table of contents, reading progress, estimated read time, and social sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Table of Contents</h3>
                      <Card className="p-4">
                        <TableOfContents headings={mockHeadings} />
                      </Card>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Reading Tools</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Estimated read time:</span>
                          <EstimatedReadTime content="This is a sample article content for demonstration purposes. It contains multiple paragraphs and sections to show how the read time estimation works." />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reading progress indicator is shown at the top of the page
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Social Sharing</h3>
                      <SocialShare
                        url={currentUrl}
                        title="Phase 3+ Enhancements Demo"
                        description="Explore the latest improvements to NeuraDock"
                        variant="inline"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              ]}
            </StaggeredFadeIn>

            {/* Content Discovery */}
            <StaggeredFadeIn className="space-y-8">
              {[
              <Card key="content-discovery">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Content Discovery</span>
                  </CardTitle>
                  <CardDescription>
                    Trending topics, popular tags, and related content suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentDiscovery
                    relatedArticles={mockArticles}
                    trendingTopics={trendingTopics}
                    popularTags={popularTags}
                  />
                </CardContent>
              </Card>
              ]}
            </StaggeredFadeIn>

            {/* Article Series Navigation */}
            <StaggeredFadeIn className="space-y-8">
              {[
              <Card key="article-series">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Article Series Navigation</span>
                  </CardTitle>
                  <CardDescription>
                    Navigate through article series with progress tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ArticleSeries
                    series={mockSeries}
                    currentArticleSlug="machine-learning-basics"
                  />
                </CardContent>
              </Card>
              ]}
            </StaggeredFadeIn>

            {/* Loading States */}
            <StaggeredFadeIn className="space-y-8">
              {[
              <Card key="loading-states">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Enhanced Loading States</span>
                  </CardTitle>
                  <CardDescription>
                    Various loading indicators and progress bars for better user feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Loading Spinners</h3>
                      <div className="space-y-3">
                        <LoadingSpinner size="sm" text="Small" />
                        <LoadingSpinner size="md" text="Medium" />
                        <LoadingSpinner size="lg" text="Large" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Pulse Loaders</h3>
                      <div className="space-y-3">
                        <PulseLoader count={3} size="sm" />
                        <PulseLoader count={4} size="md" />
                        <PulseLoader count={5} size="lg" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Progress Bar</h3>
                      <div className="space-y-3">
                        <ProgressBar progress={progress} showPercentage />
                        <Button onClick={simulateProgress} size="sm">
                          Simulate Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Loading States Demo</h3>
                    <div className="flex space-x-2 mb-4">
                      <Button onClick={() => handleLoadingDemo("loading")} size="sm">
                        Show Loading
                      </Button>
                      <Button onClick={() => handleLoadingDemo("success")} size="sm">
                        Show Success
                      </Button>
                      <Button onClick={() => handleLoadingDemo("error")} size="sm">
                        Show Error
                      </Button>
                    </div>
                    <LoadingState
                      state={loadingState}
                      onRetry={() => setLoadingState("idle")}
                    />
                  </div>
                </CardContent>
              </Card>
              ]}
            </StaggeredFadeIn>
          </div>

          {/* Call to Action */}
          <FadeIn className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold mb-4">Enhanced User Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl mb-6 opacity-90">
                  These Phase 3+ enhancements provide a more engaging, accessible, and performant experience
                  for all users across the platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/showcase">View All Features</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                    <Link href="/">Explore NeuraDock</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
