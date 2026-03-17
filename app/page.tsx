'use client';

import { useState } from 'react';

export default function Home() {
  const [profileText, setProfileText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!profileText.trim()) {
      setError('Please paste your LinkedIn profile information');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze profile');
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractScore = (text: string) => {
    const match = text.match(/PROFILE_SCORE:\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-blue-100 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const extractChecklist = (text: string) => {
    const checklistMatch = text.match(/CHECKLIST:([\s\S]*?)WHAT'S WORKING WELL:/);
    if (!checklistMatch) return [];

    return checklistMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/^✅|^❌/))
      .slice(0, 9); // Get exactly 9 items
  };

  const extractSection = (text: string, startMarker: string, endMarker: string) => {
    const regex = new RegExp(`${startMarker}:([\\s\\S]*?)(?:${endMarker}:|$)`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const renderAnalysis = (text: string) => {
    const sections = text.split(/(?=HEADLINE:|SUMMARY:|SKILLS:|EXPERIENCE:|OVERALL_TONE:|TOP_3_WINS:|ACTION_ITEMS:)/);

    const formatTitle = (title: string) => {
      return title
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    return sections
      .filter(section => section.trim())
      .map((section, idx) => {
        const [title, ...content] = section.split(':');
        const contentText = content.join(':').trim();

        const sectionTitle = title.trim();
        const formattedTitle = formatTitle(sectionTitle);
        const iconMap: Record<string, string> = {
          'HEADLINE': '📝',
          'SUMMARY': '✍️',
          'SKILLS': '⭐',
          'EXPERIENCE': '💼',
          'OVERALL_TONE': '🎤',
          'TOP_3_WINS': '✅',
          'ACTION_ITEMS': '🎯',
        };

        const bgColorMap: Record<string, string> = {
          'HEADLINE': 'bg-blue-50 border-l-4 border-blue-500',
          'SUMMARY': 'bg-purple-50 border-l-4 border-purple-500',
          'SKILLS': 'bg-yellow-50 border-l-4 border-yellow-500',
          'EXPERIENCE': 'bg-green-50 border-l-4 border-green-500',
          'OVERALL_TONE': 'bg-pink-50 border-l-4 border-pink-500',
          'TOP_3_WINS': 'bg-emerald-50 border-l-4 border-emerald-500',
          'ACTION_ITEMS': 'bg-orange-50 border-l-4 border-orange-500',
        };

        return (
          <div key={idx} className={`p-5 rounded-lg ${bgColorMap[sectionTitle] || 'bg-gray-50'} mb-4 result-section transition-all cursor-pointer hover:shadow-md`}>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-lg">
              <span className="text-xl animate-bounce">{iconMap[sectionTitle] || '•'}</span>
              {formattedTitle}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {contentText}
            </p>
          </div>
        );
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white">LinkedIn Profile Optimizer</h1>
              <p className="text-blue-200 mt-3 text-lg">✨ Powered by AI • Get smart optimization suggestions instantly</p>
              <p className="text-yellow-300 mt-2 text-sm">⚠️ Results may be inaccurate — use as a guide, not gospel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {!analysis ? (
            // Input State
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Analyze Your Profile</h2>
              <p className="text-gray-600 text-lg mb-6">Paste your LinkedIn profile information to get AI-powered optimization suggestions in seconds.</p>

              {/* Quick Guide */}
              <div className="mb-10 p-6 bg-blue-50 border-2 border-blue-300 rounded-2xl">
                <h3 className="text-lg font-bold text-blue-900 mb-4">📋 Your About Section Should Include:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <p className="font-semibold text-blue-900">What You Study</p>
                      <p className="text-sm text-blue-700">Your degree, major, or field</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">💻</span>
                    <div>
                      <p className="font-semibold text-blue-900">Technologies You Enjoy</p>
                      <p className="text-sm text-blue-700">Languages, tools, frameworks</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <p className="font-semibold text-blue-900">What You Want to Build</p>
                      <p className="text-sm text-blue-700">Your learning goals & interests</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold text-blue-900">Job/Internship Goals</p>
                      <p className="text-sm text-blue-700">What role/company you're seeking</p>
                    </div>
                  </div>
                </div>
              </div>

              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your LinkedIn profile details here...&#10;&#10;Include: Headline, Summary/About, Experience, Skills, Projects, etc."
                className="w-full h-96 p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400 font-medium"
              />

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full mt-10 font-bold py-5 px-6 rounded-2xl transition-all duration-200 text-white text-lg shadow-lg ${
                  loading
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed animate-pulse-glow'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:scale-105 active:scale-95'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing your profile...
                  </span>
                ) : (
                  '🚀 Analyze My Profile'
                )}
              </button>

              {error && (
                <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <p className="text-red-700 font-semibold text-lg">⚠️ {error}</p>
                </div>
              )}
            </div>
          ) : (
            // Results State
            <div>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-gray-900">✨ Your LinkedIn Audit</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAnalysis('');
                      setProfileText('');
                      setError('');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 duration-200 shadow-md hover:shadow-lg"
                  >
                    🔄 Analyze Another
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analysis);
                      alert('✅ Copied to clipboard!');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 duration-200 shadow-md hover:shadow-lg"
                  >
                    📋 Copy Results
                  </button>
                </div>
              </div>

              {/* Profile Score Card */}
              <div className={`mb-10 p-8 rounded-3xl border-2 ${getScoreBgColor(extractScore(analysis))} animate-bounce-in`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-semibold mb-2">PROFILE SCORE</p>
                    <div className={`text-7xl font-bold ${getScoreColor(extractScore(analysis))}`}>
                      {extractScore(analysis)}/100
                    </div>
                    <p className="text-gray-600 mt-3">
                      {extractScore(analysis) >= 80 ? '🎉 Excellent profile!' :
                       extractScore(analysis) >= 60 ? '👍 Good start, room to improve' :
                       extractScore(analysis) >= 40 ? '⚠️ Needs some work' :
                       '🔨 Let\'s build this up!'}
                    </p>
                  </div>
                  <div className="text-6xl">
                    {extractScore(analysis) >= 80 ? '⭐' :
                     extractScore(analysis) >= 60 ? '🌟' :
                     extractScore(analysis) >= 40 ? '✨' : '🚀'}
                  </div>
                </div>
              </div>

              {/* Profile Checklist */}
              <div className="mb-10 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Checklist</h3>
                <div className="space-y-3">
                  {extractChecklist(analysis).map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${item.includes('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
                      <span className="text-2xl">{item.includes('✅') ? '✅' : '❌'}</span>
                      <p className={`font-medium ${item.includes('✅') ? 'text-green-900' : 'text-red-900'}`}>
                        {item.replace(/✅|❌/g, '').trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Working */}
              <div className="mb-10 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-green-900 mb-6">✅ What's Working Well</h3>
                <div className="space-y-3">
                  {extractSection(analysis, "WHAT'S WORKING WELL", "KEY IMPROVEMENTS NEEDED")
                    .split('\n')
                    .filter(line => line.trim().match(/^\d+\./))
                    .map((item, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border border-green-200">
                        <p className="text-green-900 font-medium">{item.replace(/^\d+\.\s*/, '').trim()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Key Improvements */}
              <div className="mb-10 p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-300 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-orange-900 mb-6">🎯 Key Improvements Needed</h3>
                <div className="space-y-4">
                  {extractSection(analysis, "KEY IMPROVEMENTS NEEDED", "QUICK WINS")
                    .split('\n')
                    .filter(line => line.trim().match(/^\d+\./))
                    .map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start action-item-card p-5 rounded-xl hover:bg-orange-100 cursor-pointer bg-white/60">
                        <span className="text-orange-600 font-bold text-2xl min-w-fit">{idx + 1}</span>
                        <p className="text-orange-900 font-medium text-base mt-1">{item.replace(/^\d+\.\s*/, '').trim()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Quick Wins */}
              <div className="mb-10 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-300 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">⚡ Quick Wins (Easy to Implement)</h3>
                <div className="space-y-3">
                  {extractSection(analysis, "QUICK WINS", "OVERALL FEEDBACK")
                    .split('\n')
                    .filter(line => line.trim().match(/^-/))
                    .map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-blue-900 font-medium">{item.replace(/^-\s*/, '').trim()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Overall Feedback */}
              <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-300 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">💬 Overall Feedback</h3>
                <p className="text-purple-900 leading-relaxed text-lg">
                  {extractSection(analysis, "OVERALL FEEDBACK", "").trim() || 'Great work on your profile!'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur rounded-3xl border border-white/20 p-10 hover:border-blue-400/50 transition transform hover:scale-105 hover:-translate-y-3 duration-300 cursor-pointer shadow-lg hover:shadow-2xl">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-white mb-3">Better Headlines</h3>
            <p className="text-blue-100 text-base leading-relaxed">Get specific, tested headline suggestions that increase your profile views and catch recruiter attention</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-3xl border border-white/20 p-10 hover:border-purple-400/50 transition transform hover:scale-105 hover:-translate-y-3 duration-300 cursor-pointer shadow-lg hover:shadow-2xl">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-2xl font-bold text-white mb-3">Polished Summary</h3>
            <p className="text-blue-100 text-base leading-relaxed">Learn exactly what hiring managers want to read in your summary section with AI-powered insights</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-3xl border border-white/20 p-10 hover:border-emerald-400/50 transition transform hover:scale-105 hover:-translate-y-3 duration-300 cursor-pointer shadow-lg hover:shadow-2xl">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Action Plan</h3>
            <p className="text-blue-100 text-base leading-relaxed">Get a prioritized checklist of improvements to implement immediately for maximum impact</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-16 text-white text-center border border-blue-400/50 transform transition hover:scale-105 hover:shadow-3xl duration-300">
          <h3 className="text-5xl font-bold mb-6">🎉 Premium Coming Soon</h3>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Unlock unlimited analyses, advanced insights, interview prep module, and more. Early bird customers get 50% off the first month!
          </p>
          <button className="bg-white text-purple-600 font-bold py-4 px-12 text-lg rounded-2xl hover:bg-blue-50 transition shadow-lg transform hover:scale-110 active:scale-95 duration-200">
            🌟 Get Early Access
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-blue-200">
          <p className="text-lg">LinkedIn Profile Optimizer • Built with AI to help you land your dream job</p>
          <p className="text-sm text-blue-300 mt-3">Free forever • No credit card required • 10,000 analyses per month</p>
        </div>
      </footer>
    </div>
  );
}
