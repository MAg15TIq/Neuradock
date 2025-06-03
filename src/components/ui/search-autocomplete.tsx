"use client"

import * as React from "react"
import { Search, Clock, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ArticleMetadata } from "@/types/article"

interface SearchAutocompleteProps {
  articles?: ArticleMetadata[]
  placeholder?: string
  className?: string
  onSelect?: (article: ArticleMetadata) => void
}

export function SearchAutocomplete({
  articles = [],
  placeholder = "Search articles...",
  className,
  onSelect,
}: SearchAutocompleteProps) {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  // Filter articles based on query
  const filteredArticles = React.useMemo(() => {
    if (!query.trim()) return []
    
    return articles
      .filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        article.author.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8) // Limit to 8 results
  }, [articles, query])

  const handleSelect = React.useCallback((article: ArticleMetadata) => {
    setQuery("")
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(article)
    router.push(`/${article.category}/${article.slug}`)
  }, [onSelect, router])

  const handleSearch = React.useCallback(() => {
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }, [query, router])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < filteredArticles.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && filteredArticles[selectedIndex]) {
            handleSelect(filteredArticles[selectedIndex])
          } else if (query.trim()) {
            handleSearch()
          }
          break
        case "Escape":
          setIsOpen(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredArticles, query, handleSearch, handleSelect])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <Card
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg border"
        >
          {filteredArticles.length > 0 ? (
            <div className="p-2">
              {filteredArticles.map((article, index) => (
                <button
                  key={`${article.category}-${article.slug}`}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-colors hover:bg-accent",
                    selectedIndex === index && "bg-accent"
                  )}
                  onClick={() => handleSelect(article)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1 text-foreground">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary">
                          {article.category}
                        </span>
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime} min</span>
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Show all results link */}
              <div className="border-t mt-2 pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search for "{query}" in all articles
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No articles found for "{query}"</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={handleSearch}
              >
                Search anyway
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
