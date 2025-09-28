import { MetadataRoute } from 'next'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tanigu12.github.io'
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    }
  ]

  // Add blog posts
  const postsDirectory = join(process.cwd(), 'src/_posts')
  
  if (existsSync(postsDirectory)) {
    try {
      const filenames = readdirSync(postsDirectory)
      const posts = filenames
        .filter(name => name.endsWith('.md'))
        .map(name => {
          const fullPath = join(postsDirectory, name)
          const fileContents = readFileSync(fullPath, 'utf8')
          const { data } = matter(fileContents)
          const slug = name.replace(/\.md$/, '')
          
          return {
            url: `${baseUrl}/posts/${slug}`,
            lastModified: data.datetime ? new Date(data.datetime) : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          }
        })
      
      routes.push(...posts)
    } catch (error) {
      console.warn('Error reading posts directory for sitemap:', error)
    }
  }

  return routes
}