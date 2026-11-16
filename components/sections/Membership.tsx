import { plans, formatPrice, offer } from "@/lib/content";
import { TrialButton } from "@/components/ui/TrialButton";
import { FeaturedScale } from "@/components/motion/FeaturedScale";

export function Membership() {
  return (
    <section className="section theme-bone" id="membership" aria-labelledby="membership-title">
      <div className="container">
        <div className="section__head">
          <h2 id="membership-title" className="display h-section">
            Three plans, priced by the month
          </h2>
          <p className="lead">Every plan starts with the free trial class.</p>
        </div>
        <FeaturedScale>
          <ul className="plans">
            {plans.map((p) => (
              <li key={p.id} className={p.featured ? "plan plan--featured" : "plan"} data-featured={p.featured || undefined}>
                <div className="plan__name">
                  <h3 className="h-title">{p.name}</h3>
                  {p.featured && <span className="plan__tag">Recommended</span>}
                </div>
                <p className="plan__price">
                  <span className="plan__amount num">
                    {formatPrice(p.price)}
                  </span>
                  <span className="plan__unit">a month</span>
                </p>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {p.featured ? (
                  <TrialButton message={`Hi FitPro, I'd like to book my free trial class. I'm interested in the ${p.name} plan.`} />
                ) : (
                  <TrialButton
                    variant="quiet"
                    label={`Start with ${p.name}`}
                    message={`Hi FitPro, I'd like to book my free trial class. I'm interested in the ${p.name} plan.`}
                  />
                )}
              </li>
            ))}
          </ul>
        </FeaturedScale>
        <p className="small" style={{ marginTop: "var(--space-lg)" }}>
          {offer.afterClick}
        </p>
      </div>
    </section>
  );
}
