"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { CATEGORIES } from "@/types/article";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <nav className={cn(
      "bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-200",
      isScrolled ? "shadow-lg border-border/50" : "shadow-sm border-border"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NeuraDock</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>

            {Object.entries(CATEGORIES).map(([key, category]) => (
              <Link
                key={key}
                href={`/${key}`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(`/${key}`) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              )}
            >
              About
            </Link>
          </div>

          {/* Search, Theme Toggle, and Contact Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {showSearch ? (
              <SearchAutocomplete
                placeholder="Search articles..."
                className="w-64"
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                data-search-trigger
                title="Search (Ctrl+K)"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            )}
            <ThemeToggle />
            <Button variant="default" size="sm" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border animate-in slide-in-from-top-2 duration-200">
              <Link
                href="/"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActive("/")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={closeMobileMenu}
              >
                Home
              </Link>

              {Object.entries(CATEGORIES).map(([key, category]) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(`/${key}`)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  onClick={closeMobileMenu}
                >
                  {category.name}
                </Link>
              ))}

              <Link
                href="/about"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActive("/about")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={closeMobileMenu}
              >
                About
              </Link>

              <Link
                href="/search"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                <Search className="h-4 w-4 inline mr-2" />
                Search
              </Link>

              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
