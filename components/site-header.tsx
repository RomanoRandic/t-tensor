import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="top" id="top">
      <Link className="brand" href="/" aria-label="Thyra home">
        <Logo />
        thyra
      </Link>
      <nav aria-label="Main">
        <Link className="plain" href="/#how">
          How it works
        </Link>
        <Link className="plain" href="/#next">
          What&apos;s next
        </Link>
        <Link className="nav-cta" href="/#get">
          Get Thyra
        </Link>
      </nav>
    </header>
  );
}
