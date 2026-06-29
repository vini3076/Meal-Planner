import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Paprika Smart Meal Planner</p>
        <h1>Bring your Paprika recipes with you.</h1>
        <p>
          Import Paprika recipes, save them to your library, and start planning from what you already have.
        </p>
        <div className="home-actions">
          <Link className="button" href="/import">
            Import recipes
          </Link>
          <Link className="secondary-button" href="/plan">
            Start planning
          </Link>
        </div>
      </section>
    </main>
  );
}
