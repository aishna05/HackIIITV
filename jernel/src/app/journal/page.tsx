'use client';
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/clerk-react";

interface JournalEntry {
    entryText: string;
    mood: string;
    userID: string;
    id:string;
    created_at: string;
  }

const supabase = createClient(); // Initialize the Supabase client

  
export default function Journal() {
    const { user } = useUser();
    const [entryText, setEntryText] = useState<string>('');
    const [mood, setMood] = useState<string>('');
    const userID = user?.id || '';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const newEntry: JournalEntry = {
            entryText,
            mood,
            userID,
            id:crypto.randomUUID(), // Generate a unique ID for the entry
            created_at: new Date().toISOString(), // Set the current date and time
          };

          const { data, error } = await supabase
          .from("Journal")
          .insert([newEntry])
          if (error) {
            console.error('Error inserting entry:', error);
          } else {
            console.log('Entry inserted:', data);
            console.log('Journal entry saved!');
          }
          
    }

    return (
       <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-md w-full max-w-md">
      <input
        placeholder="Write your journal entry..."
        value={entryText}
        onChange={(e) => setEntryText(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Mood (e.g. happy, anxious)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Save Entry
      </button>
    </form>
       </div>
    )
}
