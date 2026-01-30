import { useEffect, useState } from "react";

function BackendTest() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/db-test")
      .then(res => {
        if (!res.ok) throw new Error("Backend error");
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Backend Connection Test</h1>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Provando coneccion...</p>
      )}
    </div>
  );
}

export default BackendTest;
