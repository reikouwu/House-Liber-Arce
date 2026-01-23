import Link from "next/link";

type Channel = { id: string; name: string };
type Category = { category: string; channels: Channel[] };

export const dynamic = "force-dynamic";

export default async function StaffConsolePage() {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${api}/sections`, { cache: "no-store" });
    if (!res.ok) {
      error = `Backend returned ${res.status}`;
    } else {
      categories = await res.json();
    }
  } catch {
    error = `Could not connect to backend at ${api}. Make sure FastAPI is running.`;
  }

  // Default selected channel shown in the main area (like Discord opens a channel)
  const defaultChannelId = "mission-planning";

  // Helper to render a channel link (active state in sidebar)
  const renderChannel = (ch: Channel, badgeText: string) => {
    const isActive = ch.id === defaultChannelId;

    return (
      <Link
        key={ch.id}
        href={`/staff/${ch.id}`}
        className={`hla-channel ${isActive ? "hla-channel-active" : ""}`}
      >
        <div>
          <span className="hla-hash">#</span>
          {ch.name}
        </div>
        <span className="hla-badge">{badgeText}</span>
      </Link>
    );
  };

  return (
    <div className="hla-app">
      {/* TOP BAR */}
      <header className="hla-topbar">
        <div className="hla-brand">
          <div className="hla-logo" />
          House Liber Arce
        </div>

        <nav className="hla-nav">
          <Link href="/">Home</Link>
          <Link href="/lore">Lore</Link>
          <Link href="/staff" className="hla-active">
            Staff Console
          </Link>
          <Link href="/status">Status</Link>
        </nav>

        <div className="hla-actions">
          <div className="hla-pill">Role: Staff</div>
          <button className="hla-button">Settings</button>
          <button className="hla-button hla-primary">Open AI</button>
        </div>
      </header>

      {/* 3-COLUMN LAYOUT */}
      <div className="hla-content">
        {/* SIDEBAR */}
        <aside className="hla-sidebar">
          <div className="hla-sidebar-header">
            <input className="hla-search" placeholder="Search channels…" />
          </div>

          {error ? (
            <>
              <div className="hla-group">Backend Error</div>
              <div className="hla-channel-list">
                <div className="hla-msg">
                  <div className="hla-msg-meta">
                    <span>Connection</span>
                    <span>—</span>
                  </div>
                  <div className="hla-msg-text">{error}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Render categories + channels from backend */}
              {categories.map((cat) => (
                <div key={cat.category}>
                  <div className="hla-group">{cat.category}</div>
                  <div className="hla-channel-list">
                    {cat.channels.map((ch) => {
                      // Simple badge logic (you can replace this later with real role rules)
                      const badge =
                        ch.id === "world-lore" || ch.id === "character-goals"
                          ? "public"
                          : "staff";
                      return renderChannel(ch, badge);
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </aside>

        {/* MAIN PANEL (overview / default channel prompt) */}
        <section className="hla-main">
          <div className="hla-main-header">
            <div>
              <div className="hla-title">Staff Console</div>
              <div className="hla-subtitle">
                Select a channel on the left to view and post entries.
              </div>
            </div>

            <Link
              className="hla-button"
              href={`/staff/${defaultChannelId}`}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Open #{defaultChannelId}
            </Link>
          </div>

          <div className="hla-feed">
            <div className="hla-msg">
              <div className="hla-msg-meta">
                <span>Getting started</span>
                <span>—</span>
              </div>
              <div className="hla-msg-text">
                This console is organized like Discord channels. Staff can add lore entries, mission plans,
                summaries, and discoveries inside each section. Use the sidebar to open a channel.
              </div>
            </div>

            <div className="hla-msg">
              <div className="hla-msg-meta">
                <span>Suggested next step</span>
                <span>—</span>
              </div>
              <div className="hla-msg-text">
                Open <strong>#{defaultChannelId}</strong> to view the live feed and create a post.
              </div>
            </div>
          </div>

          <div className="hla-composer">
            <div className="hla-msg">
              <div className="hla-msg-meta">
                <span>Note</span>
                <span>UI only</span>
              </div>
              <div className="hla-msg-text">
                Posting happens inside a specific channel page (e.g. /staff/mission-planning).
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="hla-right">
          <div className="hla-right-header">AI Tools (UI only)</div>
          <div className="hla-right-body">
            <div className="hla-card">
              <div className="hla-card-title">Ask the AI (role-aware)</div>
              <input
                className="hla-input"
                placeholder="Summarize a channel and extract learned lore…"
              />
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button className="hla-button hla-primary" style={{ flex: 1 }}>
                  Run
                </button>
                <button className="hla-button" style={{ flex: 1 }}>
                  Clear
                </button>
              </div>
            </div>

            <div className="hla-card">
              <div className="hla-card-title">Approval Queue</div>
              <div className="hla-list">
                <div className="hla-item">
                  <span>NPC Proposal</span>
                  <span className="hla-tag">review</span>
                </div>
                <div className="hla-item">
                  <span>Lore Proposal</span>
                  <span className="hla-tag">review</span>
                </div>
                <div className="hla-item">
                  <span>Learned Lore Extract</span>
                  <span className="hla-tag">draft</span>
                </div>
              </div>
            </div>

            <div className="hla-card">
              <div className="hla-card-title">Quick Actions</div>
              <div className="hla-list">
                <div className="hla-item">
                  <span>Create mission template</span>
                  <span className="hla-tag">open</span>
                </div>
                <div className="hla-item">
                  <span>Generate scenario hooks</span>
                  <span className="hla-tag">open</span>
                </div>
                <div className="hla-item">
                  <span>Export summary</span>
                  <span className="hla-tag">open</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
