import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Paprika Smart Meal Planner",
  description: "Import recipes from Paprika",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="site-logo" href="/">
            Paprika Smart Meal Planner
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/import">Import</Link>
            <Link href="/recipes">Recipes</Link>
            <Link href="/plan">Plan</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
