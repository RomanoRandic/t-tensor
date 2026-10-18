import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <nav className="footer-links" aria-label="Legal">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/privacy#consumer-health-data">Consumer Health Data Privacy Policy</Link>
        <Link href="/privacy#your-rights">Your privacy choices</Link>
      </nav>
      <span>T-Tensor is in development. We don&apos;t sell your data and we don&apos;t use ad trackers or cookies.</span>
      <span>Not a medical device. Not a substitute for professional medical advice, diagnosis or treatment.</span>
    </footer>
  );
}
