// Performance Analysis Script for Astro Site
// This script analyzes the site's assets and provides optimization recommendations

const fs = require('fs');
const path = require('path');

class PerformanceAnalyzer {
  constructor() {
    this.publicDir = path.join(__dirname, '..', 'public');
    this.srcDir = path.join(__dirname, '..', 'src');
    this.results = {
      images: [],
      models: [],
      scripts: [],
      styles: [],
      totalSize: 0,
      recommendations: []
    };
  }

  // Get file size in MB
  getFileSizeInMB(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return (stats.size / 1024 / 1024).toFixed(2);
    } catch (error) {
      return 0;
    }
  }

  // Analyze directory recursively
  analyzeDirectory(dir, category) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          this.analyzeDirectory(filePath, category);
        } else {
          const sizeInMB = this.getFileSizeInMB(filePath);
          const relativePath = path.relative(this.publicDir, filePath);
          
          this.results[category].push({
            name: file,
            path: relativePath,
            size: sizeInMB,
            extension: path.extname(file).toLowerCase()
          });
          
          this.results.totalSize += parseFloat(sizeInMB);
        }
      });
    } catch (error) {
      console.error(`Error analyzing directory ${dir}:`, error.message);
    }
  }

  // Analyze all assets
  analyzeAssets() {
    console.log('🔍 Analyzing website assets...\n');
    
    // Analyze images
    const imagesDir = path.join(this.publicDir, 'images');
    if (fs.existsSync(imagesDir)) {
      this.analyzeDirectory(imagesDir, 'images');
    }
    
    // Analyze 3D models
    const modelsDir = path.join(this.publicDir, 'models');
    if (fs.existsSync(modelsDir)) {
      this.analyzeDirectory(modelsDir, 'models');
    }
    
    // Analyze source files
    if (fs.existsSync(this.srcDir)) {
      this.analyzeDirectory(this.srcDir, 'scripts');
    }
  }

  // Generate recommendations
  generateRecommendations() {
    const recommendations = [];
    
    // Check for large images
    const largeImages = this.results.images.filter(img => parseFloat(img.size) > 1);
    if (largeImages.length > 0) {
      recommendations.push({
        type: 'images',
        severity: 'high',
        message: `${largeImages.length} large images found (>1MB). Consider optimizing these images.`,
        files: largeImages.map(img => img.path)
      });
    }
    
    // Check for unoptimized image formats
    const unoptimizedImages = this.results.images.filter(img => 
      ['.png', '.jpg', '.jpeg'].includes(img.extension)
    );
    if (unoptimizedImages.length > 0) {
      recommendations.push({
        type: 'images',
        severity: 'medium',
        message: `${unoptimizedImages.length} images could be converted to WebP/AVIF for better compression.`,
        files: unoptimizedImages.slice(0, 5).map(img => img.path)
      });
    }
    
    // Check for large 3D models
    const largeModels = this.results.models.filter(model => parseFloat(model.size) > 5);
    if (largeModels.length > 0) {
      recommendations.push({
        type: 'models',
        severity: 'high',
        message: `${largeModels.length} large 3D models found (>5MB). Consider compression or lazy loading.`,
        files: largeModels.map(model => model.path)
      });
    }
    
    // Total size warning
    if (this.results.totalSize > 100) {
      recommendations.push({
        type: 'general',
        severity: 'high',
        message: `Total asset size is ${this.results.totalSize.toFixed(2)}MB. Consider implementing asset optimization.`
      });
    }
    
    this.results.recommendations = recommendations;
  }

  // Generate detailed report
  generateReport() {
    console.log('📊 PERFORMANCE ANALYSIS REPORT');
    console.log('================================\n');
    
    console.log(`📁 Total Assets Analyzed: ${this.results.images.length + this.results.models.length} files`);
    console.log(`📦 Total Size: ${this.results.totalSize.toFixed(2)} MB\n`);
    
    // Images summary
    if (this.results.images.length > 0) {
      console.log('🖼️  IMAGES ANALYSIS');
      console.log('-------------------');
      const imageSize = this.results.images.reduce((sum, img) => sum + parseFloat(img.size), 0);
      console.log(`Total Images: ${this.results.images.length}`);
      console.log(`Images Size: ${imageSize.toFixed(2)} MB`);
      
      const largestImages = this.results.images
        .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
        .slice(0, 5);
      
      console.log('\nLargest Images:');
      largestImages.forEach(img => {
        console.log(`  📄 ${img.name} - ${img.size} MB`);
      });
      console.log('');
    }
    
    // Models summary
    if (this.results.models.length > 0) {
      console.log('🎯 3D MODELS ANALYSIS');
      console.log('---------------------');
      const modelSize = this.results.models.reduce((sum, model) => sum + parseFloat(model.size), 0);
      console.log(`Total Models: ${this.results.models.length}`);
      console.log(`Models Size: ${modelSize.toFixed(2)} MB`);
      
      const largestModels = this.results.models
        .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
        .slice(0, 5);
      
      console.log('\nLargest Models:');
      largestModels.forEach(model => {
        console.log(`  📄 ${model.name} - ${model.size} MB`);
      });
      console.log('');
    }
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('💡 OPTIMIZATION RECOMMENDATIONS');
      console.log('===============================');
      
      this.results.recommendations.forEach((rec, index) => {
        const severity = rec.severity === 'high' ? '🔴' : rec.severity === 'medium' ? '🟡' : '🟢';
        console.log(`${index + 1}. ${severity} ${rec.message}`);
        
        if (rec.files && rec.files.length > 0) {
          console.log('   Files:');
          rec.files.forEach(file => {
            console.log(`     - ${file}`);
          });
        }
        console.log('');
      });
    }
    
    // Performance suggestions
    console.log('⚡ PERFORMANCE IMPROVEMENT SUGGESTIONS');
    console.log('=====================================');
    console.log('1. 📸 Image Optimization:');
    console.log('   - Convert images to WebP/AVIF format');
    console.log('   - Use responsive images with srcset');
    console.log('   - Implement lazy loading for images');
    console.log('');
    
    console.log('2. 🎯 3D Model Optimization:');
    console.log('   - Compress GLTF/GLB files using gltf-pack');
    console.log('   - Use Draco compression for geometry');
    console.log('   - Implement progressive loading');
    console.log('');
    
    console.log('3. 🚀 General Optimizations:');
    console.log('   - Enable Astro\'s built-in asset optimization');
    console.log('   - Implement service worker for caching');
    console.log('   - Use CDN for static assets');
    console.log('   - Enable Brotli compression');
    console.log('');
    
    console.log('4. 📱 Mobile Optimization:');
    console.log('   - Reduce asset sizes for mobile devices');
    console.log('   - Use intersection observer for lazy loading');
    console.log('   - Implement skeleton screens for loading states');
    console.log('');
  }

  // Run complete analysis
  run() {
    this.analyzeAssets();
    this.generateRecommendations();
    this.generateReport();
    
    // Save results to file
    const reportPath = path.join(__dirname, '..', 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📝 Detailed report saved to: ${reportPath}`);
  }
}

// Run the analyzer
const analyzer = new PerformanceAnalyzer();
analyzer.run();
