export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: 'finance' | 'technology' | 'education' | 'business';
  publishedAt: string;
  author: string;
  readTime: number;
  tags: string[];
  heroImage?: string;
  heroImageAlt?: string;
}

export interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  category: 'finance' | 'technology' | 'education' | 'business';
  publishedAt: string;
  author: string;
  readTime: number;
  tags: string[];
  heroImage?: string;
  heroImageAlt?: string;
}

export const CATEGORIES = {
  finance: {
    name: 'Finance',
    description: 'Financial insights, investment strategies, and market analysis',
    color: 'bg-green-100 text-green-800'
  },
  technology: {
    name: 'Technology',
    description: 'Latest tech trends, innovations, and digital transformation',
    color: 'bg-blue-100 text-blue-800'
  },
  education: {
    name: 'Education',
    description: 'Learning resources, educational insights, and skill development',
    color: 'bg-purple-100 text-purple-800'
  },
  business: {
    name: 'Business',
    description: 'Business strategies, entrepreneurship, and industry insights',
    color: 'bg-orange-100 text-orange-800'
  }
} as const;
