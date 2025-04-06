"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SkillTestPage() {
  const [skill, setSkill] = useState("Frontend");
  const [level, setLevel] = useState("1");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartTest = async () => {
    setLoading(true);
    const res = await fetch("/api/skillTest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill, level }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/skill-test/play?sessionId=${data.sessionId}`);
    } else {
      alert("Error generating challenges. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Start Skill Challenge</h1>
      <div className="space-y-4 w-full max-w-md">
        <div>
          <label className="block font-medium">Choose Skill</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="UI/UX">UI/UX</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Choose Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>{`Level ${lvl}`}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleStartTest}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Start Test"}
        </button>
      </div>
    </div>
  );
}
