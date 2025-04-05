'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// API route runs in the same file
export const dynamic = 'force-dynamic'

export default function JournalCareerPage() {
  const [entry, setEntry] = useState('')
  const [loading, setLoading] = useState(false)
  interface ResultType {
    summary: string;
    mood: string;
    career_recommendation: string;
    justification: string;
    related_fields: string[];
  }

  const [result, setResult] = useState<ResultType | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('Submitting entry:====>', entry);
      const res = await fetch('/api/careerRecomdation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  entry }),
      })
      const data = await res.json()
      console.log('Response data in front :====>', data);
      console.log("------------------------>",data.success)
      if (data) {
        const nested = data.summary.res.reply
        setResult({
          summary: data.summary.res.summary,
          mood: nested.mood,
          career_recommendation: nested.career_recommendation,
          justification: nested.justification,
          related_fields: nested.related_fields
        });
        console.log("inside here")
        console.log("====> RESULT SET:", {
          summary: data.summary.res.summary,
          mood: nested.mood,
          career_recommendation: nested.career_recommendation,
          justification: nested.justification,
          related_fields: nested.related_fields
        });
      }
    } catch (error) {
      setError('Failed to fetch recommendations.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Journal to Career Recommendation</h1>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your journal entry here..."
        className="w-full h-40 p-3 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Get Career Advice'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      
  {result && (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-semibold mb-2">Career Insight</h2>

      <p><strong>Summary:</strong> {result.summary}</p>
      <p><strong>Mood:</strong> {result.mood}</p>
      <p><strong>Recommended Career:</strong> {result.career_recommendation}</p>
      <p><strong>Justification:</strong> {result.justification}</p>
      <p><strong>Related Fields:</strong></p>
      <ul className="list-disc ml-5">
        {result.related_fields.map((field: string, idx: number) => (
          <li key={idx}>{field}</li>
        ))}
      </ul>
    </div>
  )}


    </div>
  )
}

// ---------------- BACKEND API ROUTE IN SAME FILE ---------------- //
