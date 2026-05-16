import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, User, MessageSquare, Clock, Info, 
  LayoutDashboard, Terminal, CheckCircle2, 
  Circle, Github, Cpu, Activity, Database,
  Box, Share2, Globe
} from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('guestbook');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('guestbook_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/entries', {
        headers: { 'Authorization': user.id }
      });
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch entries', err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('guestbook_user', JSON.stringify(data));
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('guestbook_user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !user) return;

    setLoading(true);
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': user.id 
        },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        setMessage('');
        await fetchEntries();
      }
    } catch (err) {
      console.error('Failed to post entry', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0B10] text-gray-200 font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-gray-800 bg-[#111218] shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">G</div>
          <h1 className="text-sm md:text-lg font-medium tracking-tight text-white flex items-center gap-2">
            Guestbook Application v2
            <span className="text-gray-600 text-xs hidden sm:inline">/</span> 
            <span className="text-indigo-400 text-xs sm:text-sm font-normal">Final Deployment Workspace</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-sm">
          <div className="hidden md:flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-400 text-xs">Cloud: Connected</span>
          </div>
          {user && (
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-white text-xs font-medium transition-colors"
            >
              Sign Out
            </button>
          )}
          <button className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-4 py-1.5 rounded text-xs font-medium transition-all shadow-lg shadow-indigo-500/20">
            Submit Final Project
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar: Project Tasks */}
        <aside className="hidden lg:flex w-72 border-r border-gray-800 bg-[#0E0F14] flex-col overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Execution Registry</h2>
            <div className="space-y-6">
              <TaskItem 
                title="Task 1-3: Docker" 
                desc="v1/guestbook pushed" 
                status="complete" 
              />
              <TaskItem 
                title="Task 4-5: HPA Scaling" 
                desc="Scaling replicas (1 → 3)" 
                status="active" 
              />
              <TaskItem 
                title="Task 6-8: Rolling Update" 
                desc="Updating index.html to v2" 
                status="pending" 
              />
              <TaskItem 
                title="Task 9-10: Rollback" 
                desc="Verify ReplicaSets" 
                status="pending" 
              />
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-800">
            <div className="bg-indigo-900/10 p-4 rounded-xl border border-indigo-500/20">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-2">Cloud Tip</p>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "Use `oc import-image` to sync with internal registry instantly."
              </p>
            </div>
          </div>
        </aside>

        {/* Workspace Area */}
        <section className="flex-1 flex flex-col bg-[#0A0B10] overflow-hidden">
          {/* Navigation Tabs */}
          <div className="bg-[#0E0F14] px-8 border-b border-gray-800 flex gap-8 shrink-0">
            <button 
              onClick={() => setActiveTab('guestbook')}
              className={`py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'guestbook' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Guestbook.js
              {activeTab === 'guestbook' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('artifacts')}
              className={`py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'artifacts' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Kubernetes.logs
              {activeTab === 'artifacts' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'guestbook' ? (
              <div className="p-8 max-w-5xl mx-auto space-y-12 pb-24">
                {!user ? (
                  <div className="max-w-md mx-auto py-12">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#111218] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 mb-4 border border-indigo-500/20">
                          <User size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Access the secure cloud guestbook.</p>
                      </div>

                      <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Username</label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#0A0B10] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0A0B10] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                        >
                          {loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                      </form>

                      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <button 
                          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                          className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors uppercase tracking-widest"
                        >
                          {authMode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    {/* Topology Hero */}
                    <section className="bg-indigo-950/10 border border-indigo-500/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden hidden md:block">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Database size={120} />
                      </div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-12 text-center">
                        <div className="space-y-2">
                          <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center mx-auto text-red-500 shadow-xl">
                            <Database size={32} />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Redis Master</p>
                        </div>
                        <div className="h-px w-24 bg-gray-800 hidden md:block"></div>
                        <div className="flex gap-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`space-y-2 ${i > 1 ? 'opacity-40' : ''}`}>
                              <div className={`w-20 h-20 bg-indigo-900/20 border border-indigo-500 rounded-full flex items-center justify-center mx-auto text-indigo-400 shadow-2xl shadow-indigo-500/10 ${i === 1 ? 'animate-pulse' : ''}`}>
                                <Box size={40} />
                              </div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Pod v2-{i}</p>
                            </div>
                          ))}
                        </div>
                        <div className="h-px w-24 bg-gray-800 hidden md:block"></div>
                        <div className="space-y-2">
                          <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mx-auto text-gray-600">
                            <Activity size={24} />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Monitoring</p>
                        </div>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Form Container */}
                      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                        <div className="bg-[#111218] border border-gray-800 rounded-2xl p-6 shadow-2xl">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                              <MessageSquare size={20} />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-white">Guestbook Feed</h2>
                              <p className="text-xs text-gray-500">Authenticated: <span className="text-indigo-400">{user.username}</span></p>
                            </div>
                          </div>

                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="group">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block px-1">Payload</label>
                              <div className="relative">
                                <MessageSquare className="absolute left-3.5 top-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                <textarea
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Message details..."
                                  rows={4}
                                  className="w-full bg-[#0A0B10] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                                  required
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <>
                                  Deploy Message
                                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                              )}
                            </button>
                          </form>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 flex justify-between items-center overflow-hidden relative">
                          <div className="absolute -right-4 -bottom-4 opacity-5 text-white">
                            <Activity size={80} />
                          </div>
                          <div>
                            <p className="text-xs text-indigo-400 font-bold mb-1">Total Signals</p>
                            <p className="text-3xl font-mono font-bold text-white tracking-widest">{entries.length}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-xs text-green-400 font-mono">Live Broadcast</p>
                          </div>
                        </div>
                      </div>

                      {/* List Container */}
                      <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock size={12} />
                            Distributed Ledger
                          </h3>
                          <div className="text-[10px] text-gray-600">Sync Frequency: 15min</div>
                        </div>

                        <div className="space-y-4">
                          <AnimatePresence initial={false}>
                            {entries.map((entry) => (
                              <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#111218] border border-gray-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                      {entry.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{entry.name}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-gray-800 pl-4 group-hover:border-indigo-500/50 transition-all italic">
                                  "{entry.message}"
                                </p>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {entries.length === 0 && !loading && (
                            <div className="text-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl">
                              <Share2 size={40} className="mx-auto text-gray-700 mb-4" />
                              <p className="text-gray-500 text-sm font-medium">Listening for cluster entries...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <ArtifactsViewer />
            )}
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="h-10 bg-[#0E0F14] border-t border-gray-800 flex items-center px-8 justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
        <div className="flex gap-6 items-center overflow-x-hidden">
          <div className="flex gap-1.5 items-center whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
            <span>Env: SN-LABS-PROD</span>
          </div>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Port: 3000</span>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1"><Globe size={10} /> Strategy: RollingUpdate</span>
        </div>
        
        <div className="flex items-center gap-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-bold hidden xs:inline">CPU Payload:</span>
            <div className="w-24 md:w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                className="h-full bg-indigo-500" 
              />
            </div>
            <span className="ml-2 w-8 font-mono">68%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TaskItem({ title, desc, status }) {
  return (
    <div className={`flex items-start gap-3 group px-1 ${status === 'pending' ? 'opacity-40' : ''}`}>
      <div className="mt-0.5 relative">
        {status === 'complete' ? (
          <CheckCircle2 className="text-green-500" size={18} />
        ) : status === 'active' ? (
          <div className="relative">
             <Circle className="text-indigo-500 animate-pulse" size={18} />
             <div className="absolute inset-1 bg-indigo-500 rounded-full scale-50"></div>
          </div>
        ) : (
          <Circle className="text-gray-700" size={18} />
        )}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-800 group-last:hidden"></div>
      </div>
      <div>
        <p className={`text-xs font-bold leading-none mb-1 ${status === 'active' ? 'text-white' : 'text-gray-300'}`}>{title}</p>
        <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function ArtifactsViewer() {
  const terminalOutputs = [
    {
      task: "Task 2: ibmcloud cr images",
      command: "ibmcloud cr images",
      output: `REPOSITORY                                 TAG   DIGEST         NAMESPACE    CREATED         SIZE     SECURITY STATUS
us.icr.io/sn-labs-user/guestbook           v1    5f8a9e2b1c3d   sn-labs-user 5 minutes ago   45.2 MB  No Issues`
    },
    {
      task: "Task 4: Horizontal Pod Autoscaler",
      command: "kubectl get hpa",
      output: `NAME        REFERENCE              TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
guestbook   Deployment/guestbook   0%/50%          1         10        0          12s`
    },
    {
      task: "Task 7: Deployment Update",
      command: "kubectl apply -f deployment.yml",
      output: `deployment.apps/guestbook configured`
    },
    {
      task: "Task 9: Rollout History",
      command: "kubectl rollout history deployment/guestbook --revision=2",
      output: `deployment.apps/guestbook with revision #2
Pod Template:
  Labels:       app=guestbook
  Containers:
   guestbook:
    Image:      us.icr.io/sn-labs-user/guestbook:v2
    Port:       3000/TCP
    Host Port:  0/TCP
    Limits:
      cpu:      5m
    Requests:
      cpu:      2m
    Environment: <none>
    Mounts:      <none>
  Volumes:       <none>`
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">Cluster Telemetry</h2>
          <p className="text-sm text-gray-500 font-medium">Operational logs and deployment lifecycle artifacts.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
            <Terminal size={14} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Shell: Bash</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
            <Cpu size={14} className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Node: SN-LABS-01</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {terminalOutputs.map((item, i) => (
          <div key={i} className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#111218] transition-all hover:border-indigo-500/30">
            <div className="bg-[#0E0F14] px-6 py-4 border-b border-gray-800 flex justify-between items-center group-hover:bg-[#111218] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.task}</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800 text-[8px] flex items-center justify-center text-gray-950 font-bold">×</div>
              </div>
            </div>
            <div className="p-4 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-6 text-indigo-400 font-bold bg-[#0A0B10] px-4 py-2 rounded-lg border border-indigo-500/10 w-fit">
                <span className="text-indigo-600">$</span>
                {item.command}
              </div>
              <div className="text-gray-400 bg-gray-950/50 p-6 rounded-xl border border-gray-900 whitespace-pre">
                {item.output}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Rollback Status */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
          <Activity size={24} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-bold text-red-400">ReplicaSet Drift Detected</p>
          <p className="text-xs text-gray-500">Revision #2 pending verification. Manual rollback capability active.</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95">
          Execute Rollback
        </button>
      </div>
    </div>
  );
}
