import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AboutPage } from "@/components/AboutPage";
import { ContactDetails, PageBanner } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { QuoteForm } from "@/components/QuoteForm";
import { ServicePage } from "@/components/ServicePage";
import { BESPOKE, formatDate, getPages, getPostByPath, getPosts, type Page, type Post } from "@/lib/content";
import { blogPostingSchema, breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

type Params = { path: string[] };

/** Static export rejects an empty list, so a placeholder is emitted and removed from out/ after the build. */
const PLACEHOLDER = "__placeholder";

export function generateStaticParams(): Params[] {
  const pages = getPages()
    .filter((p) => !BESPOKE.has(p.slug))
    .map((p) => ({ path: [p.slug] }));
  const posts = getPosts().map((p) => ({ path: p.path.split("/").filter(Boolean) }));
  const all = [...pages, ...posts];
  return all.length ? all : [{ path: [PLACEHOLDER] }];
}

function resolve(path: string[]): { page?: Page; post?: Post } {
  if (path.length === 1) {
    const page = getPages().find((p) => p.slug === path[0] && !BESPOKE.has(p.slug));
    return { page };
  }
  return { post: getPostByPath(path) };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { path } = await params;
  const { page, post } = resolve(path);
  if (page) return pageMeta({ title: page.title, description: page.description, path: page.path });
  if (post) return pageMeta({ title: post.seoTitle ?? post.title, description: post.description, path: post.path, type: "article", publishedTime: post.date });
  return { title: "Page not found", robots: { index: false, follow: true } };
}

export default async function CatchAll({ params }: { params: Promise<Params> }) {
  const { path } = await params;
  const { page, post } = resolve(path);
  if (post) return <PostView post={post} />;
  if (!page) notFound();
  if (page.hero) return <ServicePage page={page} />;
  if (page.slug === "about-us") return <AboutPage page={page} />;
  if (page.slug === "contact-us") return <ContactView page={page} />;
  if (page.slug === "blog") return <BlogIndex page={page} />;
  return <PlainPage page={page} />;
}

function ContactView({ page }: { page: Page }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact Us", path: page.path }])} />
      <PageBanner title="Contact Us" asH1 />
      <section id="quote" className="section bg-white">
        <div className="container grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
          <div>
            <QuoteForm idPrefix="contact" heading="Provide Vehicle Details" />
            <p className="mt-5 rounded border-l-4 border-orange bg-sky p-4 text-[15px] text-navy">
              <strong>We DO NOT sell car parts.</strong>
              <br />
              This form is only for people requesting a <strong>quote to sell their car</strong> for removal or recycling.
            </p>
          </div>
          <ContactDetails intro={page.getInTouch?.intro ?? ""} />
        </div>
      </section>
    </>
  );
}

function PlainPage({ page }: { page: Page }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: page.banner?.title ?? page.title, path: page.path }])} />
      <PageBanner title={page.banner?.title ?? page.title} asH1 />
      <section className="section bg-white">
        <div className="container">
          <Markdown>{page.body}</Markdown>
        </div>
      </section>
    </>
  );
}

function BlogIndex({ page }: { page: Page }) {
  const posts = getPosts();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: page.path }]),
          itemListSchema("A2Z Auto Dismantlers blog", posts.map((p) => ({ name: p.title, path: p.path }))),
        ]}
      />
      <PageBanner title="Blog" asH1 />
      <section className="section bg-white">
        <div className="container">
          <ul className="grid gap-8 md:grid-cols-2">
            {posts.map((p, i) => (
              <li key={p.path} className="flex flex-col overflow-hidden rounded-md bg-white shadow-card">
                <img
                  src={p.thumb.src}
                  alt={p.thumb.alt}
                  width={p.thumb.width}
                  height={p.thumb.height}
                  loading={i < 2 ? undefined : "lazy"}
                  decoding="async"
                  className="aspect-[2/1] w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="text-xl md:text-2xl">
                    <Link href={p.path} className="hover:text-accent-dark">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm">
                    By {p.author}
                    <br />
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </p>
                  <p className="mt-3 flex-1">{p.excerpt}</p>
                  <Link href={p.path} className="btn-outline mt-6 self-start text-sm">
                    Read more<span className="sr-only">: {p.title}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function PostView({ post }: { post: Post }) {
  const others = getPosts().filter((p) => p.path !== post.path).slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
            { name: post.title, path: post.path },
          ]),
        ]}
      />
      <article className="bg-white pb-16 pt-12 md:pt-16">
        <div className="container max-w-4xl">
          <p className="text-sm">
            <Link href="/blog/" className="font-semibold text-accent-deep hover:underline">
              Blog
            </Link>
          </p>
          <h1 className="mt-2 text-[30px] leading-tight md:text-[36px]">{post.title}</h1>
          <p className="mt-3 text-sm">
            <span className="font-semibold text-navy">{post.author}</span>
            <br />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <img
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            fetchPriority="high"
            decoding="async"
            className="mt-8 max-h-[440px] w-full rounded-md object-cover"
          />
          <div className="post-body mt-8">
            <Markdown>{post.body}</Markdown>
          </div>
          <aside className="mt-14 rounded-md bg-sky p-7" aria-labelledby="post-cta">
            <h2 id="post-cta" className="text-2xl">
              Selling a wrecked car in Christchurch?
            </h2>
            <p className="mt-2">Get a no-obligation cash offer with free removal and same-day payment.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="tel:+64800030027" className="btn-orange">
                Call 0800 0300 27
              </a>
              <Link href="/contact-us/" className="btn-outline">
                Get a quote online
              </Link>
            </div>
          </aside>
          {others.length > 0 && (
            <nav className="mt-14" aria-labelledby="more-posts">
              <h2 id="more-posts" className="text-2xl">
                More from our blog
              </h2>
              <ul className="mt-4 space-y-2">
                {others.map((o) => (
                  <li key={o.path}>
                    <Link href={o.path} className="font-semibold text-accent-deep underline underline-offset-2">
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>
    </>
  );
}
