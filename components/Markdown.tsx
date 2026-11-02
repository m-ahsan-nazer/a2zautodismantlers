import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-a2z">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // Markdown bodies start at h2: the page template owns the only h1.
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} rel="noopener" target={href.startsWith("http") ? "_blank" : undefined}>
                {children}
              </a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
