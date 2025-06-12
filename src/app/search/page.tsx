import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllArticles } from "@/lib/articles";
import { SearchAdLayout } from "@/components/layout/ad-layout-wrapper";
import { ArrowLeft, Search, TrendingUp } from "lucide-react";
import { SearchWrapper } from "./search-wrapper";

// Force dynamic rendering to avoid SSG issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const allArticles = getAllArticles();
  const allTags = Array.from(new Set(allArticles.flatMap(article => article.tags)));

  return (
    <SearchAdLayout
      sidebarContent={
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Search Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>{allArticles.length}</strong> total articles
                </div>
                <div>
                  <strong>{allTags.length}</strong> unique tags
                </div>
                <div>
                  <strong>4</strong> categories
                </div>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      }
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center space-x-2">
          <Search className="h-8 w-8" />
          <span>Search Articles</span>
        </h1>
        <p className="text-xl text-muted-foreground">Find insights across Finance, Technology, Education, and Business</p>
      </div>

      {/* Client Component for Search Functionality */}
      <SearchWrapper articles={allArticles} tags={allTags} />
    </SearchAdLayout>
  );
}
