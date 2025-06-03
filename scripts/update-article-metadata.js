#!/usr/bin/env node

/**
 * Article Metadata Update Script
 * Updates article frontmatter with hero image information
 */

const fs = require('fs');
const path = require('path');

// Get all articles
function getArticlesList() {
  const contentDir = path.join(process.cwd(), 'content');
  const articles = [];
  const categories = ['finance', 'technology', 'education', 'business'];

  for (const category of categories) {
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

// Check if hero image exists for article
function getHeroImagePath(article) {
  const imageExtensions = ['.jpg', '.jpeg', '.webp', '.png'];
  const imageDir = path.join(process.cwd(), 'public', 'images', 'articles', article.category);

  for (const ext of imageExtensions) {
    const imagePath = path.join(imageDir, `${article.slug}${ext}`);
    if (fs.existsSync(imagePath)) {
      return `/images/articles/${article.category}/${article.slug}${ext}`;
    }
  }

  return null;
}

// Generate alt text for hero image
function generateAltText(article, metadata) {
  const title = metadata.title || '';
  const category = article.category;
  
  // Create descriptive alt text
  const categoryNames = {
    finance: 'Financial',
    technology: 'Technology',
    education: 'Educational',
    business: 'Business'
  };
  
  return `${categoryNames[category]} concept illustration for "${title}" - Professional ${category} imagery`;
}

// Update article frontmatter
function updateArticleFrontmatter(articlePath, heroImage, heroImageAlt) {
  const content = fs.readFileSync(articlePath, 'utf8');
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`   ❌ No frontmatter found in ${articlePath}`);
    return false;
  }

  const frontmatterContent = frontmatterMatch[1];
  const restOfContent = content.substring(frontmatterMatch[0].length);

  // Check if heroImage already exists
  if (frontmatterContent.includes('heroImage:')) {
    console.log(`   ✅ Hero image already configured`);
    return true;
  }

  // Add hero image fields to frontmatter
  const updatedFrontmatter = frontmatterContent + 
    `\nheroImage: "${heroImage}"` +
    `\nheroImageAlt: "${heroImageAlt}"`;

  const updatedContent = `---\n${updatedFrontmatter}\n---${restOfContent}`;

  // Write back to file
  fs.writeFileSync(articlePath, updatedContent, 'utf8');
  return true;
}

// Main update function
async function updateArticleMetadata() {
  console.log('🚀 Starting article metadata update process...\n');

  const articles = getArticlesList();
  console.log(`📄 Found ${articles.length} articles to process\n`);

  let updateCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      console.log(`📝 Processing: ${article.category}/${article.slug}`);

      // Check if hero image exists
      const heroImagePath = getHeroImagePath(article);
      
      if (!heroImagePath) {
        console.log(`   ⚠️  No hero image found, skipping\n`);
        skipCount++;
        continue;
      }

      console.log(`   🖼️  Found hero image: ${heroImagePath}`);

      // Get current metadata to generate alt text
      const content = fs.readFileSync(article.path, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      
      if (!frontmatterMatch) {
        console.log(`   ❌ Could not parse frontmatter\n`);
        errorCount++;
        continue;
      }

      const metadata = {};
      frontmatterMatch[1].split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
          metadata[key.trim()] = value;
        }
      });

      // Generate alt text
      const heroImageAlt = generateAltText(article, metadata);

      // Update frontmatter
      const success = updateArticleFrontmatter(article.path, heroImagePath, heroImageAlt);
      
      if (success) {
        console.log(`   ✅ Metadata updated successfully\n`);
        updateCount++;
      } else {
        console.log(`   ❌ Failed to update metadata\n`);
        errorCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error processing article: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Metadata update process completed!`);
  console.log(`✅ Successfully updated: ${updateCount} articles`);
  console.log(`⚠️  Skipped (no image): ${skipCount} articles`);
  console.log(`❌ Errors encountered: ${errorCount} articles`);
}

// Run the script
if (require.main === module) {
  updateArticleMetadata().catch(console.error);
}

module.exports = {
  updateArticleMetadata,
  getArticlesList,
  getHeroImagePath,
  generateAltText
};
