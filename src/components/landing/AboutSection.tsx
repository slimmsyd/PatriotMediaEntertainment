"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutCopy } from "@/lib/content-defaults";
import type { AboutCopyValue } from "@/lib/cms/schemas";

type AboutSectionProps = {
  /** Editable copy from the database; falls back to the shipped wording. */
  copy?: AboutCopyValue;
};

export function AboutSection({ copy = aboutCopy }: AboutSectionProps) {
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
            {copy.eyebrow}
          </p>

          <h2 className="pme-about__title">{copy.title}</h2>

          <p className="pme-about__lead">{copy.lead}</p>

          <div className="pme-about__detail">
            {copy.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link className="pme-about__cta" href={copy.ctaHref}>
            {copy.cta}
            <span aria-hidden="true">&rsaquo;</span>
          </Link>
        </div>

        <figure className="pme-about__media">
          <div className="pme-about__frame">
            <Image
              src={copy.founderImage}
              alt={copy.founderImageAlt}
              fill
              sizes="(max-width: 730px) 92vw, 42vw"
            />
          </div>
          <figcaption className="pme-about__credit">
            <span className="pme-about__name">{copy.founderName}</span>
            <span className="pme-about__role">{copy.founderRole}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
