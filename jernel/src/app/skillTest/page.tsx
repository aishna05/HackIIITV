'use client';

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from '@clerk/nextjs'
import { useRouter } from "next/navigation";


export default function SkillTestPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useUser()


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("frontend");
  const [level, setLevel] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState("A");

  const [loading, setLoading] = useState(false);

  const options = {
    A: "Option A",
    B: "Option B",
    C: "Option C",
    D: "Option D"
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("Challenges").insert({
      id: user?.id,
      title,
      description,
      type,
      level,
      options,
      correct_answer: correctAnswer
    });

    if (error) {
      alert("Error inserting challenge: " + error.message);
    } else {
      alert("Challenge added successfully!");
      setTitle("");
      setDescription("");
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans">
      <header className="w-full bg-black border-b border-purple-800/40 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">
            Add a <span className="text-purple-500">Challenge</span>
          </h1>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center p-6 max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-purple-900/50 rounded-xl p-8 shadow-lg space-y-6 mb-8 w-full max-w-md">
          {/* <div>
            <label className="block mb-2 text-purple-300 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200"
            />
          </div>

          <div>
            <label className="block mb-2 text-purple-300 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200"
            />
          </div> */}

          <div>
            <label className="block mb-2 text-purple-300 font-medium">Skill Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-purple-300 font-medium">Level</label>
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200"
            />
          </div>

          {/* <div>
            <label className="block mb-2 text-purple-300 font-medium">Correct Answer</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200"
            >
              {Object.keys(options).map((key) => (
                <option key={key} value={key}>
                  {key}: {options[key as keyof typeof options]}
                </option>
              ))}
            </select>
          </div> */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium w-full disabled:opacity-50"
          >
            {loading ? "Generating..." : "Start Test"}
          </button>
        </div>
      </main>
    </div>
  );
}
