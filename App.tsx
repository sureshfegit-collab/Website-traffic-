
import React, { useState } from 'react';
import { analyzeTraffic } from './services/gemini';
import { AnalysisState } from './types';
import StatCard from './components/StatCard';
import TrafficCharts from './components/TrafficCharts';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let sanitizedUrl = url.trim();
    if (!/^https?:\/\//i.test(sanitizedUrl)) {
      sanitizedUrl = 'https://' + sanitizedUrl;
    }

    setState({ isLoading: true, error: null, data: null });

    try {
      const stats = await analyzeTraffic(sanitizedUrl);
      setState({ isLoading: false, error: null, data: stats });
    } catch (err) {
      console.error(err);
      setState({ 
        isLoading: false, 
        error: "Failed to retrieve traffic data. Please try a common domain or check the URL.", 
        data: null 
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              TrafficInsight
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Enterprise</a>
          </nav>
        </div>
      </header>

      {/* Hero / Input Section */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Unlock Global Web Traffic Insights
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Get instant estimates of monthly visits, audience distribution, and key engagement metrics for any website on the internet.
          </p>

          <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto">
            <div className="flex items-center p-2 bg-white rounded-2xl shadow-xl shadow-indigo-100 border-2 border-transparent focus-within:border-indigo-400 transition-all">
              <div className="flex-1 flex items-center pl-4">
                <i className="fas fa-globe text-slate-400 mr-3"></i>
                <input
                  type="text"
                  placeholder="Paste website link (e.g. apple.com)..."
                  className="w-full bg-transparent border-none focus:outline-none text-slate-800 py-3 text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={state.isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center space-x-2"
              >
                {state.isLoading ? (
                  <><i className="fas fa-circle-notch animate-spin"></i><span>Analyzing...</span></>
                ) : (
                  <><i className="fas fa-magnifying-glass"></i><span>Analyze</span></>
                )}
              </button>
            </div>
            {state.error && (
              <p className="text-red-500 mt-4 text-sm font-medium animate-pulse">
                <i className="fas fa-exclamation-triangle mr-1"></i> {state.error}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Results Section */}
      {state.data && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Monthly Visits" 
              value={state.data.monthlyVisits} 
              icon="fas fa-users" 
              colorClass="bg-indigo-600"
            />
            <StatCard 
              label="Bounce Rate" 
              value={state.data.bounceRate || 'N/A'} 
              icon="fas fa-door-open" 
              colorClass="bg-purple-600"
            />
            <StatCard 
              label="Avg. Visit Duration" 
              value={state.data.avgDuration || 'N/A'} 
              icon="fas fa-clock" 
              colorClass="bg-pink-600"
            />
            <StatCard 
              label="Targeted URL" 
              value={state.data.url.replace(/^https?:\/\//i, '').split('/')[0]} 
              icon="fas fa-link" 
              colorClass="bg-emerald-600"
            />
          </div>

          <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Traffic Summary</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
              {state.data.summary}
            </div>
          </div>

          {/* Charts */}
          {state.data.countries && state.data.countries.length > 0 && (
            <TrafficCharts data={state.data} />
          )}

          {/* Sources */}
          {state.data.sources && state.data.sources.length > 0 && (
            <div className="mt-8 bg-slate-100 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Data Sources & Citations</h3>
              <div className="flex flex-wrap gap-3">
                {state.data.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white px-4 py-2 rounded-full text-xs font-medium text-slate-700 hover:text-indigo-600 hover:shadow-md transition-all flex items-center space-x-2 border border-slate-200"
                  >
                    <i className="fas fa-external-link-alt text-[10px]"></i>
                    <span>{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {!state.data && !state.isLoading && (
        <div className="max-w-4xl mx-auto mt-12 text-center text-slate-400">
          <div className="mb-6">
            <i className="fas fa-chart-pie text-6xl opacity-20 animate-float"></i>
          </div>
          <p>No data to display. Please enter a website URL above to start the analysis.</p>
        </div>
      )}
    </div>
  );
};

export default App;
