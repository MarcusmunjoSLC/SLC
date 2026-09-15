import Storefront from "@/components/storefront";
import { areas } from "@/components/areas";

export default function Home() {
  return <Storefront>
    <section className="slc-home">
      <p className="eyebrow">SOFT LIFE CLUB</p>
      <h1>A whole way of living.</h1>
      <p className="home-intro">What you wear is only the beginning. Explore the four sides of SLC, and be part of what comes next.</p>
      <a className="primary-link" href="/join">Join SLC</a>
      <div className="area-grid">{areas.map((area) => <a className="area-card" href={`/${area.id}`} key={area.id}>
        <p className="eyebrow">{area.status}</p><h2>SLC {area.name}</h2><p>{area.description}</p><span>Explore {area.name} →</span>
      </a>)}</div>
    </section>
    <section className="community-banner"><p className="eyebrow">PARTNER WITH SLC</p><h2>Join the movement.</h2><p>Have an idea for something we could build together?</p><a href="/partners">Tell us about it →</a></section>
  </Storefront>;
}
