"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { PostData } from "./hooks/usePostData";

interface PostPageClientProps {
  frontmatter: PostData;
  content: string;
  nextSlug?: string | null;
  nextTitle?: string | null;
  previousSlug?: string | null;
  previousTitle?: string | null;
}

export default function PostPageClient({
  frontmatter,
  content,
  nextSlug,
  nextTitle,
  previousSlug,
  previousTitle
}: PostPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>
          {frontmatter.datetime && (
            <div className="text-gray-600 mb-4">
              <time dateTime={frontmatter.datetime}>
                {new Date(frontmatter.datetime).toLocaleDateString()}
              </time>
            </div>
          )}
          {frontmatter.categories.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                Categories:{" "}
              </span>
              {frontmatter.categories.map((category, index) => (
                <span key={category} className="text-sm text-blue-600">
                  {category}
                  {index < frontmatter.categories.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">
                Tags:{" "}
              </span>
              {frontmatter.tags.map((tag, index) => (
                <span key={tag} className="text-sm text-green-600">
                  {tag}
                  {index < (frontmatter.tags?.length ?? 0) - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="markdown-content">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>
      </article>
      {(previousSlug || nextSlug) && (
        <div className="mt-8 flex justify-between gap-4">
          {previousSlug ? (
            <Link
              href={`/posts/${previousSlug}`}
              className="flex flex-col items-start px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors max-w-md"
            >
              <span className="text-sm opacity-70">← Previous</span>
              <span className="font-medium">{previousTitle || previousSlug}</span>
            </Link>
          ) : (
            <div></div>
          )}
          {nextSlug && (
            <Link
              href={`/posts/${nextSlug}`}
              className="flex flex-col items-end px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors max-w-md"
            >
              <span className="text-sm opacity-70">Next →</span>
              <span className="font-medium">{nextTitle || nextSlug}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}