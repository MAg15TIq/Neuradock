"use client";

import { Suspense } from "react";
import { SearchClient } from "./search-client";
import type { ArticleMetadata } from "@/types/article";

interface SearchWrapperProps {
  articles: ArticleMetadata[];
  tags: string[];
}

export function SearchWrapper({ articles, tags }: SearchWrapperProps) {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading search...</p>
      </div>
    }>
      <SearchClient articles={articles} tags={tags} />
    </Suspense>
  );
}
