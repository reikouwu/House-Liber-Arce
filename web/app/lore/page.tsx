type Section = { id: string; name: string };

export default async function LorePage() {
  const res = await fetch("http://localhost:8000/lore/sections", {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 20 }}>
        <h1>House Liber Arce — Lore Sections</h1>
        <p>Failed to load lore sections.</p>
        <p>Status: {res.status}</p>
      </main>
    );
  }

  const sections: Section[] = await res.json();

  return (
    <main style={{ padding: 20 }}>
      <h1>House Liber Arce — Lore Sections</h1>
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong>{" "}
            <span style={{ opacity: 0.6 }}>({s.id})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

