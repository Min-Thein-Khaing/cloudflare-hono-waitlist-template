import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  timestamp?: string;
  [key: string]: unknown;
};

export const ServerStatus = () => {
  const [data, setData] = useState<HealthResponse | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Health check error:", err);
        setData({ status: "offline" });
        setLoading(false);
      });
  }, []);

  return (
    <div className="my-4 p-3 rounded-lg border border-slate-700 bg-slate-800/60 text-center text-sm">
      <span className="font-semibold text-slate-300">Server Status: </span>
      {loading ? (
        <span className="text-yellow-400">Checking...</span>
      ) : typeof data === "object" && data !== null ? (
        <span className={data.status === "healthy" ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
          {data.status}
        </span>
      ) : (
        <span className="text-slate-300">{String(data)}</span>
      )}
    </div>
  );
};
