import Storefront from "@/components/storefront";
import { articles } from "@/components/journal";
export const metadata = { title: "Community / Blog | Soft Life Club", description: "The SLC journal: personal style, soft living and strong boundaries." };
export default function CommunityPage() {
  return <Storefront><section className="journal-home">
    <p className="eyebrow">THE SLC JOURNAL</p><h1>Community / Blog</h1>
    <p className="journal-intro">For the woman making room for herself. Style notes, thoughts and small reminders to take into your day.</p>
    <div className="journal-grid">{articles.map((article) => <a className="journal-card" key={article.slug} href={`/community/${article.slug}`}>
      <p className="eyebrow">{article.label}</p><h2>{article.title}</h2><p>{article.excerpt}</p><span>Read story →</span>
    </a>)}</div>
  </section></Storefront>;
}
