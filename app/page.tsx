import Storefront from "@/components/storefront";
import { areas } from "@/components/areas";
import AreaIcon from "@/components/area-icon";
import Image from "next/image";

export default function Home() {
  return <Storefront>
    <section className="slc-home">
      <Image className="landing-logo" src="/soft-life-club-logo.png" alt="Soft Life Club" width={1200} height={1300} priority />
      <p className="eyebrow">SOFT LIFE CLUB</p>
      <h1>A whole way of living.</h1>
      <p className="home-intro">What you wear is only the beginning. Explore the four sides of SLC, and be part of what comes next.</p>
      <a className="primary-link" href="/join">Join SLC</a>
      <nav className="area-grid" aria-label="Explore the four sides of SLC">{areas.map((area) => <a className="area-card" href={`/${area.id}`} key={area.id} aria-label={`Explore SLC ${area.name}`}>
        <span className="area-circle"><AreaIcon area={area.id} /></span>
        <h2>{area.name}</h2>
        {area.status === "Coming soon" && <p className="area-status">Coming soon</p>}
      </a>)}</nav>
    </section>
    <section className="community-banner"><p className="eyebrow">PARTNER WITH SLC</p><h2>Join the movement.</h2><p>Have an idea for something we could build together?</p><a href="/partners">Tell us about it →</a></section>
  </Storefront>;
}
