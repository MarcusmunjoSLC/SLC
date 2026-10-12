"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./landing-page.module.css";

const sectionCount = 7;

export default function LandingPage() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slc-section]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) return;

        const index = Number(
          (visible[0].target as HTMLElement).dataset.index
        );

        setActive(index);
      },
      {
        threshold: [0.35, 0.55, 0.75],
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const progress = (active + 1) / sectionCount;

  function panelClass(index: number, extra = "") {
    return `${styles.panel} ${
      active === index ? styles.active : ""
    } ${extra}`;
  }

  return (
    <main className={styles.page}>
      <div className={styles.progress}>
        <span
          style={{
            transform: `scaleX(${progress})`,
          }}
        />
      </div>

      <div className={styles.topbar}>
       <a href="/" className={styles.miniLogo}>
  <Image
    src="/soft-life-club-logo.png"
    alt="Soft Life Club"
    width={120}
    height={50}
    priority
  />
</a>

        <a href="/wardrobe" className={styles.enter}>
          ENTER SLC →
        </a>
      </div>

      {/* 01 — OPENING */}
      <section
        className={panelClass(0, styles.dark)}
        data-slc-section
        data-index="0"
      >
        <div className={styles.center}>
  

  <p className={styles.eyebrow}>
    SOFT LIFE CLUB
  </p>

  <h1 className={styles.heroTitle}>
            THIS IS BIGGER
            <br />
            THAN CLOTHES.
          </h1>

          <p className={styles.heroSub}>
            A new way to live.
          </p>

          <span className={styles.scrollHint}>
            SCROLL TO ENTER
          </span>
        </div>
      </section>

      {/* 02 — PHILOSOPHY */}
      <section
        className={panelClass(1, styles.paper)}
        data-slc-section
        data-index="1"
      >
        <div className={styles.statement}>
          <span>STYLE ISN&apos;T</span>
          <span>WHAT YOU WEAR.</span>

          <p>It&apos;s how you live.</p>
        </div>
      </section>

      {/* 03 — PROBLEM */}
      <section
        className={panelClass(2, styles.mocha)}
        data-slc-section
        data-index="2"
      >
        <div className={styles.fragmented}>
          <p>WEAR.</p>
          <p>MEET.</p>
          <p>GO.</p>
          <p>BELONG.</p>

          <h2>
            OUR LIVES ARE CONNECTED.
            <br />
            OUR PLATFORMS AREN&apos;T.
          </h2>
        </div>
      </section>

      {/* 04 — THE WORLD */}
      <section
        className={panelClass(3, styles.dark)}
        data-slc-section
        data-index="3"
      >
        <div className={styles.world}>
          <p className={styles.eyebrow}>
            ONE IDENTITY. ONE WORLD.
          </p>

          <h2>
            THE SLC
            <br />
            ECOSYSTEM.
          </h2>

          <div className={styles.worldGrid}>
            <a href="/wardrobe">
              <strong>01</strong>
              <h3>WARDROBE</h3>
              <p>Express it.</p>
            </a>

            <a href="/love">
              <strong>02</strong>
              <h3>LOVE</h3>
              <p>Share it.</p>
            </a>

            <a href="/escapes">
              <strong>03</strong>
              <h3>ESCAPES</h3>
              <p>Experience it.</p>
            </a>

            <a href="/society">
              <strong>04</strong>
              <h3>SOCIETY</h3>
              <p>Belong to it.</p>
            </a>
          </div>

          <p className={styles.heroSub}>
            Wardrobe is the entry point.
            <br />
            SLC is the world.
          </p>
        </div>
      </section>

      {/* 05 — BELONGING */}
      <section
        className={panelClass(4, styles.paper)}
        data-slc-section
        data-index="4"
      >
        <div className={styles.society}>
          <p className={styles.eyebrowDark}>
            SOCIETY
          </p>

          <h2>
            THE INTERNET
            <br />
            GAVE US FOLLOWERS.
          </h2>

          <h3>
            SLC GIVES US
            <br />
            SOMEWHERE TO BELONG.
          </h3>

          <div className={styles.divider} />

          <p>
            ONLINE WHEN YOU WANT IT.
            <br />
            REAL LIFE WHEN IT MATTERS.
          </p>
        </div>
      </section>

      {/* 06 — CULTURE */}
      <section
        className={panelClass(5, styles.dark)}
        data-slc-section
        data-index="5"
      >
        <div className={styles.language}>
          <p>PEACE OVER EVERYTHING.</p>
          <p>SOFT LIFE. HARD BOUNDARIES.</p>

          <span>NOT MERCHANDISE.</span>

          <strong>
            A SHARED LANGUAGE FOR
            <br />
            THE LIFE WE WANT.
          </strong>
        </div>
      </section>

      {/* 07 — FUTURE */}
      <section
        className={panelClass(6, styles.final)}
        data-slc-section
        data-index="6"
      >
        <div className={styles.finalInner}>
          <p className={styles.eyebrow}>
            WHAT COMES NEXT
          </p>

          <h2>
            THE FUTURE ISN&apos;T
            <br />
            ANOTHER FEED.
          </h2>

          <h3>
            IT&apos;S A LIFE
            <br />
            YOU CAN ACTUALLY LIVE.
          </h3>

         <div className={styles.finalBrand}>
  <Image
    src="/soft-life-club-logo.png"
    alt="Soft Life Club"
    width={200}
    height={90}
  />
</div>

          <div className={styles.finalLinks}>
            <a href="/wardrobe">
              WARDROBE
            </a>

            <a href="/love">
              LOVE
            </a>

            <a href="/escapes">
              ESCAPES
            </a>

            <a href="/society">
              SOCIETY
            </a>
          </div>

          <a
            className={styles.joinButton}
            href="/wardrobe"
          >
            ENTER SLC →
          </a>
        </div>
      </section>
    </main>
  );
}