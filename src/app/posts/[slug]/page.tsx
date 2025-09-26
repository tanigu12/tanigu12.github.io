import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostPageClient from "@/components/PostPage/client";
import { getPostData } from "@/components/PostPage/hooks/usePostData";
import { getPostMetadata } from "@/components/PostPage/hooks/usePostMetadata";
import { getPostStaticParams } from "@/components/PostPage/hooks/usePostStaticParams";

interface PostPageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const { frontmatter, content } = getPostData(slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PostPageClient frontmatter={frontmatter} content={content} />
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = params;
  return getPostMetadata(slug);
}

export async function generateStaticParams() {
  return getPostStaticParams();
}
