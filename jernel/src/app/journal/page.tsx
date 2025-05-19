'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'

// API route runs in the same file
export const dynamic = 'force-dynamic'

export default function JournalCareerPage() {
  const [entry, setEntry] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const supabase = createClient()   
    
  
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
      const res = await fetch('/api/careerRecomdation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry }),
      })
  
      const data = await res.json()
  
      if (data) {
        const nested = data.summary.res.reply
  
        const resultObj = {
          summary: data.summary.res.summary,
          mood: nested.mood,
          career_recommendation: nested.career_recommendation,
          justification: nested.justification,
          related_fields: nested.related_fields
        }
  
        setResult(resultObj)
        
        if (!user ) {
          throw new Error('User not authenticated')
        }
  
        // Insert into Journal table
        const { error: insertError } = await supabase.from('Journal').insert({
            userID: user.id, // Clerk user ID
            entryText: entry,
            mood: resultObj.mood,
          })
  
        if (insertError) {
          throw new Error('Error saving journal entry: ' + insertError.message)
        }
  
        console.log(' Journal entry saved.')
      }
    } catch (error: any) {
      console.error(error)
      setError('Failed to fetch recommendations or save journal.')
    }
    setLoading(false)
  }
  

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans">
      {/* Header */}
      <header className="w-full bg-black border-b border-purple-800/40 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">
            Student<span className="text-purple-500">Organizer</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-gray-900 border border-purple-900/50 rounded-xl p-8 shadow-lg shadow-purple-900/10 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="text-purple-400">🧠</span> Journal to Career Recommendation
          </h1>
          
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your journal entry here..."
            className="w-full h-40 p-4 rounded-lg mb-4 bg-gray-800 border border-purple-900/30 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
          
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Get Career Advice'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-gray-900 border border-purple-900/50 rounded-xl p-8 shadow-lg shadow-purple-900/10 mb-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-purple-800/40 pb-3">Career Insight</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-purple-400 font-medium mb-1">Summary</h3>
                <p className="text-gray-300">{result.summary}</p>
              </div>
              
              <div>
                <h3 className="text-purple-400 font-medium mb-1">Mood</h3>
                <div className="bg-purple-900/20 text-gray-200 px-4 py-2 rounded-lg inline-block">
                  {result.mood}
                </div>
              </div>
              
              <div>
                <h3 className="text-purple-400 font-medium mb-1">Recommended Career</h3>
                <p className="text-gray-200 font-semibold">{result.career_recommendation}</p>
              </div>
              
              <div>
                <h3 className="text-purple-400 font-medium mb-1">Justification</h3>
                <p className="text-gray-300">{result.justification}</p>
              </div>
              
              <div>
                <h3 className="text-purple-400 font-medium mb-1">Related Fields</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {result.related_fields.map((field: string, idx: number) => (
                    <li key={idx} className="bg-purple-900/20 text-gray-200 px-3 py-2 rounded-lg flex items-center">
                      <span className="text-purple-400 mr-2">•</span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-purple-800/40 p-6">
        <div className="max-w-3xl mx-auto text-center text-gray-500 text-sm">
          © 2025 StudentOrganizer. Get personalized career insights based on your journaling.
        </div>
      </footer>
    </div>
  )
}

// ---------------- BACKEND API ROUTE IN SAME FILE ---------------- //