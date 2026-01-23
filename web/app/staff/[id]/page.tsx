import Link from "next/link";
import PostForm from "./post-form";

type Post = {
  id: string;
  author: string;
  created_at: string;
  content: string;
  tags: string[];
};

export const dynamic = "force-dynamic";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sectionId } = await params;
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  // Fetch posts for this channel
  const res = await fetch(`${api}/sections/${sectionId}/posts`, { cache: "no-store" });
  const posts: Post[] = res.ok ? await res.json() : [];

  return (
    <>
      <style>{`
        :root {
          --bg: #121212;
          --panel: #171717;
          --panel2: #141414;
          --border: #242424;
          --text: #eaeaea;
          --muted: #a0a0a0;
          --accent: linear-gradient(90deg, #b11226, #7a2cff);
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
        }

        .app {
          height: 100vh;
          display: grid;
          grid-template-rows: 64px 1fr;
        }

        /* Top bar */
        .topbar {
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          background: rgba(18,18,18,0.92);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          letter-spacing: 0.4px;
        }

        .logo {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--accent);
          box-shadow: 0 0 18px rgba(122, 44, 255, 0.25);
        }

        .nav {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: var(--muted);
        }

        .nav a {
          color: var(--muted);
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid transparent;
        }

        .nav a.active {
          color: var(--text);
          border-color: var(--border);
          background: var(--panel);
          position: relative;
        }

        .nav a.active::after {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: -1px;
          height: 2px;
          background: var(--accent);
          border-radius: 999px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pill {
          padding: 8px 12px;
          border-radius: 999px;
          background: var(--panel);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 12px;
        }

        .button {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--panel);
          color: var(--text);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .button.primary {
          border: none;
          background: var(--accent);
          box-shadow: 0 0 20px rgba(177, 18, 38, 0.22);
        }

        /* Layout */
        .content {
          display: grid;
          grid-template-columns: 320px 1fr 360px;
          gap: 14px;
          padding: 14px;
          height: calc(100vh - 64px);
        }

        /* Sidebar */
        .sidebar {
          border: 1px solid var(--border);
          background: var(--panel2);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .sidebarHeader {
          padding: 14px;
          border-bottom: 1px solid var(--border);
        }

        .search {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #101010;
          color: var(--text);
          outline: none;
          font-size: 13px;
        }

        .group {
          padding: 12px 12px 6px 12px;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .channelList {
          padding: 0 8px 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .channelLink {
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--muted);
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
        }

        .channelLink:hover {
          background: #151515;
          border-color: #2a2a2a;
          color: var(--text);
        }

        .channelActive {
          color: var(--text);
          background: var(--panel);
          border-color: var(--border);
        }

        .hash {
          margin-right: 6px;
          color: #6f6f6f;
        }

        .badgeSmall {
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--muted);
          background: #111;
        }

        /* Main feed */
        .main {
          border: 1px solid var(--border);
          background: var(--panel2);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .mainHeader {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .titleLine {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .title {
          font-size: 15px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subtitle {
          font-size: 12px;
          color: var(--muted);
        }

        .feed {
          padding: 16px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
        }

        .msg {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: #151515;
        }

        .msgMeta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 6px;
          gap: 12px;
        }

        .msgText {
          font-size: 13px;
          line-height: 1.55;
          color: var(--text);
          white-space: pre-wrap;
        }

        .composer {
          padding: 14px;
          border-top: 1px solid var(--border);
          background: #141414;
        }

        /* Right panel */
        .right {
          border: 1px solid var(--border);
          background: var(--panel2);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .rightHeader {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          font-weight: 800;
          font-size: 13px;
        }

        .rightBody {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow: auto;
          min-height: 0;
        }

        .miniCard {
          border: 1px solid var(--border);
          background: #151515;
          border-radius: 14px;
          padding: 12px;
        }

        .miniTitle {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .miniInput {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #101010;
          color: var(--text);
          outline: none;
          font-size: 13px;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #121212;
          color: var(--text);
          font-size: 13px;
          gap: 12px;
        }

        .tag {
          font-size: 11px;
          color: var(--muted);
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #101010;
          white-space: nowrap;
        }

        @media (max-width: 1100px) {
          .content { grid-template-columns: 280px 1fr; }
          .right { display: none; }
        }

        @media (max-width: 820px) {
          .content { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .nav { display: none; }
        }
      `}</style>

      <div className="app">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="brand">
            <div className="logo" />
            House Liber Arce
          </div>

          <div className="nav">
            <a href="/">Home</a>
            <a href="/lore">Lore</a>
            <a className="active" href="/staff">Staff Console</a>
            <a href="/status">Status</a>
          </div>

          <div className="actions">
            <div className="pill">Role: Staff</div>
            <button className="button">Settings</button>
            <button className="button primary">Open AI</button>
          </div>
        </header>

        {/* 3-COLUMN LAYOUT */}
        <div className="content">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebarHeader">
              <input className="search" placeholder="Search channels…" />
            </div>

            <div className="group">DM Pit of Doom</div>
            <div className="channelList">
              <Link
                className={`channelLink ${sectionId === "mission-planning" ? "channelActive" : ""}`}
                href="/staff/mission-planning"
              >
                <div><span className="hash">#</span>mission-planning</div>
                <span className="badgeSmall">staff</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "roleplay-summary" ? "channelActive" : ""}`}
                href="/staff/roleplay-summary"
              >
                <div><span className="hash">#</span>roleplay-summary</div>
                <span className="badgeSmall">staff</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "case-archive" ? "channelActive" : ""}`}
                href="/staff/case-archive"
              >
                <div><span className="hash">#</span>case-archive</div>
                <span className="badgeSmall">staff</span>
              </Link>
            </div>

            <div className="group">Lorewriter Hellscape</div>
            <div className="channelList">
              <Link
                className={`channelLink ${sectionId === "npcs" ? "channelActive" : ""}`}
                href="/staff/npcs"
              >
                <div><span className="hash">#</span>npcs</div>
                <span className="badgeSmall">staff</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "lore-proposals" ? "channelActive" : ""}`}
                href="/staff/lore-proposals"
              >
                <div><span className="hash">#</span>lore-proposals</div>
                <span className="badgeSmall">staff</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "final-review" ? "channelActive" : ""}`}
                href="/staff/final-review"
              >
                <div><span className="hash">#</span>final-review</div>
                <span className="badgeSmall">head dm</span>
              </Link>
            </div>

            <div className="group">Player Discoveries</div>
            <div className="channelList">
              <Link
                className={`channelLink ${sectionId === "world-lore" ? "channelActive" : ""}`}
                href="/staff/world-lore"
              >
                <div><span className="hash">#</span>world-lore</div>
                <span className="badgeSmall">public</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "learned-lore" ? "channelActive" : ""}`}
                href="/staff/learned-lore"
              >
                <div><span className="hash">#</span>learned-lore</div>
                <span className="badgeSmall">staff</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "artifacts" ? "channelActive" : ""}`}
                href="/staff/artifacts"
              >
                <div><span className="hash">#</span>artifacts</div>
                <span className="badgeSmall">staff</span>
              </Link>

              <Link
                className={`channelLink ${sectionId === "character-goals" ? "channelActive" : ""}`}
                href="/staff/character-goals"
              >
                <div><span className="hash">#</span>character-goals</div>
                <span className="badgeSmall">public</span>
              </Link>
            </div>
          </aside>

          {/* MAIN FEED */}
          <section className="main">
            <div className="mainHeader">
              <div className="titleLine">
                <div className="title"># {sectionId}</div>
                <div className="subtitle">Staff channel feed (live data)</div>
              </div>

              <Link href="/staff" className="button" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Back
              </Link>
            </div>

            <div className="feed">
              {!res.ok ? (
                <div className="msg">
                  <div className="msgMeta">
                    <span>Error</span>
                    <span>Status {res.status}</span>
                  </div>
                  <div className="msgText">
                    Could not load posts for this section.
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="msg">
                  <div className="msgMeta">
                    <span>System</span>
                    <span>—</span>
                  </div>
                  <div className="msgText">No posts yet. Create the first entry below.</div>
                </div>
              ) : (
                posts
                  .slice()
                  .reverse()
                  .map((p) => (
                    <div key={p.id} className="msg">
                      <div className="msgMeta">
                        <span>{p.author}</span>
                        <span>{p.created_at ? new Date(p.created_at).toLocaleString() : ""}</span>
                      </div>
                      <div className="msgText">{p.content}</div>
                      {p.tags?.length ? (
                        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {p.tags.map((t, i) => (
                            <span key={`${t}-${i}`} className="tag">{t}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
              )}
            </div>

            {/* REAL composer uses your existing PostForm */}
            <div className="composer">
              <PostForm sectionId={sectionId} />
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className="right">
            <div className="rightHeader">AI Tools (UI only)</div>
            <div className="rightBody">
              <div className="miniCard">
                <div className="miniTitle">Ask the AI (role-aware)</div>
                <input className="miniInput" placeholder="Summarize this channel and extract learned lore…" />
                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                  <button className="button primary" style={{ flex: 1 }}>Run</button>
                  <button className="button" style={{ flex: 1 }}>Clear</button>
                </div>
              </div>

              <div className="miniCard">
                <div className="miniTitle">Approval Queue</div>
                <div className="list">
                  <div className="item">
                    <span>NPC Proposal</span>
                    <span className="tag">review</span>
                  </div>
                  <div className="item">
                    <span>Lore Proposal</span>
                    <span className="tag">review</span>
                  </div>
                  <div className="item">
                    <span>Learned Lore Extract</span>
                    <span className="tag">draft</span>
                  </div>
                </div>
              </div>

              <div className="miniCard">
                <div className="miniTitle">Quick Actions</div>
                <div className="list">
                  <div className="item">
                    <span>Create mission template</span>
                    <span className="tag">open</span>
                  </div>
                  <div className="item">
                    <span>Generate scenario hooks</span>
                    <span className="tag">open</span>
                  </div>
                  <div className="item">
                    <span>Export summary</span>
                    <span className="tag">open</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
