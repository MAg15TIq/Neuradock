"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from "@/types/article";
import { Search, Clock, User, Tag } from "lucide-react";
import type { ArticleMetadata } from "@/types/article";

interface SearchClientProps {
  articles: ArticleMetadata[];
  tags: string[];
}

export function SearchClient({ articles, tags }: SearchClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ArticleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  // Initialize search query from URL params after component mounts
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q') || '';
      setSearchQuery(query);
    }
  }, []);

  const performSearch = useCallback((query: string) => {
    setIsLoading(true);

    // Simple search implementation
    const filtered = articles.filter(article => {
      const matchesQuery =
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        article.author.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || article.tags.includes(selectedTag);

      return matchesQuery && matchesCategory && matchesTag;
    });

    setSearchResults(filtered);
    setIsLoading(false);
  }, [articles, selectedCategory, selectedTag]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading search...</p>
      </div>
    );
  }

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, authors..."
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent text-lg transition-colors"
            />
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-input rounded-md px-3 py-1 text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground">Tag:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-input rounded-md px-3 py-1 text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Searching...</p>
        </div>
      ) : searchQuery.trim() ? (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Search Results for &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-muted-foreground mt-1">
              {searchResults.length} {searchResults.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((article) => (
                <Link key={`${article.category}-${article.slug}`} href={`/${article.category}/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORIES[article.category].color}`}>
                          {CATEGORIES[article.category].name}
                        </span>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime} min
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                      <CardDescription className="text-sm">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </div>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      {article.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{article.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">Start your search</h3>
          <p className="text-muted-foreground">Enter keywords to find relevant articles</p>
        </div>
      )}
    </>
  );
}


