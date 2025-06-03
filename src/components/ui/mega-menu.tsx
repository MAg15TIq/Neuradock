"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Star, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ArticleMetadata } from "@/types/article";

interface MegaMenuCategory {
  id: string;
  name: string;
  description: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  subcategories?: {
    id: string;
    name: string;
    href: string;
    description?: string;
  }[];
  featuredArticles?: ArticleMetadata[];
  quickLinks?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface MegaMenuProps {
  categories: MegaMenuCategory[];
  className?: string;
  trigger?: React.ReactNode;
}

export function MegaMenu({ categories, className, trigger }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(categoryId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setIsOpen(false);
    }, 150);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setIsOpen(false);
    }, 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const activeMenu = categories.find(cat => cat.id === activeCategory);

  return (
    <div className={cn("relative", className)}>
      {/* Navigation Items */}
      <div className="flex items-center space-x-1">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(category.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={category.href}
              className={cn(
                "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-muted hover:text-foreground",
                activeCategory === category.id && "bg-muted text-foreground"
              )}
            >
              {category.icon && <category.icon className="h-4 w-4" />}
              <span>{category.name}</span>
              <ChevronDown className="h-3 w-3" />
            </Link>
          </div>
        ))}
        
        {trigger && (
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={handleMouseLeave}
          >
            {trigger}
          </div>
        )}
      </div>

      {/* Mega Menu Panel */}
      {isOpen && activeMenu && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 right-0 mt-1 z-50"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <Card className="shadow-xl border-border/50 bg-background/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Category Info */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center space-x-2">
                        {activeMenu.icon && <activeMenu.icon className="h-5 w-5" />}
                        <span>{activeMenu.name}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activeMenu.description}
                      </p>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={activeMenu.href} className="flex items-center justify-center">
                        View All {activeMenu.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    {/* Quick Links */}
                    {activeMenu.quickLinks && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          Quick Access
                        </h4>
                        {activeMenu.quickLinks.map((link, index) => (
                          <Link
                            key={index}
                            href={link.href}
                            className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                          >
                            {link.icon && <link.icon className="h-4 w-4" />}
                            <span>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                {activeMenu.subcategories && (
                  <div className="lg:col-span-1">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {activeMenu.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          className="block p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="font-medium text-sm">{sub.name}</div>
                          {sub.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {sub.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Articles */}
                {activeMenu.featuredArticles && (
                  <div className="lg:col-span-2">
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Featured Articles</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeMenu.featuredArticles.slice(0, 4).map((article) => (
                        <FeaturedArticleCard key={article.slug} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Featured article card for mega menu
interface FeaturedArticleCardProps {
  article: ArticleMetadata;
}

function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className="block p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
    >
      <div className="space-y-2">
        <h5 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h5>
        
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span className="capitalize">{article.category}</span>
          </div>
        </div>

        {article.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {article.description}
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// Responsive mega menu for mobile
interface MobileMegaMenuProps {
  categories: MegaMenuCategory[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMegaMenu({ categories, isOpen, onClose }: MobileMegaMenuProps) {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <span className="sr-only">Close menu</span>
            ×
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <button
                onClick={() => 
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {category.icon && <category.icon className="h-5 w-5" />}
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedCategory === category.id && "rotate-180"
                  )}
                />
              </button>

              {expandedCategory === category.id && (
                <div className="pl-4 space-y-2">
                  <Link
                    href={category.href}
                    onClick={onClose}
                    className="block p-2 text-sm hover:bg-muted rounded-md"
                  >
                    View All {category.name}
                  </Link>

                  {category.subcategories?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={sub.href}
                      onClick={onClose}
                      className="block p-2 text-sm hover:bg-muted rounded-md"
                    >
                      {sub.name}
                    </Link>
                  ))}

                  {category.quickLinks?.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center space-x-2 p-2 text-sm hover:bg-muted rounded-md"
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
