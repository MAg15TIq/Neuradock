import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllArticles } from "@/lib/articles";
import { ArrowLeft } from "lucide-react";
import { SearchWrapper } from "./search-wrapper";

// Force dynamic rendering to avoid SSG issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const allArticles = getAllArticles();
  const allTags = Array.from(new Set(allArticles.flatMap(article => article.tags)));

  return (
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

        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Search Articles</h1>
          <p className="text-xl text-muted-foreground">Find insights across Finance, Technology, Education, and Business</p>
        </div>

        {/* Client Component for Search Functionality */}
        <SearchWrapper articles={allArticles} tags={allTags} />
      </div>
    </div>
  );
}
