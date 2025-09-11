# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is "Gulderen Lab" - a Turkish technical blog and project showcase website built with modern web technologies. The site focuses on electronics, embedded systems, web development, and CAD design content, featuring interactive 3D models, mathematical expressions, and responsive design.

**Site URL**: https://www.gulderenlab.com  
**Target Audience**: Turkish-speaking engineers and developers  
**Main Purpose**: Technical blog, project portfolio, and calculation tools

## Architecture & Tech Stack

### Core Framework
- **Astro 5.12+**: Static Site Generation with island architecture
- **React 19**: For interactive components (TypeScript-based)
- **TailwindCSS 3.4**: Utility-first styling with custom design system
- **TypeScript**: Strict type checking enabled

### Content Management
- **Content Collections**: Three main collections defined in `src/content/config.ts`
  - `blog`: Technical articles with MDX support
  - `projeler`: Project showcase with 3D models
  - `radyoloji`: Medical radiology content
- **MDX**: Markdown with React components for rich content
- **Frontmatter**: Structured metadata with drafts, tags, pagination support

### Key Features
- **3D Model Rendering**: Google Model Viewer for GLTF/GLB files
- **Math Support**: KaTeX for mathematical expressions (inline `$` and block `$$`)
- **Animation Libraries**: GSAP, Framer Motion, P5.js for interactive content
- **Responsive Design**: Mobile-first approach with dark theme
- **Performance Optimization**: Custom asset analysis scripts

## Development Commands

### Essential Commands
```bash
# Development server with network access
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Clean Astro cache
npm run clean

# Performance analysis
npm run analyze

# Complete optimization workflow
npm run optimize
```

### Content Management
```bash
# Add new blog post: create file in src/content/blog/[slug].mdx
# Add new project: create file in src/content/projeler/[slug].mdx
# Add new radiology content: create file in src/content/radyoloji/[slug].mdx
```

## Content Structure & Frontmatter

### Blog Posts (`src/content/blog/`)
Required frontmatter:
```yaml
---
title: "Post Title"
description: "SEO description"
author: "Abdullah Gülderen"  # defaults to this
publishDate: 2025-01-01
tags: ["electronics", "programming"]  # optional
image:  # optional
  src: "/images/cover.jpg"
  alt: "Cover image"
isDraft: false  # optional, defaults to false

# For series/pagination
part: 1  # optional
totalPages: 3  # optional
seriesSlug: "series-name"  # optional
prevPageSlug: "previous-post-slug"  # optional
nextPageSlug: "next-post-slug"  # optional

# For 3D models
modelPath: "/models/my_model.glb"  # optional
modelHeight: "600px"  # optional, defaults to 600px
---
```

### Projects (`src/content/projeler/`)
Required frontmatter:
```yaml
---
title: "Project Name"
description: "Project description"
publishDate: 2025-01-01
tags: ["hardware", "iot"]
image:
  src: "/images/project-cover.jpg"
  alt: "Project image"
isDraft: false  # optional
---
```

## Specialized Components

### Interactive Electronics Components
- **I2C Protocol Visualizations**: `src/components/i2c/` (React components)
- **Common Mode Choke Animations**: `src/components/OrtakModBobinleri/`
- **Linear Regulator Calculators**: `src/components/LineerReg/`

### 3D Model Integration
- Models stored in `public/models/` (prefer GLTF/GLB format)
- Use Model Viewer component with lazy loading
- Performance optimization with Draco compression recommended

### Math Expressions
- Inline: `$E = mc^2$`
- Block equations: `$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$`
- Custom macros available in astro.config.mjs

## Performance Considerations

### Asset Optimization
- Images: Prefer WebP/AVIF formats with responsive srcsets
- 3D Models: Use GLTF/GLB with compression (>5MB models need optimization)
- Scripts: Lazy loading implemented for heavy components

### Analysis Tools
- Run `npm run analyze` for detailed performance report
- Output saved to `performance-report.json`
- Custom analyzer in `scripts/performance-analysis.js`

## Routing Structure

```
/                    # Homepage with featured content
/blog/              # Blog listing
/blog/[slug]/       # Individual blog posts
/projeler/          # Projects listing  
/projeler/[slug]/   # Individual projects
/radyoloji/         # Radiology content listing
/radyoloji/[slug]/  # Individual radiology posts
/hakkimizda         # About page
/iletisim          # Contact page
/hesaplama-araclari # Calculation tools
```

## Styling System

### Design Tokens
- Custom colors in `tailwind.config.js`: accent, brand variants
- Typography plugin with table optimizations for mobile
- Custom animations in `src/styles/animations.css`

### Responsive Breakpoints
- Mobile-first approach
- Special mobile table handling in layout
- Touch-friendly interactive elements

## Development Notes

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `src/*`
- JSX set to "preserve" for Astro compatibility

### Content Guidelines
- All content in Turkish language
- Technical focus: electronics, programming, CAD design
- SEO optimized with structured data (JSON-LD)
- Performance-first approach with Lighthouse 95+ target

### Special File Types
- `.astro` components for static content
- `.jsx/.tsx` for interactive React components  
- `.mdx` for content with embedded components
- `.css` for global styles (PostCSS enabled)

## External Dependencies

### CDN Resources
- KaTeX for mathematical rendering
- Google Model Viewer for 3D models
- DNS prefetch configured for performance

### Key Packages
- `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`
- `framer-motion`, `gsap`, `three`, `p5` for animations
- `rehype-katex`, `remark-math` for mathematical content

## Site Configuration

- Site URL: https://www.gulderenlab.com (configured in astro.config.mjs)
- Sitemap generation enabled
- Turkish locale (tr_TR) 
- HTTPS development server with SSL certificates
- Custom 404 handling and error pages
