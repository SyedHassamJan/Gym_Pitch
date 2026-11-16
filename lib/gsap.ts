// Loaded on demand by useMotion (dynamic import), so GSAP never sits on the critical path.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
