import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Paprika Smart Meal Planner</p>
        <h1>Bring your Paprika recipes with you.</h1>
        <p>
          Import a Paprika recipe export to see its ingredients and directions.
        </p>
        <Link className="button" href="/import">
          Import a recipe
        </Link>
      </section>
    </main>
  );
}
