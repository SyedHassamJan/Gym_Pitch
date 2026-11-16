import { offer, whatsappLink } from "@/lib/content";

type TrialButtonProps = {
  label?: string;
  message?: string;
  variant?: "primary" | "quiet";
  size?: "sm" | "md" | "xl";
  className?: string;
};

/** The one offer: a slanted button that opens WhatsApp with a message ready. */
export function TrialButton({ label = offer.cta, message, variant = "primary", size = "md", className = "" }: TrialButtonProps) {
  const cls = ["btn", variant === "quiet" && "btn--quiet", size === "sm" && "btn--sm", size === "xl" && "btn--xl", className]
    .filter(Boolean)
    .join(" ");
  return (
    <a className={cls} href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
      <span className="btn__label">{label}</span>
      <span className="visually-hidden"> (opens WhatsApp)</span>
    </a>
  );
}
