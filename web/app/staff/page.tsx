import Link from "next/link";

type Channel = { id: string; name: string };
type Category = { category: string; channels: Channel[] };

export default async function StaffPage() {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const res = await fetch(`${api}/sections`, { cache: "no-store" });
  const categories: Category[] = await res.json();

  return (
    <main style={{ display: "flex", gap: 24, padding: 20 }}>
      <aside style={{ width: 320 }}>
        <h2>Staff Sections</h2>

        {categories.map((cat) => (
          <div key={cat.category} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{cat.category}</div>

            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {cat.channels.map((ch) => (
                <li key={ch.id} style={{ marginBottom: 6 }}>
                  <Link href={`/staff/${ch.id}`}># {ch.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <section style={{ flex: 1 }}>
        <h1>House Liber Arce — Staff Console</h1>
        <p>Select a channel on the left to view and post entries.</p>
      </section>
    </main>
  );
}
