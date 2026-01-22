export default function Home() {
  return (
    <>
      <style>{`
        :root {
          --bg: #121212;
          --panel: #181818;
          --text: #eaeaea;
          --muted: #a0a0a0;
          --accent: linear-gradient(90deg, #b11226, #7a2cff);
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 48px;
          border-bottom: 1px solid #222;
        }

        .brand {
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .nav-links {
          display: flex;
          gap: 28px;
          font-size: 14px;
        }

        .nav-links span {
          color: var(--muted);
          cursor: default;
        }

        .nav-links .active {
          color: white;
          position: relative;
        }

        .nav-links .active::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
        }

        .container {
          max-width: 980px;
          margin: 0 auto;
          padding: 120px 48px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          font-size: 12px;
          border-radius: 999px;
          background: var(--panel);
          color: var(--muted);
          margin-bottom: 22px;
          border: 1px solid #222;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent);
        }

        h1 {
          font-size: 46px;
          line-height: 1.08;
          font-weight: 800;
          margin: 0 0 22px 0;
        }

        .gradient-text {
          background: var(--accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          max-width: 720px;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.65;
          margin: 0 0 34px 0;
        }

        .subpoints {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin: 0 0 44px 0;
          color: #b8b8b8;
          font-size: 13px;
        }

        .pill {
          padding: 8px 12px;
          border-radius: 999px;
          background: #151515;
          border: 1px solid #222;
        }

        .actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .primary {
          padding: 12px 22px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          color: white;
          background: var(--accent);
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 0 22px rgba(122, 44, 255, 0.35);
        }

        .secondary {
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 600;
          background: transparent;
          color: var(--text);
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          cursor: pointer;
        }

        .cardRow {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .card {
          background: var(--panel);
          border: 1px solid #222;
          border-radius: 14px;
          padding: 16px;
        }

        .cardTitle {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .cardText {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .container { padding: 96px 22px; }
          .nav { padding: 18px 22px; }
          .cardRow { grid-template-columns: 1fr; }
          h1 { font-size: 38px; }
        }
      `}</style>

      {/* Navbar */}
      <header className="nav">
        <div className="brand">House Liber Arce</div>

        <nav className="nav-links">
          <span className="active">Home</span>
          <span>Chat</span>
          <span>Lore Library</span>
          <span>Import Lore</span>
          <span>Staff Console</span>
      </nav>
</header>

<main className="container">
  <h1>
    Roleplay scenes generated from your{" "}
    <span className="gradient-text">canon lore</span>.
  </h1>

  <p>
    House Liber Arce is a roleplay AI system that uses community-written lore to generate
    text scenes, scenarios, and story hooks. Lore is stored in a structured database,
    organized into sections like a Discord server, and can be updated over time so the AI
    stays consistent with your world.
  </p>

  <div className="actions">
    <button className="primary">Start Roleplay Chat</button>
    <button className="secondary">Open Lore Library</button>
  </div>
</main>
    </>
  );
}