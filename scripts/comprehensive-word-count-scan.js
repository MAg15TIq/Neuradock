#!/usr/bin/env node

/**
 * Comprehensive Word Count Indicator Scanner
 * Performs thorough scan of all articles and template to verify complete removal
 */

const fs = require('fs');
const path = require('path');

// Get all articles including template
function getAllFiles() {
  const files = [];
  const categories = ['finance', 'technology', 'education', 'business'];
  
  // Add template file
  const templatePath = path.join(process.cwd(), '@articletemplate.md');
  if (fs.existsSync(templatePath)) {
    files.push({
      category: 'template',
      slug: 'articletemplate',
      filename: '@articletemplate.md',
      path: templatePath
    });
  }

  // Add all article files
  const contentDir = path.join(process.cwd(), 'content');
  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    if (fs.existsSync(categoryPath)) {
      const categoryFiles = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'))
        .map(file => ({
          category,
          slug: file.replace('.md', ''),
          filename: file,
          path: path.join(categoryPath, file)
        }));
      files.push(...categoryFiles);
    }
  }

  return files;
}

// Comprehensive word count indicator detection
function findWordCountIndicators(content, filePath) {
  const lines = content.split('\n');
  const issues = [];
  
  // Enhanced patterns to catch all possible word count indicators
  const patterns = [
    // Standard patterns
    /##\s+.*\(\d+-\d+\s+words?\)/i,
    /##\s+.*\(\d+\s+words?\)/i,
    // Variations with different spacing
    /##\s+.*\(\s*\d+\s*-\s*\d+\s+words?\s*\)/i,
    /##\s+.*\(\s*\d+\s+words?\s*\)/i,
    // Case variations
    /##\s+.*\(\d+-\d+\s+Words?\)/i,
    /##\s+.*\(\d+\s+Words?\)/i,
    // With additional text
    /##\s+.*\(\d+-\d+\s+words?\s*[^)]*\)/i,
    // Any parenthetical with "word" in headings
    /##\s+.*\([^)]*words?[^)]*\)/i
  ];
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check if line is a heading (starts with ##)
    if (line.trim().startsWith('##')) {
      patterns.forEach((pattern, patternIndex) => {
        if (pattern.test(line)) {
          issues.push({
            lineNumber,
            line: line.trim(),
            pattern: patternIndex,
            file: filePath
          });
        }
      });
    }
  });
  
  return issues;
}

// Remove word count indicators with enhanced patterns
function removeAllWordCountIndicators(content) {
  let updatedContent = content;
  
  // Comprehensive replacement patterns
  const replacements = [
    // Standard Introduction patterns
    {
      pattern: /^(##\s+Introduction)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    },
    // What Is patterns
    {
      pattern: /^(##\s+What\s+Is\s+[^(]*?)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    },
    // Importance/Benefits patterns
    {
      pattern: /^(##\s+Importance[^(]*?)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    },
    // How to patterns
    {
      pattern: /^(##\s+How\s+to\s+[^(]*?)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    },
    // Common Mistakes patterns
    {
      pattern: /^(##\s+Common\s+Mistakes[^(]*?)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    },
    // Conclusion patterns
    {
      pattern: /^(##\s+Conclusion)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    },
    // Generic pattern for any heading with word count
    {
      pattern: /^(##\s+[^(]*?)\s*\([^)]*words?[^)]*\)/gmi,
      replacement: '$1'
    }
  ];
  
  // Apply all replacements
  for (const { pattern, replacement } of replacements) {
    updatedContent = updatedContent.replace(pattern, replacement);
  }
  
  // Clean up any trailing whitespace in headings
  updatedContent = updatedContent.replace(/^(##\s+[^\n]*?)\s+$/gm, '$1');
  
  return updatedContent;
}

// Main comprehensive scan function
async function performComprehensiveScan() {
  console.log('🔍 Starting comprehensive word count indicator scan...\n');
  console.log('=' .repeat(70));

  const files = getAllFiles();
  console.log(`📄 Scanning ${files.length} files (including template)\n`);

  let totalIssues = 0;
  let filesWithIssues = 0;
  let filesFixed = 0;
  const issueDetails = [];

  // Phase 1: Detection
  console.log('🔍 PHASE 1: DETECTION SCAN');
  console.log('-'.repeat(40));

  for (const file of files) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const issues = findWordCountIndicators(content, file.path);
      
      if (issues.length > 0) {
        console.log(`❌ ${file.category}/${file.slug}`);
        issues.forEach(issue => {
          console.log(`   Line ${issue.lineNumber}: ${issue.line}`);
          issueDetails.push({
            file: file,
            issue: issue
          });
        });
        console.log('');
        totalIssues += issues.length;
        filesWithIssues++;
      } else {
        console.log(`✅ ${file.category}/${file.slug}`);
      }
    } catch (error) {
      console.log(`❌ Error reading ${file.path}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 DETECTION SUMMARY:');
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Files with issues: ${filesWithIssues}`);
  console.log(`   Total issues found: ${totalIssues}`);
  console.log('='.repeat(70));

  // Phase 2: Fixing (if issues found)
  if (totalIssues > 0) {
    console.log('\n🔧 PHASE 2: FIXING ISSUES');
    console.log('-'.repeat(40));

    for (const file of files) {
      try {
        const content = fs.readFileSync(file.path, 'utf8');
        const issues = findWordCountIndicators(content, file.path);
        
        if (issues.length > 0) {
          console.log(`🔧 Fixing: ${file.category}/${file.slug}`);
          
          const updatedContent = removeAllWordCountIndicators(content);
          
          // Verify fix worked
          const remainingIssues = findWordCountIndicators(updatedContent, file.path);
          
          if (remainingIssues.length === 0) {
            fs.writeFileSync(file.path, updatedContent, 'utf8');
            console.log(`   ✅ Fixed ${issues.length} issues`);
            filesFixed++;
          } else {
            console.log(`   ⚠️  ${remainingIssues.length} issues remain after fix attempt`);
            remainingIssues.forEach(issue => {
              console.log(`      Line ${issue.lineNumber}: ${issue.line}`);
            });
          }
        }
      } catch (error) {
        console.log(`   ❌ Error fixing ${file.path}: ${error.message}`);
      }
    }
  }

  // Phase 3: Final verification
  console.log('\n🔍 PHASE 3: FINAL VERIFICATION');
  console.log('-'.repeat(40));

  let finalIssues = 0;
  let finalFilesWithIssues = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const issues = findWordCountIndicators(content, file.path);
      
      if (issues.length > 0) {
        console.log(`❌ ${file.category}/${file.slug} - ${issues.length} remaining issues`);
        issues.forEach(issue => {
          console.log(`   Line ${issue.lineNumber}: ${issue.line}`);
        });
        finalIssues += issues.length;
        finalFilesWithIssues++;
      } else {
        console.log(`✅ ${file.category}/${file.slug}`);
      }
    } catch (error) {
      console.log(`❌ Error verifying ${file.path}: ${error.message}`);
    }
  }

  // Final report
  console.log('\n' + '='.repeat(70));
  console.log('🎉 FINAL COMPREHENSIVE REPORT');
  console.log('='.repeat(70));
  console.log(`📄 Total files scanned: ${files.length}`);
  console.log(`🔍 Initial issues found: ${totalIssues}`);
  console.log(`🔧 Files fixed: ${filesFixed}`);
  console.log(`✅ Files clean after scan: ${files.length - finalFilesWithIssues}`);
  console.log(`❌ Files with remaining issues: ${finalFilesWithIssues}`);
  console.log(`🎯 Final issues remaining: ${finalIssues}`);
  
  if (finalIssues === 0) {
    console.log('\n🎉 SUCCESS: All word count indicators have been completely removed!');
    console.log('   All articles and template are now professional and clean.');
  } else {
    console.log('\n⚠️  WARNING: Some word count indicators still remain.');
    console.log('   Manual review and fixing may be required.');
  }
  
  console.log('='.repeat(70));
}

// Run the comprehensive scan
if (require.main === module) {
  performComprehensiveScan().catch(console.error);
}

module.exports = {
  performComprehensiveScan,
  getAllFiles,
  findWordCountIndicators,
  removeAllWordCountIndicators
};
