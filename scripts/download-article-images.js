#!/usr/bin/env node

/**
 * Article Image Download Script
 * Downloads high-quality, topic-relevant images for all articles from Pexels and Unsplash
 * Organizes images by category and optimizes them for web use
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

const IMAGE_CONFIG = {
  width: 1920,
  height: 1080,
  quality: 85,
  format: 'webp'
};

// Article categories and their search keywords
const CATEGORY_KEYWORDS = {
  finance: [
    'finance', 'money', 'investment', 'banking', 'cryptocurrency', 'bitcoin',
    'stock market', 'trading', 'financial planning', 'savings', 'budget',
    'wealth', 'economy', 'business finance', 'portfolio', 'retirement'
  ],
  technology: [
    'technology', 'artificial intelligence', 'AI', 'machine learning',
    'software development', 'programming', 'computer', 'digital',
    'innovation', 'cybersecurity', 'cloud computing', 'blockchain',
    'mobile app', 'web development', 'data analytics', 'automation'
  ],
  education: [
    'education', 'learning', 'study', 'student', 'university', 'school',
    'online learning', 'e-learning', 'training', 'skill development',
    'professional development', 'certification', 'knowledge', 'teaching',
    'academic', 'graduation', 'books', 'classroom'
  ],
  business: [
    'business', 'entrepreneur', 'startup', 'leadership', 'management',
    'team', 'office', 'corporate', 'strategy', 'marketing', 'sales',
    'customer service', 'growth', 'success', 'meeting', 'presentation',
    'networking', 'professional', 'workplace', 'productivity'
  ]
};

// Utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Pexels API functions
async function searchPexelsImages(query, perPage = 10) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.photos || []);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Unsplash API functions
async function searchUnsplashImages(query, perPage = 10) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.results || []);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Get article list from content directory
function getArticlesList() {
  const contentDir = path.join(process.cwd(), 'content');
  const articles = [];

  for (const category of Object.keys(CATEGORY_KEYWORDS)) {
    const categoryPath = path.join(contentDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'))
        .map(file => ({
          category,
          slug: file.replace('.md', ''),
          filename: file,
          path: path.join(categoryPath, file)
        }));
      articles.push(...files);
    }
  }

  return articles;
}

// Extract article metadata
function getArticleMetadata(articlePath) {
  const content = fs.readFileSync(articlePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) return null;

  const frontmatter = {};
  frontmatterMatch[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  });

  return frontmatter;
}

// Generate search query for article
function generateSearchQuery(article, metadata) {
  const categoryKeywords = CATEGORY_KEYWORDS[article.category] || [];
  const title = metadata.title || '';
  const tags = metadata.tags || [];
  
  // Extract key terms from title
  const titleWords = title.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'for', 'with', 'your', 'how', 'what', 'why', 'when', 'where'].includes(word));

  // Combine keywords
  const allKeywords = [...categoryKeywords, ...titleWords, ...tags];
  
  // Return most relevant keywords
  return allKeywords.slice(0, 3).join(' ');
}

// Main download function
async function downloadImagesForArticles() {
  console.log('🚀 Starting article image download process...\n');

  const articles = getArticlesList();
  console.log(`📄 Found ${articles.length} articles to process\n`);

  let downloadCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      console.log(`📝 Processing: ${article.category}/${article.slug}`);

      // Check if image already exists
      const imageDir = path.join(process.cwd(), 'public', 'images', 'articles', article.category);
      const imagePath = path.join(imageDir, `${article.slug}.webp`);
      
      if (fs.existsSync(imagePath)) {
        console.log(`   ✅ Image already exists, skipping\n`);
        continue;
      }

      // Get article metadata
      const metadata = getArticleMetadata(article.path);
      if (!metadata) {
        console.log(`   ❌ Could not parse metadata, skipping\n`);
        errorCount++;
        continue;
      }

      // Generate search query
      const searchQuery = generateSearchQuery(article, metadata);
      console.log(`   🔍 Search query: "${searchQuery}"`);

      // Search for images (try Pexels first, then Unsplash)
      let images = [];
      
      try {
        images = await searchPexelsImages(searchQuery, 5);
        console.log(`   📸 Found ${images.length} images from Pexels`);
      } catch (error) {
        console.log(`   ⚠️  Pexels search failed, trying Unsplash...`);
        try {
          images = await searchUnsplashImages(searchQuery, 5);
          console.log(`   📸 Found ${images.length} images from Unsplash`);
        } catch (unsplashError) {
          console.log(`   ❌ Both image sources failed: ${error.message}`);
          errorCount++;
          continue;
        }
      }

      if (images.length === 0) {
        console.log(`   ❌ No images found for query\n`);
        errorCount++;
        continue;
      }

      // Select the best image (first one for now)
      const selectedImage = images[0];
      let imageUrl;
      
      if (selectedImage.src) {
        // Pexels image
        imageUrl = selectedImage.src.large2x || selectedImage.src.large || selectedImage.src.medium;
      } else if (selectedImage.urls) {
        // Unsplash image
        imageUrl = selectedImage.urls.full || selectedImage.urls.regular;
      }

      if (!imageUrl) {
        console.log(`   ❌ No suitable image URL found\n`);
        errorCount++;
        continue;
      }

      // Download the image
      console.log(`   ⬇️  Downloading image...`);
      const tempPath = path.join(imageDir, `${article.slug}.temp.jpg`);
      
      await downloadFile(imageUrl, tempPath);
      
      // Save the image (rename temp file to final name)
      const finalPath = imagePath.replace('.webp', '.jpg');
      fs.renameSync(tempPath, finalPath);
      console.log(`   ✅ Image downloaded and saved\n`);
      downloadCount++;

      // Rate limiting
      await delay(1000); // 1 second delay between requests

    } catch (error) {
      console.log(`   ❌ Error processing article: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Download process completed!`);
  console.log(`✅ Successfully downloaded: ${downloadCount} images`);
  console.log(`❌ Errors encountered: ${errorCount} articles`);
  console.log(`\n📁 Images saved to: public/images/articles/[category]/`);
}

// Run the script
if (require.main === module) {
  downloadImagesForArticles().catch(console.error);
}

module.exports = {
  downloadImagesForArticles,
  getArticlesList,
  generateSearchQuery
};
