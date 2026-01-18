"use client";

import { useState } from "react";

export default function PostForm({ sectionId }: { sectionId: string }) {
  const [author, setAuthor] = useState("Staff");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  async function submit() {
    setStatus(null);

    if (!author.trim() || !content.trim()) {
      setStatus("Author and content are required.");
      return;
    }

    const payload = {
      author: author.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const res = await fetch(`${api}/sections/${sectionId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus(`Failed to post. Status: ${res.status}`);
      return;
    }

    setContent("");
    setTags("");
    setStatus("Posted. Refreshing…");
    window.location.reload();
  }

  return (
    <div style={{ padding: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>New Post</h3>

      <div style={{ display: "grid", gap: 8 }}>
        <label>
          Author
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          Tags (comma-separated)
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            placeholder="mission, canon, npc"
          />
        </label>

        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4, minHeight: 120 }}
            placeholder="Write a lore entry, mission note, recap, etc."
          />
        </label>

        <button onClick={submit} style={{ padding: 10, cursor: "pointer" }}>
          Post
        </button>

        {status ? <div style={{ opacity: 0.8 }}>{status}</div> : null}
      </div>
    </div>
  );
}
