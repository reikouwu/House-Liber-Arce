
"use client";

import { useState } from "react";

export default function PostForm({ sectionId }: { sectionId: string }) {
  const [author, setAuthor] = useState("Staff");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("mission, canon, npc");
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
    setStatus("Posted. Refreshing…");
    window.location.reload();
  }

  return (
    <div className="hla-form">
      <h3 className="hla-form-title">New Post</h3>

      <div className="hla-form-grid">
        <div>
          <label className="hla-label">Author</label>
          <input
            className="hla-field"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div>
          <label className="hla-label">Tags (comma-separated)</label>
          <input
            className="hla-field"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="mission, canon, npc"
          />
        </div>

        <div>
          <label className="hla-label">Content</label>
          <textarea
            className="hla-field hla-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a lore entry, mission note, recap, etc."
          />
        </div>

        <div className="hla-form-actions">
          <button className="hla-button hla-primary" onClick={submit}>
            Post
          </button>
        </div>

        {status ? <div className="hla-status">{status}</div> : null}
      </div>
    </div>
  );
}
