import Image from "next/image";
import { testimonials, transformations } from "@/lib/content";
import { Parallax } from "@/components/motion/Parallax";
import { TrialButton } from "@/components/ui/TrialButton";
import { Reveal } from "@/components/motion/Reveal";

const speeds = ["-14", "10", "-6"];

export function Proof() {
  const cols = [0, 1, 2].map((c) => transformations.filter((_, i) => i % 3 === c));

  return (
    <section className="section section--loose" id="results" aria-labelledby="results-title">
      <div className="container">
        <div className="proof__head">
          <h2 id="results-title" className="display h-section">
            Earned on this floor
          </h2>
          <Reveal className="quotes">
            {testimonials.length ? (
              testimonials.slice(0, 2).map((t) => (
                <figure key={t.name} className="quote">
                  <blockquote>
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption>
                    {t.name}
                    {t.detail ? `, ${t.detail}` : ""}
                  </figcaption>
                </figure>
              ))
            ) : (
              <figure className="quote">
                <blockquote>
                  <p>
                    <span className="fill">a member&rsquo;s own words, with their name</span>
                  </p>
                </blockquote>
                <figcaption className="small">Member stories appear here as they are collected.</figcaption>
              </figure>
            )}
          </Reveal>
        </div>

        <Parallax className="gallery">
          {cols.map((col, c) => (
            <div key={c} className="gallery__col" data-speed={speeds[c]}>
              {col.map((img, i) => (
                <div
                  key={img.src}
                  className={(c + i) % 2 === 0 ? "gallery__photo gallery__photo--tall" : "gallery__photo"}
                  data-slot={`result-${c}-${i}`}
                  data-alt="A member's progress photo, shared with consent"
                >
                  <Image src={img.src} alt={img.alt} fill sizes="(max-width: 60rem) 50vw, 30vw" quality={70} />
                </div>
              ))}
            </div>
          ))}
        </Parallax>

        <div className="proof__cta">
          <TrialButton />
        </div>
      </div>
    </section>
  );
}
