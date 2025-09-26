"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { PostData } from "./hooks/usePostData";

interface PostPageClientProps {
  frontmatter: PostData;
  content: string;
}

export default function PostPageClient({ frontmatter, content }: PostPageClientProps) {
  return (
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
              <span className="text-sm font-medium text-gray-700">
                Categories:{" "}
              </span>
              {frontmatter.categories.map((category, index) => (
                <span key={category} className="text-sm text-blue-600">
                  {category}
                  {index < (frontmatter.categories?.length ?? 0) - 1 &&
                    ", "}
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
    </div>
  );
}