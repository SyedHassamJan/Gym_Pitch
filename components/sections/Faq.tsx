import { faq, site } from "@/lib/content";

export function Faq() {
  return (
    <section className="section theme-bone" id="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__intro">
          <h2 id="faq-title" className="display h-section">
            Before your first class
          </h2>
          <p className="lead">
            Anything else, ask on WhatsApp at{" "}
            <a className="nowrap" href={`https://wa.me/${site.whatsapp}`}>
              {site.whatsappDisplay}
            </a>
            .
          </p>
        </div>
        <div>
          {faq.map((item) => (
            <details key={item.q} className="qa" name="faq">
              <summary>
                {item.q}
                <svg className="qa__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="qa__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
