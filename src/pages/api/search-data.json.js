// src/pages/api/search-data.json.js
import { getCollection } from 'astro:content';

export async function GET() {
  try {
    // Get all blog posts
    const blogPosts = await getCollection('blog');
    const publishedBlogPosts = blogPosts.filter(post => !post.data.isDraft);

    // Get all projects
    const projects = await getCollection('projeler');
    const publishedProjects = projects.filter(project => !project.data.isDraft);

    // Format blog posts for search
    const searchableBlogPosts = publishedBlogPosts.map(post => ({
      id: `blog-${post.slug}`,
      title: post.data.title,
      description: post.data.description,
      href: `/blog/${post.slug}/`,
      type: 'blog',
      category: 'Blog',
      date: post.data.publishDate.toISOString(),
      tags: post.data.tags || [],
      author: post.data.author || 'Abdullah Gülderen'
    }));

    // Format projects for search
    const searchableProjects = publishedProjects.map(project => ({
      id: `project-${project.slug}`,
      title: project.data.title,
      description: project.data.description,
      href: `/projeler/${project.slug}/`,
      type: 'project',
      category: 'Proje',
      date: project.data.publishDate.toISOString(),
      tags: project.data.tags || []
    }));

    // Combine all searchable content
    const searchData = [...searchableBlogPosts, ...searchableProjects];

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Error generating search data:', error);
    
    // Return empty array on error
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
