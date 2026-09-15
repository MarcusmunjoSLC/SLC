import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Storefront from "@/components/storefront";
import { articles } from "@/components/journal";
export const dynamicParams = false;
export function generateStaticParams() { return articles.map((article) => ({ slug: article.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((article) => article.slug === slug);
  if (!article) notFound();
  return { title: article.title + " | SLC Journal", description: article.excerpt };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((article) => article.slug === slug);
  if (!article) notFound();
  return <Storefront><article className="journal-article">
    <a className="back-link" href="/community">← Back to the journal</a>
    <p className="eyebrow">{article.label}</p><h1>{article.title}</h1>
    <p className="article-deck">{article.excerpt}</p>
    <blockquote>{article.quote}</blockquote>
    {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    <aside className="reflection"><h2>A thought to take with you</h2><p>{article.prompt}</p></aside>
    <a className="view-product" href={`/products/${article.product}`}>Explore the piece behind the words →</a>
  </article></Storefront>;
}
