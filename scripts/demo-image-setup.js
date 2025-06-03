#!/usr/bin/env node

/**
 * Demo Image Setup Script
 * Downloads sample high-quality images for demonstration purposes
 * Uses free stock photo URLs that don't require API keys
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Sample high-quality images from free sources
const SAMPLE_IMAGES = {
  finance: [
    {
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'cryptocurrency-guide.webp',
      alt: 'Financial concept illustration for "Cryptocurrency Investment Guide for Beginners" - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'investment-strategies-2024.webp',
      alt: 'Financial concept illustration for "Investment Strategies 2024" - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'personal-finance-management-2024.webp',
      alt: 'Financial concept illustration for "Personal Finance Management 2024" - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'cryptocurrency-investment-strategies-2024.webp',
      alt: 'Cryptocurrency investment strategies and digital finance concepts - Professional financial imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'cryptocurrency-tax-planning-strategies-2024.webp',
      alt: 'Tax planning and cryptocurrency financial strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'debt-consolidation-strategies-2024.webp',
      alt: 'Debt consolidation and financial planning strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'emergency-fund-building-strategies-2024.webp',
      alt: 'Emergency fund building and savings strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1450101215322-bf5cd27538ff?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'estate-planning-essentials-young-professionals.webp',
      alt: 'Estate planning and financial planning for young professionals - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'high-yield-savings-account-optimization-guide.webp',
      alt: 'High-yield savings account optimization and banking strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'passive-income-streams-guide-2024.webp',
      alt: 'Passive income streams and investment strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'real-estate-investing-guide-2024.webp',
      alt: 'Real estate investing and property investment strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'retirement-planning-strategies-2024.webp',
      alt: 'Retirement planning and long-term financial strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'small-business-financial-planning-2024.webp',
      alt: 'Small business financial planning and entrepreneurship strategies - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'tax-optimization-strategies-small-business.webp',
      alt: 'Tax optimization strategies for small business owners - Professional finance imagery'
    },
    // Missing images for finance articles
    {
      url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'alternative-investment-options-beyond-stocks-bonds.webp',
      alt: 'Alternative investment options beyond traditional stocks and bonds - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'financial-planning-millennials-building-wealth-30s.webp',
      alt: 'Financial planning strategies for millennials building wealth in their 30s - Professional finance imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'sustainable-investing-strategies-long-term-growth-2024.webp',
      alt: 'Sustainable investing strategies for long-term growth and environmental impact - Professional finance imagery'
    }
  ],
  technology: [
    {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'ai-revolution-2024.webp',
      alt: 'Technology concept illustration for "The AI Revolution: Transforming Industries in 2024" - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'cybersecurity-trends.webp',
      alt: 'Technology concept illustration for "Cybersecurity Trends" - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'cloud-computing-transformation-2024.webp',
      alt: 'Technology concept illustration for "Cloud Computing Transformation 2024" - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'ai-integration-small-business-operations.webp',
      alt: 'AI integration in small business operations and automation - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'api-development-best-practices-2024.webp',
      alt: 'API development and software engineering best practices - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'blockchain-technology-business-applications.webp',
      alt: 'Blockchain technology and business applications - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'cybersecurity-framework-remote-teams.webp',
      alt: 'Cybersecurity framework and remote team security - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'data-analytics-business-intelligence.webp',
      alt: 'Data analytics and business intelligence visualization - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'devops-automation-tools-2024.webp',
      alt: 'DevOps automation tools and software development - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'emerging-tech-trends-2024.webp',
      alt: 'Emerging technology trends and innovation - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'machine-learning-implementation-business-2024.webp',
      alt: 'Machine learning implementation in business applications - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'mobile-app-development-trends-2024.webp',
      alt: 'Mobile app development trends and mobile technology - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'no-code-development-platforms-comparison-2024.webp',
      alt: 'No-code development platforms and visual programming - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'software-development-best-practices-2024.webp',
      alt: 'Software development best practices and coding standards - Professional technology imagery'
    },
    // Missing images for technology articles
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'artificial-intelligence-healthcare-transforming-patient-care-2024.webp',
      alt: 'Artificial intelligence transforming healthcare and patient care - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'internet-of-things-iot-security-protecting-connected-devices.webp',
      alt: 'Internet of Things IoT security and protecting connected devices - Professional technology imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'quantum-computing-applications-business-future-opportunities.webp',
      alt: 'Quantum computing applications in business and future opportunities - Professional technology imagery'
    }
  ],
  education: [
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'online-learning-platforms-guide-2024.webp',
      alt: 'Educational concept illustration for "Online Learning Platforms Guide 2024" - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'future-of-learning.webp',
      alt: 'Educational concept illustration for "Future of Learning" - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'digital-learning-platforms-career-transformation-2024.webp',
      alt: 'Digital learning platforms and career transformation - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'digital-literacy-skills-career-advancement-2024.webp',
      alt: 'Digital literacy skills and career advancement - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'microlearning-strategies-professional-development.webp',
      alt: 'Microlearning strategies and professional development - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'professional-certification-career-advancement.webp',
      alt: 'Professional certification and career advancement - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'professional-networking-strategies-2024.webp',
      alt: 'Professional networking strategies and career development - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'professional-skill-development-2024.webp',
      alt: 'Professional skill development and career growth - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'remote-learning-effectiveness-strategies.webp',
      alt: 'Remote learning effectiveness and online education strategies - Professional education imagery'
    },
    // Missing images for education articles
    {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'adult-learning-strategies-continuous-education-career-growth.webp',
      alt: 'Adult learning strategies and continuous education for career growth - Professional education imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'digital-skills-training-essential-competencies-modern-workforce.webp',
      alt: 'Digital skills training and essential competencies for modern workforce - Professional education imagery'
    }
  ],
  business: [
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'startup-success-strategies.webp',
      alt: 'Business concept illustration for "Startup Success Strategies" - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'leadership-team-management-2024.webp',
      alt: 'Business concept illustration for "Leadership Team Management 2024" - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'customer-experience-optimization-data-analytics.webp',
      alt: 'Customer experience optimization and data analytics - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'customer-retention-strategies-growth.webp',
      alt: 'Customer retention strategies and business growth - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'digital-marketing-strategies-2024.webp',
      alt: 'Digital marketing strategies and online business - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'ecommerce-business-strategy-2024.webp',
      alt: 'E-commerce business strategy and online retail - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'remote-team-management-2024.webp',
      alt: 'Remote team management and virtual collaboration - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'sustainable-business-practices-2024.webp',
      alt: 'Sustainable business practices and environmental responsibility - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'sustainable-supply-chain-management-strategies.webp',
      alt: 'Sustainable supply chain management and logistics - Professional business imagery'
    },
    // Missing images for business articles
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'crisis-management-strategies-building-resilient-organizations.webp',
      alt: 'Crisis management strategies and building resilient organizations - Professional business imagery'
    },
    {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=1080&fit=crop&crop=center&fm=webp',
      filename: 'sustainable-business-models-profitability-environmental-impact.webp',
      alt: 'Sustainable business models balancing profitability and environmental impact - Professional business imagery'
    }
  ]
};

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadSampleImages() {
  console.log('🚀 Starting sample image download...\n');

  let downloadCount = 0;
  let errorCount = 0;

  for (const [category, images] of Object.entries(SAMPLE_IMAGES)) {
    console.log(`📁 Processing ${category} category...`);
    
    const categoryDir = path.join(process.cwd(), 'public', 'images', 'articles', category);
    
    // Ensure directory exists
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    for (const image of images) {
      try {
        const imagePath = path.join(categoryDir, image.filename);
        
        // Skip if image already exists
        if (fs.existsSync(imagePath)) {
          console.log(`   ✅ ${image.filename} already exists, skipping`);
          continue;
        }

        console.log(`   ⬇️  Downloading ${image.filename}...`);
        await downloadFile(image.url, imagePath);
        console.log(`   ✅ Downloaded ${image.filename}`);
        downloadCount++;

        // Rate limiting
        await delay(500);

      } catch (error) {
        console.log(`   ❌ Error downloading ${image.filename}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('');
  }

  console.log(`🎉 Sample image download completed!`);
  console.log(`✅ Successfully downloaded: ${downloadCount} images`);
  console.log(`❌ Errors encountered: ${errorCount} images`);
  console.log(`\n📁 Images saved to: public/images/articles/[category]/`);
}

// Update sample article metadata
async function updateSampleMetadata() {
  console.log('\n🔄 Updating sample article metadata...\n');

  let updateCount = 0;

  for (const [category, images] of Object.entries(SAMPLE_IMAGES)) {
    for (const image of images) {
      const slug = image.filename.replace('.webp', '');
      const articlePath = path.join(process.cwd(), 'content', category, `${slug}.md`);
      
      if (!fs.existsSync(articlePath)) {
        console.log(`   ⚠️  Article not found: ${category}/${slug}.md`);
        continue;
      }

      try {
        const content = fs.readFileSync(articlePath, 'utf8');
        
        // Check if heroImage already exists
        if (content.includes('heroImage:')) {
          console.log(`   ✅ ${slug} already has hero image configured`);
          continue;
        }

        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
          console.log(`   ❌ No frontmatter found in ${slug}`);
          continue;
        }

        const frontmatterContent = frontmatterMatch[1];
        const restOfContent = content.substring(frontmatterMatch[0].length);

        // Add hero image fields
        const heroImagePath = `/images/articles/${category}/${image.filename}`;
        const updatedFrontmatter = frontmatterContent + 
          `\nheroImage: "${heroImagePath}"` +
          `\nheroImageAlt: "${image.alt}"`;

        const updatedContent = `---\n${updatedFrontmatter}\n---${restOfContent}`;

        // Write back to file
        fs.writeFileSync(articlePath, updatedContent, 'utf8');
        console.log(`   ✅ Updated metadata for ${slug}`);
        updateCount++;

      } catch (error) {
        console.log(`   ❌ Error updating ${slug}: ${error.message}`);
      }
    }
  }

  console.log(`\n🎉 Metadata update completed!`);
  console.log(`✅ Successfully updated: ${updateCount} articles`);
}

// Main function
async function setupSampleImages() {
  await downloadSampleImages();
  await updateSampleMetadata();
  
  console.log('\n🌟 Sample image setup complete!');
  console.log('You can now see hero images on the updated articles.');
  console.log('\nTo download images for all articles:');
  console.log('1. Get API keys from Pexels and Unsplash');
  console.log('2. Set environment variables: PEXELS_API_KEY and UNSPLASH_ACCESS_KEY');
  console.log('3. Run: npm run download-images');
  console.log('4. Run: npm run update-metadata');
}

// Run the script
if (require.main === module) {
  setupSampleImages().catch(console.error);
}

module.exports = {
  downloadSampleImages,
  updateSampleMetadata,
  setupSampleImages
};
