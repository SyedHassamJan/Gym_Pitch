import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Programs } from "@/components/sections/Programs";
import { Coaches } from "@/components/sections/Coaches";
import { Membership } from "@/components/sections/Membership";
import { Proof } from "@/components/sections/Proof";
import { Faq } from "@/components/sections/Faq";
import { LeadForm } from "@/components/sections/LeadForm";
import { LazyBodyScan, LazyCalculator } from "@/components/sections/lazy";
import { BodyScanFallback } from "@/components/sections/BodyScanFallback";
import { CalculatorFallback } from "@/components/sections/CalculatorFallback";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/lib/content";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="preloader" aria-hidden="true">
        <span className="preloader__mark">{site.name}</span>
        <span className="preloader__bar" />
      </div>
      <SmoothScroll />
      <span id="top" />
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <About />
        <LazyBodyScan>
          <BodyScanFallback />
        </LazyBodyScan>
        <Programs />
        <LazyCalculator>
          <CalculatorFallback />
        </LazyCalculator>
        <Coaches />
        <Membership />
        <Proof />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
