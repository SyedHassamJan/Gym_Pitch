import { site, hours, offer, nav, credits, schedule } from "@/lib/content";
import { TrialButton } from "@/components/ui/TrialButton";
import { Magnetic } from "@/components/motion/Magnetic";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address ? `${site.address}, ${site.city}` : site.mapsQuery)}`;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <p className="display footer-cta__title">Start with one free class</p>
          <div className="footer-cta__action">
            <Magnetic>
              <TrialButton size="xl" />
            </Magnetic>
            <p className="small">{offer.afterClick}</p>
          </div>
        </div>

        <div className="ledger">
          <div>
            <h2>Visit</h2>
            <p>
              {site.address && (
                <>
                  {site.address}
                  <br />
                </>
              )}
              {site.city}, Pakistan
            </p>
            <p>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </p>
          </div>
          <div>
            <h2>Hours</h2>
            <p>
              {hours.label}
              <br />
              <span className="num">
                {hours.open} to {hours.close}
              </span>
            </p>
          </div>
          <div>
            <h2>Classes</h2>
            <p>
              Group classes daily at <span className="num">{schedule[0].time.split(" ")[0]}</span>
              <br />
              <a href="#about">See this week&rsquo;s timetable</a>
            </p>
          </div>
          <div>
            <h2>Contact</h2>
            <ul>
              <li>
                WhatsApp{" "}
                <a className="nowrap" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  {site.whatsappDisplay}
                </a>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              )}
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Updates</h2>
            <Newsletter />
          </div>
        </div>

        <div className="footer-base">
          <span>
            &copy; {site.copyrightYear} {site.name}, {site.city}
          </span>
          <nav aria-label="Footer">
            {nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <p className="credits" data-credits>
            Photographs: FitPro template library;{" "}
            {credits.map((c, i) => (
              <span key={c.href}>
                {i > 0 && ", "}
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.label}
                </a>{" "}
                ({c.licence}, Wikimedia Commons)
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
