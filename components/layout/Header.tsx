import { nav, offer, site } from "@/lib/content";
import { TrialButton } from "@/components/ui/TrialButton";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="wordmark" aria-label={`${site.name}, back to top`}>
          {site.name}
        </a>
        <nav className="site-nav" aria-label="Main">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <TrialButton size="sm" className="header-cta header-cta--full" />
        <TrialButton size="sm" label={offer.ctaShort} className="header-cta header-cta--short" />
        <MobileMenu />
      </div>
    </header>
  );
}
