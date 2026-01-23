import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <header className="hla-nav">
        <div className="hla-brand">House Liber Arce</div>

        <nav className="hla-nav-links">
          <Link className="hla-active" href="/">Home</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/lore">Lore Library</Link>
          <Link href="/import">Import Lore</Link>
          <Link href="/staff">Staff Console</Link>
        </nav>
      </header>

      <main className="hla-container">
        <h1>
          Roleplay scenes generated from your{" "}
          <span className="hla-gradient-text">canon lore</span>.
        </h1>

        <p>
          House Liber Arce is a roleplay AI system that uses community-written lore to generate text
          scenes, scenarios, and story hooks. Lore is stored in a structured database, organized into
          sections like a Discord server, and can be updated over time so the AI stays consistent with
          your world.
        </p>

        <div className="hla-actions">
          <Link className="hla-primary" href="/chat">Start Roleplay Chat</Link>
          <Link className="hla-secondary" href="/lore">Open Lore Library</Link>
        </div>
      </main>
    </>
  );
}
