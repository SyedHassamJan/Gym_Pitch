import Image from "next/image";
import { programs, schedule } from "@/lib/content";
import { ProgramStack } from "@/components/motion/ProgramStack";
import { TrialButton } from "@/components/ui/TrialButton";

function whenFor(id: string) {
  const days = schedule.filter((s) => s.program === id).map((s) => s.day);
  if (!days.length) return "By appointment with your coach";
  return `${days.join(" and ")}, ${schedule[0].time.split(" ")[0]}`;
}

export function Programs() {
  return (
    <section className="section" id="programs" aria-labelledby="programs-title">
      <div className="container">
        <div className="section__head">
          <h2 id="programs-title" className="display h-section">
            Four ways to train at FitPro
          </h2>
        </div>
        <ProgramStack>
          {programs.map((p, i) => (
            <article key={p.id} className="program-card" style={{ ["--i" as string]: i }} data-program-card aria-labelledby={`program-${p.id}`}>
              <div className="program-card__body">
                <div>
                  <h3 id={`program-${p.id}`} className="h-title program-card__name">
                    {p.name.split(" ").map((w, j) => (
                      <span key={j}>
                        {j > 0 && " "}
                        {w.includes("-") ? <span className="nowrap">{w}</span> : w}
                      </span>
                    ))}
                  </h3>
                  <p className="lead">{p.body}</p>
                </div>
                <div>
                  <p className="program-card__when">
                    On the timetable: <b>{whenFor(p.id)}</b>
                  </p>
                  <TrialButton
                    variant="quiet"
                    size="sm"
                    label={`Try ${p.name}`}
                    message={`Hi FitPro, I'd like to book a free trial class: ${p.name}.`}
                  />
                </div>
              </div>
              <div className="program-card__photo" data-slot={`program-${p.id}`} data-alt={`A FitPro ${p.name} session`}>
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes="(max-width: 48rem) 92vw, 56vw"
                  quality={70}
                  style={{ objectPosition: p.image.position ?? "50% 50%" }}
                />
              </div>
              <div className="program-card__dim" data-program-dim aria-hidden="true" />
            </article>
          ))}
        </ProgramStack>
      </div>
    </section>
  );
}
