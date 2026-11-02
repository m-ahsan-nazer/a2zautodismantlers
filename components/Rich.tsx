import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders a short copy string with **bold** and [label](href) inline markup.
 * Used for frontmatter copy so pages keep the emphasis from the original site.
 */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={i++} className="font-bold">{m[1]}</strong>);
    else {
      const href = m[3];
      out.push(
        href.startsWith("/") ? (
          <Link key={i++} href={href} className="font-semibold text-accent-deep underline underline-offset-2">
            {m[2]}
          </Link>
        ) : (
          <a key={i++} href={href} rel="noopener" target="_blank" className="font-semibold text-accent-deep underline underline-offset-2">
            {m[2]}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
