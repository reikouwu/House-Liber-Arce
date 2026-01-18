export default async function StatusPage() {
  const res = await fetch("http://localhost:8000/health", { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: 20 }}>
      <h1>Backend Status</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
