import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="top">
      <Link className="brand" href="/" aria-label="T-Tensor home">
        <Logo />
        <span>T-Tensor</span>
        <small>AI thyroid tracking</small>
      </Link>
      <Link className="nav-cta" href="/#join">
        Join the waitlist
      </Link>
    </header>
  );
}
