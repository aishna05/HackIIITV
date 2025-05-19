'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  
   
  return (
    <div className="bg-black text-gray-200 min-h-screen grid grid-rows-[auto_1fr_auto] gap-8 font-sans">
      {/* Header */}
      <header className="w-full bg-black border-b border-purple-800/40 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Student<span className="text-purple-500">Organizer</span>
          </h1>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Dashboard</a>
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Tasks</a>
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Calendar</a>
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Notes</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto p-6 flex flex-col gap-8">
        {/* Welcome Section */}
        <section className="bg-gray-900 border border-purple-900/50 rounded-xl p-8 shadow-lg shadow-purple-900/10">
          <h2 className="text-3xl font-bold mb-4 text-white">Welcome Back!</h2>
          <p className="text-gray-400 mb-6">Organize your academic life with ease. Track assignments, manage your schedule, and keep all your notes in one place.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
              <span>Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="border border-purple-500 text-purple-400 hover:bg-purple-900/30 px-6 py-3 rounded-lg transition-colors font-medium">Learn More</button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-gray-900 border border-purple-900/50 rounded-xl p-6 hover:shadow-md hover:shadow-purple-900/20 transition-all">
            <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white text-center w-full">Study Focus</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <button
                className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/journal");
                }}
              >
                Carrer Reccomendation
              </button>
              <button
                className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/skillTest");
                }}
              >
                Skill Test
              </button>
              <button
                className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/planner");
                }}
              >
                Study Planner
              </button>
            </div>
            <p className="text-gray-400 text-center">Built-in focus timer and productivity tools to help you study efficiently.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-900/50 to-black border border-purple-900/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Ready to boost your productivity?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">Join thousands of students who have transformed their academic journey with StudentOrganizer.</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-medium">Create Free Account</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-purple-800/40 p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">© 2025 StudentOrganizer. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Help</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}