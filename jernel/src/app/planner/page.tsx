'use client'; // if you're using App Router

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/utils/supabase/client';

export default function StudyPlanPage() {
    const { user } = useUser();
    const supabase = createClient();
     
  const [formData, setFormData] = useState({
    skill_level: 'Beginner',
    learning_speed: 'Slow',
    daily_hours: '',
    preferred_days: '',
  });

  interface WeekData {
    Course: string;
    [day: string]: { Hours: number; Tasks: string[] } | string;
  }

  const [studyPlan, setStudyPlan] = useState<Record<string, WeekData> | null>(null);
  const [completionDate, setCompletionDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/AIPlanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setStudyPlan(data.study_plan?.data?.study_plan || {});
      setCompletionDate(data.study_plan?.data?.expected_completion_date || '');
      
      // Save study plan to Supabase
      if (user && data.study_plan?.data?.study_plan) {
          const plan = data.study_plan.data.study_plan;
        
          for (const [week, weekData] of Object.entries(plan)) {
            const courseTitle = (weekData as WeekData).Course;
            const entries = Object.entries(weekData as WeekData).filter(([key]) => key !== 'Course');
        
            for (const [day, info] of entries) {
              if (typeof info === 'object' && 'Tasks' in info && 'Hours' in info) {
                const tasks = info.Tasks;
                const dueDate = new Date(); // Optional: You could parse day into a real date
        
                for (const task of tasks) {
                  const { error } = await supabase.from('Planner').insert({
                    userID: user.id,
                    title: task,
                    tag: courseTitle,
                    isDone: false,
                    dueDate: dueDate, // optional: replace with actual logic if needed
                  });
        
                  if (error) {
                    console.error('Failed to insert task:', error);
                  }
                }
              }
            }
          }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Generate Your <span className="text-purple-400">Study Plan</span>
        </h1>

        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-900 border border-purple-900/50 rounded-xl p-8 shadow-lg shadow-purple-900/10 space-y-6 mb-8"
        >
          <div>
            <label className="block text-purple-300 mb-2 font-medium">Skill Level</label>
            <select 
              name="skill_level" 
              value={formData.skill_level} 
              onChange={handleChange} 
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-medium">Learning Speed</label>
            <select 
              name="learning_speed" 
              value={formData.learning_speed} 
              onChange={handleChange} 
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            >
              <option value="Slow">Slow</option>
              <option value="Moderate">Moderate</option>
              <option value="Fast">Fast</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-medium">Daily Hours</label>
            <input 
              type="number" 
              name="daily_hours" 
              value={formData.daily_hours} 
              onChange={handleChange} 
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              min="1"
              max="24"
            />
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-medium">Preferred Days (comma separated)</label>
            <input 
              type="text" 
              name="preferred_days" 
              value={formData.preferred_days} 
              onChange={handleChange} 
              placeholder="e.g. Monday, Wednesday, Friday" 
              className="w-full p-3 rounded-lg bg-gray-800 border border-purple-900/30 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <button 
            type="submit"  
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Plan'
            )}
          </button>
        </form>

        {studyPlan && (
          <div className="bg-gray-900 border border-purple-900/50 rounded-xl p-8 shadow-lg shadow-purple-900/10 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-4">
              Your <span className="text-purple-400">Study Plan</span>
            </h2>
            
            {completionDate && (
              <p className="mb-6 text-gray-300 bg-purple-900/20 p-3 rounded-lg inline-block">
                Expected completion: <span className="text-purple-300 font-medium">{completionDate}</span>
              </p>
            )}

            {Object.entries(studyPlan).map(([week, weekData]) => (
              <div key={week} className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-purple-800/30">
                <h3 className="text-xl font-semibold text-purple-300 mb-2">{week}</h3>
                <p className="font-medium text-gray-300 mb-2">Course: {weekData.Course}</p>

                {Object.entries(weekData)
                  .filter(([key]) => key !== 'Course')
                  .map(([day, info]) => (
                    <div key={day} className="bg-gray-800 p-3 border-l-4 border-purple-500 mb-3 rounded">
                      <h4 className="text-purple-400 font-semibold">{day}</h4>
                      {typeof info === 'object' && 'Hours' in info && (
                        <p className="text-gray-300">Hours: {info.Hours}</p>
                      )}
                      <ul className="list-disc ml-5 mt-2 text-sm text-gray-300">
                        {typeof info === 'object' && 'Tasks' in info && Array.isArray(info.Tasks) && info.Tasks.map((task: string, i: number) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}