import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostPageClient from "@/components/PostPage/client";
import { getPostData } from "@/components/PostPage/hooks/usePostData";
import { getPostMetadata } from "@/components/PostPage/hooks/usePostMetadata";
import { getPostStaticParams } from "@/components/PostPage/hooks/usePostStaticParams";
import { getPostNavigation } from "@/components/PostPage/hooks/usePostNavigation";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { frontmatter, content } = getPostData(slug);
  const { nextSlug, nextTitle, previousSlug, previousTitle } = getPostNavigation(slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PostPageClient
          frontmatter={frontmatter}
          content={content}
          nextSlug={nextSlug}
          nextTitle={nextTitle}
          previousSlug={previousSlug}
          previousTitle={previousTitle}
        />
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPostMetadata(slug);
}

export async function generateStaticParams() {
  return getPostStaticParams();
}
