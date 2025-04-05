'use client'; // if you're using App Router

import React, { useState } from 'react';

export default function StudyPlanPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl text-center font-semibold text-blue-600 mb-8">Generate Your Study Plan</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg space-y-4">
        <div>
          <label>Skill Level</label>
          <select name="skill_level" value={formData.skill_level} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label>Learning Speed</label>
          <select name="learning_speed" value={formData.learning_speed} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Slow">Slow</option>
            <option value="Moderate">Moderate</option>
            <option value="Fast">Fast</option>
          </select>
        </div>

        <div>
          <label>Daily Hours</label>
          <input type="number" name="daily_hours" value={formData.daily_hours} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label>Preferred Days (comma separated)</label>
          <input type="text" name="preferred_days" value={formData.preferred_days} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <button type="submit"  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Generate Plan</button>
      </form>

      {studyPlan && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Your Study Plan</h2>

          {Object.entries(studyPlan).map(([week, weekData]) => (
            <div key={week} className="bg-blue-50 p-4 rounded mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{week}</h3>
              <p className="font-medium text-blue-900 mb-2">Course: {weekData.Course}</p>

              {Object.entries(weekData)
                .filter(([key]) => key !== 'Course')
                .map(([day, info]) => (
                  <div key={day} className="bg-white p-3 border-l-4 border-blue-500 mb-3 rounded">
                    <h4 className="text-blue-600 font-semibold">{day}</h4>
                    {typeof info === 'object' && 'Hours' in info && (
                      <p className="text-gray-700">Hours: {info.Hours}</p>
                    )}
                    <ul className="list-disc ml-5 mt-2 text-sm">
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
    </div>
  );
}
