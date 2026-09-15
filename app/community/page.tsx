import Storefront from "@/components/storefront";
import { articles } from "@/components/journal";
export const metadata = { title: "Community / Blog | Soft Life Club", description: "The SLC journal: personal style, soft living and strong boundaries." };
export default function CommunityPage() {
  return <Storefront><section className="journal-home">
    <p className="eyebrow">COMMUNITY / BLOG</p><h1>SLC Society.</h1>
    <p className="journal-intro">For the woman making room for herself. Style notes, thoughts and small reminders to take into your day.</p>
    <a className="primary-link" href="/join?area=society">Join SLC</a>
    <div className="journal-grid">{articles.map((article) => <a className="journal-card" key={article.slug} href={`/community/${article.slug}`}>
      <p className="eyebrow">{article.label}</p><h2>{article.title}</h2><p>{article.excerpt}</p><span>Read story →</span>
    </a>)}</div>
  </section></Storefront>;
}
