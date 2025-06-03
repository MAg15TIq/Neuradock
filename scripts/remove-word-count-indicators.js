#!/usr/bin/env node

/**
 * Remove Word Count Indicators Script
 * Removes word count indicators from section headings in all articles
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

// Check if article has word count indicators
function hasWordCountIndicators(content) {
  const patterns = [
    /## Introduction \(\d+-\d+ words\)/,
    /## What Is .* \(\d+-\d+ words\)/,
    /## Importance\/Benefits .* \(\d+-\d+ words\)/,
    /## How to .* \(\d+-\d+ words\)/,
    /## Common Mistakes .* \(\d+-\d+ words\)/,
    /## Conclusion \(\d+-\d+ words\)/
  ];
  
  return patterns.some(pattern => pattern.test(content));
}

// Remove word count indicators from content
function removeWordCountIndicators(content) {
  let updatedContent = content;

  // Define replacement patterns - more specific and flexible
  const replacements = [
    {
      pattern: /## Introduction \(\d+-\d+ words\)/g,
      replacement: '## Introduction'
    },
    {
      pattern: /## What Is ([^(]*?)\s*\(\d+-\d+ words\)/g,
      replacement: '## What Is $1'
    },
    {
      pattern: /## Importance\/Benefits of ([^(]*?)\s*\(\d+-\d+ words\)/g,
      replacement: '## Importance/Benefits of $1'
    },
    {
      pattern: /## How to ([^(]*?)\s*\(\d+-\d+ words\)/g,
      replacement: '## How to $1'
    },
    {
      pattern: /## Common Mistakes and FAQs \(\d+-\d+ words\)/g,
      replacement: '## Common Mistakes and FAQs'
    },
    {
      pattern: /## Conclusion \(\d+-\d+ words\)/g,
      replacement: '## Conclusion'
    }
  ];

  // Apply all replacements
  for (const { pattern, replacement } of replacements) {
    updatedContent = updatedContent.replace(pattern, replacement);
  }

  return updatedContent;
}

// Main function to scan and update articles
async function removeWordCountFromArticles() {
  console.log('🚀 Starting word count indicator removal process...\n');

  const articles = getArticlesList();
  console.log(`📄 Found ${articles.length} articles to scan\n`);

  let updateCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      console.log(`📝 Processing: ${article.category}/${article.slug}`);

      // Read article content
      const content = fs.readFileSync(article.path, 'utf8');
      
      // Check if article has word count indicators
      if (!hasWordCountIndicators(content)) {
        console.log(`   ✅ No word count indicators found, skipping\n`);
        skipCount++;
        continue;
      }

      console.log(`   🔧 Found word count indicators, removing...`);

      // Remove word count indicators
      const updatedContent = removeWordCountIndicators(content);
      
      // Write back to file
      fs.writeFileSync(article.path, updatedContent, 'utf8');
      
      console.log(`   ✅ Word count indicators removed successfully\n`);
      updateCount++;

    } catch (error) {
      console.log(`   ❌ Error processing article: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Word count indicator removal process completed!`);
  console.log(`✅ Successfully updated: ${updateCount} articles`);
  console.log(`⚠️  Skipped (no indicators): ${skipCount} articles`);
  console.log(`❌ Errors encountered: ${errorCount} articles`);
}

// Run the script
if (require.main === module) {
  removeWordCountFromArticles().catch(console.error);
}

module.exports = {
  removeWordCountFromArticles,
  getArticlesList,
  hasWordCountIndicators,
  removeWordCountIndicators
};
