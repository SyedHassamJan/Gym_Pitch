import Image from "next/image";
import { hero, offer } from "@/lib/content";
import { TrialButton } from "@/components/ui/TrialButton";
import { HeroIntro } from "@/components/motion/HeroIntro";

export function Hero() {
  return (
    <HeroIntro>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 id="hero-title" className="display hero__title">
              {hero.headline.map((line) => (
                <span key={line} className="line">
                  <span className="line__inner" data-hero-line>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero__sentence" data-hero-fade>
              {hero.sentence}
            </p>
            <div className="hero__actions" data-hero-fade>
              <TrialButton />
              <p className="hero__next">{offer.afterClick}</p>
            </div>
          </div>

          <div className="hero__frame" data-slot="hero" data-alt="A member mid-lift on the FitPro floor, shot dark">
            <div className="hero__shot" data-hero-shot>
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                preload
                fetchPriority="high"
                sizes="(max-width: 60rem) 92vw, 50vw"
                quality={75}
              />
            </div>
            <div className="hero__curtain" data-hero-curtain aria-hidden="true" />
          </div>
        </div>
      </section>
    </HeroIntro>
  );
}
