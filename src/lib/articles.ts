import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, Token } from 'marked';
import { Article, ArticleMetadata } from '@/types/article';

const contentDirectory = path.join(process.cwd(), 'content');

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer to add IDs to headings
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth }: { tokens: Token[], depth: number }) {
  const text = this.parser.parseInline(tokens);
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `<h${depth} id="heading-${id}" class="${getHeadingClasses(depth)}">${text}</h${depth}>`;
};

function getHeadingClasses(level: number): string {
  switch (level) {
    case 1:
      return 'text-3xl font-bold mt-10 mb-6 text-gray-900';
    case 2:
      return 'text-2xl font-bold mt-8 mb-4 text-gray-900';
    case 3:
      return 'text-xl font-semibold mt-6 mb-3 text-gray-900';
    case 4:
      return 'text-lg font-semibold mt-4 mb-2 text-gray-900';
    default:
      return 'font-semibold mt-3 mb-2 text-gray-900';
  }
}

// Function to process markdown content and separate HTML sections
function processMarkdownContent(content: string): string {
  // Find the end of the main markdown content (before author section)
  const authorSectionIndex = content.indexOf('---\n\n## About the Author');
  const commentsSectionIndex = content.indexOf('---\n\n## Comments & Discussion');

  let markdownEndIndex = content.length;

  if (authorSectionIndex !== -1) {
    markdownEndIndex = Math.min(markdownEndIndex, authorSectionIndex);
  }
  if (commentsSectionIndex !== -1) {
    markdownEndIndex = Math.min(markdownEndIndex, commentsSectionIndex);
  }

  // Extract only the main markdown content
  const markdownContent = content.substring(0, markdownEndIndex).trim();

  // Convert markdown to HTML
  const processedMarkdown = marked.parse(markdownContent, { renderer });

  return processedMarkdown as string;
}

export function getArticlesByCategory(category: string): ArticleMetadata[] {
  const categoryPath = path.join(contentDirectory, category);
  
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryPath);
  const articles = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      try {
        const fullPath = path.join(categoryPath, name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug: name.replace(/\.md$/, ''),
          title: data.title,
          description: data.description,
          category: category as 'finance' | 'technology' | 'education' | 'business',
          publishedAt: data.publishedAt,
          author: data.author,
          readTime: data.readTime,
          tags: data.tags || [],
          heroImage: data.heroImage,
          heroImageAlt: data.heroImageAlt
        };
      } catch (error) {
        console.error(`Error parsing file ${name} in category ${category}:`, error);
        throw error;
      }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return articles;
}

export function getAllArticles(): ArticleMetadata[] {
  const categories = ['finance', 'technology', 'education', 'business'];
  const allArticles: ArticleMetadata[] = [];

  categories.forEach(category => {
    const articles = getArticlesByCategory(category);
    allArticles.push(...articles);
  });

  return allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticle(category: string, slug: string): Article | null {
  try {
    const fullPath = path.join(contentDirectory, category, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown content
    const processedContent = processMarkdownContent(content);

    return {
      slug,
      title: data.title,
      description: data.description,
      content: processedContent,
      category: category as 'finance' | 'technology' | 'education' | 'business',
      publishedAt: data.publishedAt,
      author: data.author,
      readTime: data.readTime,
      tags: data.tags || [],
      heroImage: data.heroImage,
      heroImageAlt: data.heroImageAlt
    };
  } catch {
    return null;
  }
}

export function getFeaturedArticles(limit: number = 6): ArticleMetadata[] {
  const allArticles = getAllArticles();
  return allArticles.slice(0, limit);
}

export function searchArticles(
  query: string,
  category?: string,
  tag?: string
): ArticleMetadata[] {
  const allArticles = getAllArticles();

  if (!query.trim() && !category && !tag) {
    return allArticles;
  }

  return allArticles.filter(article => {
    // Search query matching
    const matchesQuery = !query.trim() || (
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
      article.author.toLowerCase().includes(query.toLowerCase())
    );

    // Category filtering
    const matchesCategory = !category || category === 'all' || article.category === category;

    // Tag filtering
    const matchesTag = !tag || tag === 'all' || article.tags.includes(tag);

    return matchesQuery && matchesCategory && matchesTag;
  });
}

export function getArticlesByTag(tag: string): ArticleMetadata[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.tags.includes(tag));
}

export function getAllTags(): string[] {
  const allArticles = getAllArticles();
  const tags = new Set<string>();

  allArticles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export function getRelatedArticles(currentArticle: Article, limit: number = 3): ArticleMetadata[] {
  const allArticles = getAllArticles();

  // Filter out the current article and find related ones
  const otherArticles = allArticles.filter(
    article => !(article.category === currentArticle.category && article.slug === currentArticle.slug)
  );

  // Score articles based on similarity
  const scoredArticles = otherArticles.map(article => {
    let score = 0;

    // Same category gets higher score
    if (article.category === currentArticle.category) {
      score += 3;
    }

    // Shared tags get points
    const sharedTags = article.tags.filter(tag => currentArticle.tags.includes(tag));
    score += sharedTags.length * 2;

    // Same author gets a point
    if (article.author === currentArticle.author) {
      score += 1;
    }

    return { article, score };
  });

  // Sort by score and return top articles
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}
