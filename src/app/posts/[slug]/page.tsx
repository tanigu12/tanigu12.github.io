import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface PostPageProps {
  params: { slug: string }
}

interface PostData {
  title: string
  date?: string
  categories?: string[]
  tags?: string[]
  description?: string
  excerpt?: string
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params
  const postsDirectory = join(process.cwd(), 'src/_posts')
  const fullPath = join(postsDirectory, `${slug}.md`)

  if (!existsSync(fullPath)) {
    notFound()
  }

  const fileContents = readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostData

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <article className="prose prose-lg mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>
          {frontmatter.date && (
            <div className="text-gray-600 mb-4">
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString()}
              </time>
            </div>
          )}
          {frontmatter.categories && frontmatter.categories.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Categories: </span>
              {frontmatter.categories.map((category, index) => (
                <span key={category} className="text-sm text-blue-600">
                  {category}
                  {index < (frontmatter.categories?.length ?? 0) - 1 && ', '}
                </span>
              ))}
            </div>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Tags: </span>
              {frontmatter.tags.map((tag, index) => (
                <span key={tag} className="text-sm text-green-600">
                  {tag}
                  {index < (frontmatter.tags?.length ?? 0) - 1 && ', '}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="markdown-content">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = params
  const postsDirectory = join(process.cwd(), 'src/_posts')
  const fullPath = join(postsDirectory, `${slug}.md`)

  if (!existsSync(fullPath)) {
    return {
      title: 'Post Not Found',
    }
  }

  const fileContents = readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostData
  
  const description = frontmatter.description || frontmatter.excerpt || content.slice(0, 160) + '...'
  const title = frontmatter.title
  const publishedTime = frontmatter.date
  const keywords = [
    ...(frontmatter.categories || []),
    ...(frontmatter.tags || []),
    'blog', 'tech', 'programming'
  ]

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Takaaki Taniguchi' }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      authors: ['Takaaki Taniguchi'],
      url: `https://tanigu12.github.io/posts/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/posts/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  const postsDirectory = join(process.cwd(), 'src/_posts')
  const { readdirSync } = await import('fs')
  
  try {
    const filenames = readdirSync(postsDirectory)
    return filenames
      .filter(name => name.endsWith('.md'))
      .map(name => ({
        slug: name.replace(/\.md$/, '')
      }))
  } catch {
    return []
  }
}