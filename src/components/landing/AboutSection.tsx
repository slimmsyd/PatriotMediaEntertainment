"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutCopy } from "@/lib/content-defaults";

export function AboutSection() {
  return (
    <section id="about" className="pme-about" aria-label="Who we are">
      <div className="pme-about__flag" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="pme-about__grid">
        <div className="pme-about__copy">
          <p className="pme-about__eyebrow">
            <span aria-hidden="true" />
            {aboutCopy.eyebrow}
          </p>

          <h2 className="pme-about__title">{aboutCopy.title}</h2>

          <p className="pme-about__lead">{aboutCopy.lead}</p>

          <div className="pme-about__detail">
            {aboutCopy.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link className="pme-about__cta" href={aboutCopy.ctaHref}>
            {aboutCopy.cta}
            <span aria-hidden="true">&rsaquo;</span>
          </Link>
        </div>

        <figure className="pme-about__media">
          <div className="pme-about__frame">
            <Image
              src={aboutCopy.founderImage}
              alt={aboutCopy.founderImageAlt}
              fill
              sizes="(max-width: 730px) 92vw, 42vw"
            />
          </div>
          <figcaption className="pme-about__credit">
            <span className="pme-about__name">{aboutCopy.founderName}</span>
            <span className="pme-about__role">{aboutCopy.founderRole}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
