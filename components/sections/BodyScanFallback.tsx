import { bodyScan, programName } from "@/lib/content";

/** Server-rendered stand-in for the body scan: same outer box, readable without JavaScript. */
export function BodyScanFallback() {
  return (
    <section className="scan" id="scan" aria-labelledby="scan-title">
      <div className="scan__pin">
        <div className="container scan__grid">
          <div className="scan__figure scan__figure--empty" aria-hidden="true" />
          <div className="scan__copy">
            <h2 id="scan-title" className="display h-section">
              {bodyScan.heading}
            </h2>
            <ul className="zone-list">
              {bodyScan.zones.map((z) => (
                <li key={z.id} className="zone-row is-lit">
                  <p className="zone-row__btn">
                    <span className="zone-row__name">{z.name}</span>
                    <span className="zone-row__tag">{programName(z.program)}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
