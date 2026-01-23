import Link from "next/link";
import PostForm from "./post-form";

type Channel = { id: string; name: string };
type Category = { category: string; channels: Channel[] };

type Post = {
  id: string;
  author: string;
  created_at: string;
  content: string;
  tags: string[];
};

export const dynamic = "force-dynamic";

export default async function StaffChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sectionId } = await params;
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  // Load sections for sidebar
  let categories: Category[] = [];
  let sidebarError: string | null = null;

  try {
    const sectionsRes = await fetch(`${api}/sections`, { cache: "no-store" });
    if (!sectionsRes.ok) sidebarError = `Backend returned ${sectionsRes.status}`;
    else categories = await sectionsRes.json();
  } catch {
    sidebarError = `Could not connect to backend at ${api}`;
  }

  // Load posts for this channel
  let posts: Post[] = [];
  let postsError: string | null = null;

  try {
    const postsRes = await fetch(`${api}/sections/${sectionId}/posts`, { cache: "no-store" });
    if (!postsRes.ok) postsError = `Backend returned ${postsRes.status}`;
    else posts = await postsRes.json();
  } catch {
    postsError = "Could not load posts (backend unreachable).";
  }

  // Helper: render sidebar channel link with active state
  const renderChannel = (ch: Channel, badgeText: string) => {
    const isActive = ch.id === sectionId;
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

          {sidebarError ? (
            <>
              <div className="hla-group">Backend Error</div>
              <div className="hla-channel-list">
                <div className="hla-msg">
                  <div className="hla-msg-meta">
                    <span>Connection</span>
                    <span>—</span>
                  </div>
                  <div className="hla-msg-text">{sidebarError}</div>
                </div>
              </div>
            </>
          ) : (
            categories.map((cat) => (
              <div key={cat.category}>
                <div className="hla-group">{cat.category}</div>
                <div className="hla-channel-list">
                  {cat.channels.map((ch) => {
                    // Simple badge logic for now (until auth/roles)
                    const badge =
                      ch.id === "world-lore" || ch.id === "character-goals"
                        ? "public"
                        : "staff";
                    return renderChannel(ch, badge);
                  })}
                </div>
              </div>
            ))
          )}
        </aside>

        {/* MAIN FEED */}
        <section className="hla-main">
          <div className="hla-main-header">
            <div>
              <div className="hla-title"># {sectionId}</div>
              <div className="hla-subtitle">Staff channel feed (live data)</div>
            </div>

            <Link
              className="hla-button"
              href="/staff"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              Back
            </Link>
          </div>

          <div className="hla-feed">
            {postsError ? (
              <div className="hla-msg">
                <div className="hla-msg-meta">
                  <span>Error</span>
                  <span>—</span>
                </div>
                <div className="hla-msg-text">{postsError}</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="hla-msg">
                <div className="hla-msg-meta">
                  <span>System</span>
                  <span>—</span>
                </div>
                <div className="hla-msg-text">No posts yet. Create the first entry below.</div>
              </div>
            ) : (
              posts
                .slice()
                .reverse()
                .map((p) => (
                  <div key={p.id} className="hla-msg">
                    <div className="hla-msg-meta">
                      <span>{p.author}</span>
                      <span>{p.created_at ? new Date(p.created_at).toLocaleString() : ""}</span>
                    </div>
                    <div className="hla-msg-text">{p.content}</div>

                    {p.tags?.length ? (
                      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {p.tags.map((t, i) => (
                          <span key={`${t}-${i}`} className="hla-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
            )}
          </div>

          {/* POST COMPOSER */}
          <div className="hla-composer">
            <PostForm sectionId={sectionId} />
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="hla-right">
          <div className="hla-right-header">AI Tools (UI only)</div>
          <div className="hla-right-body">
            <div className="hla-card">
              <div className="hla-card-title">Ask the AI (role-aware)</div>
              <input className="hla-input" placeholder="Summarize this channel and extract learned lore…" />
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
