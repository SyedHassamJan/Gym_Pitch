import Image from "next/image";
import { trainers } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function Coaches() {
  return (
    <section className="section section--tight" id="coaches" aria-labelledby="coaches-title">
      <div className="container">
        <div className="section__head">
          <h2 id="coaches-title" className="display h-section">
            A coach for every program
          </h2>
        </div>
        <Reveal as="ul" className="coaches" stagger>
          {trainers.map((t) => (
            <li key={t.role} className="coach" data-reveal>
              <div className="coach__photo" data-slot={`coach-${t.role}`} data-alt={`Portrait of the ${t.role.toLowerCase()}`}>
                <Image src={t.image.src} alt={t.name ? t.name : t.image.alt} fill sizes="(max-width: 60rem) 46vw, 22vw" quality={70} />
              </div>
              <h3 className="h-title coach__role">{t.name ? t.name : t.role}</h3>
              <p>{t.name ? `${t.role}. ${t.focus}` : t.focus}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
