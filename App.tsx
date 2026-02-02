import React, { useState, useEffect } from 'react';
import { SubjectCard } from './components/SubjectCard';
import { ResultView } from './components/ResultView';
import { SUBJECTS } from './constants';
import { fetchExplanation } from './services/geminiService';
import { StudyContent, LoadingState } from './types';

function App() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [result, setResult] = useState<StudyContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Initialize Dark Mode
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  // Toggle Dark Mode Class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSubject || !topic.trim()) {
      return false;
    }

    setLoadingState('loading');
    setError(null);
    setResult(null);

    try {
      const subjectLabel = SUBJECTS.find(s => s.id === selectedSubject)?.label || selectedSubject;
      const data = await fetchExplanation(subjectLabel, topic);
      setResult(data);
      setLoadingState('success');
    } catch (err) {
      console.error(err);
      setError("We encountered an issue while generating your study material. Please try again.");
      setLoadingState('error');
    }
  };

  const handleReset = () => {
    setLoadingState('idle');
    setResult(null);
    setTopic('');
    setSelectedSubject(null);
    setError(null);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setTopic(''); // Clear topic when subject changes
    setResult(null);
    setLoadingState('idle');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans selection:bg-brand-200 selection:text-brand-900 transition-colors duration-300">
      
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/40 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">ScholarSync</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
              <div className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Grade 12 Beta
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
        
        {/* Intro / Search Section */}
        <div className="transition-all duration-700 ease-in-out">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Master any topic <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                in seconds.
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Select your subject, enter a topic, and get instant, structured definitions, key points, and examples tailored for 12th grade.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 md:p-8 max-w-4xl mx-auto relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10">
             {/* Decorative blob */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand-50 opacity-50 blur-3xl pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              
              {/* Subject Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">1. Select Subject</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {SUBJECTS.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      isSelected={selectedSubject === subject.id}
                      onClick={handleSubjectChange}
                    />
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-3">
                <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">2. Enter Topic</label>
                <div className="relative">
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="  Enter & Explore a topic in a flash   "
                    className="block w-full rounded-xl border-slate-200 dark:border-slate-700 pl-4 pr-12 py-4 text-lg bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 focus:ring-brand-500 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!selectedSubject || !topic || loadingState === 'loading'}
                  className={`
                    w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-200 transform
                    ${(!selectedSubject || !topic) 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-1 shadow-brand-500/30'
                    }
                    ${loadingState === 'loading' ? 'opacity-80 cursor-wait' : ''}
                  `}
                >
                  {loadingState === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Request...
                    </span>
                  ) : (
                    "Explain This Topic"
                  )}
                </button>
              </div>

              {/* New Topic Button */}
              {loadingState === 'success' && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 px-6 rounded-xl font-medium text-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    New Topic
                  </button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  {error}
                </div>
              )}
            </form>
          </div>
          
          {/* Quick tips or footer */}
          <div className="mt-12 text-center text-slate-400 text-sm">
            <p>Powered by Gemini</p>
          </div>
        </div>

        {/* Loading Skeleton View */}
        {loadingState === 'loading' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 mt-8">
             <div className="h-8 w-1/3 bg-slate-200 rounded-lg shimmer mb-8"></div>
             <div className="h-40 w-full bg-white rounded-3xl border border-slate-100 shimmer"></div>
             <div className="grid md:grid-cols-2 gap-6">
               <div className="h-64 w-full bg-white rounded-3xl border border-slate-100 shimmer"></div>
               <div className="h-64 w-full bg-white rounded-3xl border border-slate-100 shimmer"></div>
             </div>
           </div>
        )}

        {/* Results View */}
        {loadingState === 'success' && result && (
          <div className="mt-12">
            <ResultView 
              data={result} 
              topic={topic}
              onReset={() => {}}
            />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
