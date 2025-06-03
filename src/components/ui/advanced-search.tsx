"use client";

import React from "react";
import { Search, Filter, X, Clock, Tag, User, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ArticleMetadata } from "@/types/article";

interface SearchFilter {
  id: string;
  label: string;
  type: 'category' | 'tag' | 'author' | 'date';
  options?: string[];
  value?: string | string[];
}

interface AdvancedSearchProps {
  articles: ArticleMetadata[];
  onSearch: (query: string, filters: SearchFilter[]) => void;
  className?: string;
  placeholder?: string;
}

export function AdvancedSearch({
  articles,
  onSearch,
  className,
  placeholder = "Search articles...",
}: AdvancedSearchProps) {
  const [query, setQuery] = React.useState("");
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<SearchFilter[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Load recent searches from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('neuradock-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate suggestions based on query
  React.useEffect(() => {
    if (query.length > 1) {
      const titleSuggestions = articles
        .filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase())
        )
        .map(article => article.title)
        .slice(0, 5);

      const tagSuggestions = articles
        .flatMap(article => article.tags || [])
        .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3);

      setSuggestions([...titleSuggestions, ...tagSuggestions]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, articles]);

  const availableFilters: SearchFilter[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'category',
      options: [...new Set(articles.map(a => a.category))],
    },
    {
      id: 'tags',
      label: 'Tags',
      type: 'tag',
      options: [...new Set(articles.flatMap(a => a.tags || []))],
    },
    {
      id: 'author',
      label: 'Author',
      type: 'author',
      options: [...new Set(articles.map(a => a.author))],
    },
  ];

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        finalQuery,
        ...recentSearches.filter(s => s !== finalQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('neuradock-recent-searches', JSON.stringify(newRecentSearches));
      
      onSearch(finalQuery, activeFilters);
      setShowSuggestions(false);
    }
  };

  const addFilter = (filter: SearchFilter) => {
    setActiveFilters(prev => [...prev, filter]);
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const selectRecentSearch = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          onFocus={() => {
            if (query.length > 1) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={cn(
              "h-7 px-2",
              activeFilters.length > 0 && "text-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            {activeFilters.length > 0 && (
              <span className="ml-1 text-xs">{activeFilters.length}</span>
            )}
          </Button>
          
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setShowSuggestions(false);
              }}
              className="h-7 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
            >
              <span>{filter.label}: {filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
                className="h-4 w-4 p-0 ml-2 hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Suggestions and Recent Searches */}
      {(showSuggestions || (!query && recentSearches.length > 0)) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm"
                  >
                    <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => selectRecentSearch(search)}
                    className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm"
                  >
                    <Clock className="inline h-3 w-3 mr-2 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters Panel */}
      {isFiltersOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableFilters.map((filter) => (
              <FilterSection
                key={filter.id}
                filter={filter}
                onSelect={(value) => addFilter({ ...filter, value })}
                isActive={activeFilters.some(f => f.id === filter.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Filter section component
interface FilterSectionProps {
  filter: SearchFilter;
  onSelect: (value: string) => void;
  isActive: boolean;
}

function FilterSection({ filter, onSelect, isActive }: FilterSectionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getIcon = () => {
    switch (filter.type) {
      case 'category':
        return <Tag className="h-4 w-4" />;
      case 'author':
        return <User className="h-4 w-4" />;
      case 'date':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full p-2 rounded-md border text-sm",
          isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
        )}
      >
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span>{filter.label}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && filter.options && (
        <div className="pl-4 space-y-1 max-h-32 overflow-y-auto">
          {filter.options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
