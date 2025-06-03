#!/usr/bin/env node

/**
 * Image Status Script
 * Shows the current status of article images and metadata
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
      // Check if file is corrupted (too small or contains HTML)
      const stats = fs.statSync(imagePath);
      if (stats.size < 100) { // Files smaller than 100 bytes are likely corrupted
        console.log(`   ⚠️  Warning: ${article.slug}${ext} appears corrupted (${stats.size} bytes)`);
        return null;
      }

      // Check if file contains HTML (indicating 404 error)
      try {
        const content = fs.readFileSync(imagePath, 'utf8');
        if (content.includes('<html>') || content.includes('404')) {
          console.log(`   ⚠️  Warning: ${article.slug}${ext} contains HTML error page`);
          return null;
        }
      } catch (e) {
        // Binary file, which is expected for images
      }

      return `/images/articles/${article.category}/${article.slug}${ext}`;
    }
  }

  return null;
}

// Check if article has hero image metadata
function hasHeroImageMetadata(articlePath) {
  const content = fs.readFileSync(articlePath, 'utf8');
  return content.includes('heroImage:');
}

// Get image file size
function getImageSize(imagePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const stats = fs.statSync(fullPath);
    return (stats.size / 1024).toFixed(1) + ' KB';
  } catch {
    return 'Unknown';
  }
}

// Main status function
function showImageStatus() {
  console.log('🖼️  Article Image System Status Report\n');
  console.log('=' .repeat(60));

  const articles = getArticlesList();
  const stats = {
    total: articles.length,
    withImages: 0,
    withMetadata: 0,
    withBoth: 0,
    byCategory: {
      finance: { total: 0, withImages: 0, withMetadata: 0 },
      technology: { total: 0, withImages: 0, withMetadata: 0 },
      education: { total: 0, withImages: 0, withMetadata: 0 },
      business: { total: 0, withImages: 0, withMetadata: 0 }
    }
  };

  console.log('\n📊 Overall Statistics:');
  console.log(`Total Articles: ${articles.length}`);

  console.log('\n📁 Category Breakdown:');
  
  for (const category of Object.keys(stats.byCategory)) {
    const categoryArticles = articles.filter(a => a.category === category);
    stats.byCategory[category].total = categoryArticles.length;
    
    console.log(`\n${category.toUpperCase()} (${categoryArticles.length} articles):`);
    console.log('-'.repeat(40));

    for (const article of categoryArticles) {
      const hasImage = getHeroImagePath(article) !== null;
      const hasMetadata = hasHeroImageMetadata(article.path);
      const imagePath = getHeroImagePath(article);
      
      if (hasImage) {
        stats.withImages++;
        stats.byCategory[category].withImages++;
      }
      
      if (hasMetadata) {
        stats.withMetadata++;
        stats.byCategory[category].withMetadata++;
      }
      
      if (hasImage && hasMetadata) {
        stats.withBoth++;
      }

      const status = hasImage && hasMetadata ? '✅' : 
                    hasImage ? '🖼️ ' : 
                    hasMetadata ? '📝' : '❌';
      
      const imageInfo = hasImage ? ` (${getImageSize(imagePath)})` : '';
      
      console.log(`  ${status} ${article.slug}${imageInfo}`);
    }

    console.log(`  Summary: ${stats.byCategory[category].withImages}/${categoryArticles.length} with images`);
  }

  console.log('\n📈 Summary Statistics:');
  console.log('-'.repeat(40));
  console.log(`✅ Articles with images: ${stats.withImages}/${stats.total} (${(stats.withImages/stats.total*100).toFixed(1)}%)`);
  console.log(`📝 Articles with metadata: ${stats.withMetadata}/${stats.total} (${(stats.withMetadata/stats.total*100).toFixed(1)}%)`);
  console.log(`🎯 Complete (image + metadata): ${stats.withBoth}/${stats.total} (${(stats.withBoth/stats.total*100).toFixed(1)}%)`);

  console.log('\n🎨 Image Directory Status:');
  console.log('-'.repeat(40));
  
  const imageDir = path.join(process.cwd(), 'public', 'images', 'articles');
  if (fs.existsSync(imageDir)) {
    let totalImages = 0;
    let totalSize = 0;
    
    for (const category of Object.keys(stats.byCategory)) {
      const categoryDir = path.join(imageDir, category);
      if (fs.existsSync(categoryDir)) {
        const images = fs.readdirSync(categoryDir).filter(file => 
          ['.jpg', '.jpeg', '.png', '.webp'].some(ext => file.endsWith(ext))
        );
        totalImages += images.length;
        
        let categorySize = 0;
        for (const image of images) {
          try {
            const stats = fs.statSync(path.join(categoryDir, image));
            categorySize += stats.size;
          } catch {}
        }
        totalSize += categorySize;
        
        console.log(`  ${category}: ${images.length} images (${(categorySize/1024).toFixed(1)} KB)`);
      } else {
        console.log(`  ${category}: Directory not found`);
      }
    }
    
    console.log(`  Total: ${totalImages} images (${(totalSize/1024).toFixed(1)} KB)`);
  } else {
    console.log('  ❌ Image directory not found');
  }

  console.log('\n🚀 Next Steps:');
  console.log('-'.repeat(40));
  
  if (stats.withBoth === stats.total) {
    console.log('  🎉 All articles have images and metadata!');
    console.log('  ✨ Your image system is fully configured.');
  } else {
    console.log('  📥 To add images to remaining articles:');
    console.log('     1. Get API keys from Pexels and Unsplash');
    console.log('     2. Set PEXELS_API_KEY and UNSPLASH_ACCESS_KEY in .env.local');
    console.log('     3. Run: npm run download-images');
    console.log('     4. Run: npm run update-metadata');
    console.log('');
    console.log('  🎯 Or add more demo images:');
    console.log('     1. Edit scripts/demo-image-setup.js');
    console.log('     2. Add more sample images');
    console.log('     3. Run: npm run demo-images');
  }

  console.log('\n📚 Documentation:');
  console.log('  📖 See docs/IMAGE_SYSTEM.md for complete documentation');
  console.log('  🔧 Run npm run demo-images for sample setup');
  
  console.log('\n' + '='.repeat(60));
}

// Run the script
if (require.main === module) {
  showImageStatus();
}

module.exports = {
  showImageStatus,
  getArticlesList,
  getHeroImagePath,
  hasHeroImageMetadata
};
