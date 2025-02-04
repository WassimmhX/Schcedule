import { useState } from "react";
import axios from "axios";

export default function Test() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/getData", { name });
      setResponse(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : "Server not reachable");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Test /getData API</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter 'name' value"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Request
          </button>
        </form>

        {response && (
          <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded">
            <strong>Response:</strong> <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded">
            <strong>Error:</strong> <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
