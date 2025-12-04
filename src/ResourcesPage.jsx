import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resources`);
        if (!res.ok) throw new Error("Failed to load resources.");
        const data = await res.json();
        setResources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>FrancoPass Resources</h1>
      {resources.length === 0 ? (
        <p>No resources found.</p>
      ) : (
        <ul>
          {resources.map((r) => (
            <li key={r._id}>
              <strong>{r.title}</strong> — {r.resourceType} ({r.languageLevel})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
