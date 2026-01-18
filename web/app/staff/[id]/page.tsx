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
  params: { id: string };
}) {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const sectionId = params.id;
  if (!sectionId) {
    return (
      <main style={{ padding: 20 }}>
        <p>
          <Link href="/staff">← Back</Link>
        </p>
        <h1>Invalid section</h1>
        <p>Route param was missing.</p>
      </main>
    );
  }

  const res = await fetch(`${api}/sections/${sectionId}/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 20 }}>
        <p>
          <Link href="/staff">← Back</Link>
        </p>
        <h1>#{sectionId}</h1>
        <p>Could not load posts. Status: {res.status}</p>
      </main>
    );
  }

  const posts: Post[] = await res.json();

  return (
    <main style={{ padding: 20, maxWidth: 900 }}>
      <p>
        <Link href="/staff">← Back</Link>
      </p>

      <h1>#{sectionId}</h1>

      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <PostForm sectionId={sectionId} />
      </div>

      <hr />

      <div style={{ marginTop: 24 }}>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts
            .slice()
            .reverse()
            .map((p) => (
              <article
                key={p.id}
                style={{
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{p.author}</strong>
                  <span style={{ opacity: 0.7, fontSize: 12 }}>
                    {new Date(p.created_at).toLocaleString()}
                  </span>
                </div>

                <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{p.content}</p>

                {p.tags?.length ? (
                  <div style={{ marginTop: 8, opacity: 0.8, fontSize: 12 }}>
                    Tags: {p.tags.join(", ")}
                  </div>
                ) : null}
              </article>
            ))
        )}
      </div>
    </main>
  );
}
