import { stats } from "@/lib/content";
import { Counter } from "@/components/motion/Counter";

export function Stats() {
  return (
    <section className="stats" aria-label="FitPro in numbers">
      <dl className="container stats__row">
        {stats.map((s) => (
          <div key={s.label} className="stats__item">
            <dt className="stats__label">{s.label}</dt>
            <dd className="stats__figure" style={{ order: -1 }}>
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
