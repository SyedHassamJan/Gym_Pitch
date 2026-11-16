import { calculator } from "@/lib/content";

/** Server-rendered stand-in for the calculator: same box, explains itself without JavaScript. */
export function CalculatorFallback() {
  return (
    <section className="section theme-bone calc calc--fallback" id="calculator" aria-labelledby="calc-title">
      <div className="container">
        <div className="section__head">
          <h2 id="calc-title" className="display h-section">
            {calculator.heading}
          </h2>
          <p className="lead">{calculator.lede}</p>
          <noscript>
            <p>The calculator needs JavaScript. Ask a coach on WhatsApp for your numbers instead.</p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
