"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FadeIn, StaggeredFadeIn } from "@/components/ui/animations";
import { InfiniteScroll, useInfiniteScroll } from "@/components/ui/infinite-scroll";
import { Skeleton, SkeletonCard, SkeletonArticleCard, SkeletonText } from "@/components/ui/skeleton";
import { PullToRefresh, SwipeNavigation, PinchToZoomImage } from "@/components/ui/touch-gestures";
import { AdvancedSearch } from "@/components/ui/advanced-search";
import { ImageGallery } from "@/components/ui/image-gallery";
import { ArrowLeft, Image as ImageIcon, Zap, Accessibility, Smartphone, Palette, Search, RefreshCw, Eye } from "lucide-react";
import { ClientTimeDisplay } from "@/components/ui/client-date-display";

// Mock data for infinite scroll demo
interface MockArticle {
  id: number;
  title: string;
  description: string;
  category: string;
  readTime: number;
  author: string;
}

const generateMockArticles = (page: number, perPage: number = 6): MockArticle[] => {
  const articles: MockArticle[] = [];
  const startId = (page - 1) * perPage + 1;

  for (let i = 0; i < perPage; i++) {
    articles.push({
      id: startId + i,
      title: `Article ${startId + i}: Advanced Features Demo`,
      description: `This is a sample article demonstrating our new performance optimizations and advanced UI patterns. Article ${startId + i} showcases the infinite scroll functionality.`,
      category: ["Technology", "Performance", "UI/UX", "Accessibility"][i % 4],
      readTime: Math.floor(Math.random() * 10) + 3,
      author: ["Sarah Chen", "Michael Rodriguez", "Dr. Emily Watson", "David Kim"][i % 4],
    });
  }

  return articles;
};

// Mock fetch function for infinite scroll
const fetchArticles = async (page: number): Promise<{ items: MockArticle[]; hasMore: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const articles = generateMockArticles(page);
  const hasMore = page < 5; // Limit to 5 pages for demo
  
  return { items: articles, hasMore };
};

export default function ShowcasePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSkeletons, setShowSkeletons] = React.useState(false);
  const [currentDemo, setCurrentDemo] = React.useState(0);

  const {
    items: articles,
    hasMore,
    isLoading: infiniteLoading,
    error,
    loadMore,
    refresh,
  } = useInfiniteScroll(fetchArticles);

  // Mock articles for search demo
  const mockArticles = [
    {
      slug: "ai-revolution",
      title: "The AI Revolution in Modern Technology",
      description: "Exploring how artificial intelligence is transforming industries",
      category: "technology" as const,
      publishedAt: "2024-01-15",
      author: "Tech Expert",
      readTime: 5,
      tags: ["AI", "Technology", "Innovation"]
    },
    {
      slug: "sustainable-investing",
      title: "Sustainable Investing: The Future of Finance",
      description: "How ESG factors are reshaping investment strategies",
      category: "finance" as const,
      publishedAt: "2024-01-10",
      author: "Finance Analyst",
      readTime: 7,
      tags: ["ESG", "Investing", "Sustainability"]
    }
  ];

  // Sample images for gallery
  const galleryImages = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600",
      alt: "Technology workspace",
      title: "Modern Technology",
      description: "A glimpse into the future of work",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150"
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600",
      alt: "Data visualization",
      title: "Data Analytics",
      description: "Visualizing complex data patterns",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150"
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600",
      alt: "Business analytics",
      title: "Business Intelligence",
      description: "Making data-driven decisions",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150"
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleSearch = (query: string, filters: unknown[]) => {
    console.log("Search:", query, "Filters:", filters);
  };

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons);
  };

  const demos = [
    "Overview",
    "Skeleton Loading",
    "Touch Gestures",
    "Advanced Search",
    "Image Gallery",
    "Infinite Scroll"
  ];

  const features = [
    {
      icon: Zap,
      title: "Performance Optimizations",
      description: "Skeleton loading, image optimization, progressive loading, and error boundaries",
      items: ["Optimized images with lazy loading", "Progressive image loading", "Enhanced skeleton states", "Comprehensive error boundaries"]
    },
    {
      icon: Accessibility,
      title: "Advanced Accessibility", 
      description: "Skip links, keyboard shortcuts, enhanced ARIA support, and focus management",
      items: ["Skip to main content (Tab to see)", "Keyboard shortcuts (Ctrl+K for search)", "Enhanced screen reader support", "Proper focus management"]
    },
    {
      icon: Smartphone,
      title: "Mobile Experience",
      description: "Touch gestures, pull-to-refresh, mobile-optimized layouts, and responsive design",
      items: ["Touch-friendly interactions", "Responsive image sets", "Mobile-optimized navigation", "Swipe-friendly components"]
    },
    {
      icon: Palette,
      title: "Advanced UI Patterns",
      description: "Infinite scroll, advanced animations, interactive components, and modern design",
      items: ["Infinite scroll (see below)", "Staggered animations", "Interactive hover effects", "Progressive enhancement"]
    }
  ];

  return (
    <ErrorBoundary>
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

          {/* Hero Section */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">Phase 3: Advanced Features Showcase</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the comprehensive Phase 3 implementation including skeleton loading, touch gestures,
              advanced search, image galleries, and performance optimizations.
            </p>
          </FadeIn>

          {/* Demo Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-2 bg-muted rounded-lg p-1">
              {demos.map((demo, index) => (
                <Button
                  key={demo}
                  variant={currentDemo === index ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentDemo(index)}
                  className="transition-all"
                >
                  {demo}
                </Button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <div className="space-y-12">
            {/* Overview */}
            {currentDemo === 0 && (
              <StaggeredFadeIn className="space-y-8">
                {[
                <div key="overview-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                ]}
              </StaggeredFadeIn>
            )}

            {/* Skeleton Loading Demo */}
            {currentDemo === 1 && (
              <StaggeredFadeIn className="space-y-8">
                {[
                <Card key="skeleton-demo">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Skeleton Loading System</span>
                    </CardTitle>
                    <CardDescription>
                      Comprehensive skeleton components for better loading states
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Button onClick={toggleSkeletons}>
                        {showSkeletons ? "Hide" : "Show"} Skeletons
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Toggle to see skeleton loading states
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {showSkeletons ? (
                        <>
                          <SkeletonCard />
                          <SkeletonArticleCard />
                          <SkeletonCard hasImage={false} />
                        </>
                      ) : (
                        <>
                          <Card>
                            <CardHeader>
                              <CardTitle>Sample Card</CardTitle>
                              <CardDescription>
                                This is a regular card with content
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p>Content loaded successfully!</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle>Article Preview</CardTitle>
                              <CardDescription>
                                A sample article card
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p>Article content is ready to read.</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle>Text Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>Multiple lines of text content that would normally take time to load.</p>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Text Skeletons</h3>
                      {showSkeletons ? (
                        <SkeletonText lines={3} />
                      ) : (
                        <div className="space-y-2">
                          <p>This is the first line of actual content.</p>
                          <p>Here's the second line with more information.</p>
                          <p>And finally, the third line completes the content.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                ]}
              </StaggeredFadeIn>
            )}

            {/* Touch Gestures Demo */}
            {currentDemo === 2 && (
              <StaggeredFadeIn className="space-y-8">
                {[
                <Card key="touch-gestures">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5" />
                      <span>Touch Gestures</span>
                    </CardTitle>
                    <CardDescription>
                      Pull-to-refresh, swipe navigation, and pinch-to-zoom
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Pull to Refresh */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pull to Refresh</h3>
                      <PullToRefresh onRefresh={handleRefresh} className="h-64 border rounded-lg">
                        <div className="p-6 space-y-4">
                          <p className="text-center text-muted-foreground">
                            Pull down to refresh this content
                          </p>
                          {isLoading ? (
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p>Content refreshed at: <ClientTimeDisplay /></p>
                              <p>This content updates when you pull to refresh.</p>
                              <p>Try it on mobile for the best experience!</p>
                            </div>
                          )}
                        </div>
                      </PullToRefresh>
                    </div>

                    {/* Swipe Navigation */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Swipe Navigation</h3>
                      <SwipeNavigation
                        onSwipeLeft={() => console.log("Swiped left")}
                        onSwipeRight={() => console.log("Swiped right")}
                        className="h-32 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                      >
                        <div className="flex items-center justify-center h-full">
                          <p className="text-center">
                            Swipe left or right to navigate<br />
                            <span className="text-sm text-muted-foreground">
                              (Check console for events)
                            </span>
                          </p>
                        </div>
                      </SwipeNavigation>
                    </div>

                    {/* Pinch to Zoom */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pinch to Zoom</h3>
                      <div className="max-w-md mx-auto">
                        <PinchToZoomImage
                          src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300"
                          alt="Zoomable image"
                          className="h-64"
                        />
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Pinch to zoom, drag to pan, double-click to toggle zoom
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ]}
              </StaggeredFadeIn>
            )}

            {/* Advanced Search Demo */}
            {currentDemo === 3 && (
              <StaggeredFadeIn className="space-y-8">
                {[
                <Card key="advanced-search">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Advanced Search</span>
                    </CardTitle>
                    <CardDescription>
                      Faceted search with filters, suggestions, and recent searches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="max-w-2xl mx-auto">
                      <AdvancedSearch
                        articles={mockArticles}
                        onSearch={handleSearch}
                        placeholder="Try searching for 'AI' or 'finance'..."
                      />
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Features include:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Real-time search suggestions</li>
                        <li>• Category and tag filters</li>
                        <li>• Recent search history</li>
                        <li>• Advanced filter combinations</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                ]}
              </StaggeredFadeIn>
            )}

            {/* Image Gallery Demo */}
            {currentDemo === 4 && (
              <StaggeredFadeIn className="space-y-8">
                {[
                <Card key="image-gallery">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ImageIcon className="h-5 w-5" />
                      <span>Image Gallery</span>
                    </CardTitle>
                    <CardDescription>
                      Interactive gallery with lightbox, zoom, and navigation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageGallery
                      images={galleryImages}
                      columns={3}
                      aspectRatio="video"
                      showThumbnails={true}
                      enableLightbox={true}
                      enableZoom={true}
                    />

                    <div className="text-center text-sm text-muted-foreground mt-6">
                      <p>Click any image to open the lightbox with:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Full-screen viewing</li>
                        <li>• Zoom and rotation controls</li>
                        <li>• Keyboard navigation (←/→/Esc)</li>
                        <li>• Download and share options</li>
                        <li>• Thumbnail navigation</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                ]}
              </StaggeredFadeIn>
            )}

            {/* Infinite Scroll Demo */}
            {currentDemo === 5 && (
              <StaggeredFadeIn className="space-y-8">
                {[
                <Card key="infinite-scroll">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <RefreshCw className="h-5 w-5" />
                      <span>Infinite Scroll</span>
                    </CardTitle>
                    <CardDescription>
                      Automatic content loading as you scroll
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-8">
                      <Button onClick={refresh} disabled={infiniteLoading}>
                        Reset Demo
                      </Button>
                    </div>

                    <InfiniteScroll
                      items={articles}
                      renderItem={(article) => (
                        <Card key={article.id} className="mb-6 hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{article.title}</CardTitle>
                                <CardDescription className="mt-2">
                                  By {article.author} • {article.readTime} min read • {article.category}
                                </CardDescription>
                              </div>
                              <span className="text-sm text-muted-foreground">#{article.id}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{article.description}</p>
                          </CardContent>
                        </Card>
                      )}
                      loadMore={loadMore}
                      hasMore={hasMore}
                      isLoading={infiniteLoading}
                      error={error}
                      className="max-w-4xl mx-auto"
                    />
                  </CardContent>
                </Card>
                ]}
              </StaggeredFadeIn>
            )}
          </div>

          {/* Feature Summary */}
          <FadeIn>
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Phase 3 Implementation Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Skeleton Loading</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive loading states for better UX
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Touch Gestures</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mobile-optimized interactions
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Advanced Search</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Powerful search with filters
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold">Image Gallery</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Interactive media experiences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Call to Action */}
          <FadeIn className="text-center mt-12">
            <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold mb-4">Phase 3 Complete!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl mb-6 opacity-90">
                  All Phase 3 features have been successfully implemented, enhancing user experience,
                  accessibility, and performance across the entire platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/about" className="flex items-center justify-center">Learn More</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                    <Link href="/" className="flex items-center justify-center">Explore NeuraDock</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </ErrorBoundary>
  );
}
