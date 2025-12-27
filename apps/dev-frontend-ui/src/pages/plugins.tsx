import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Github, Cloud, Shield, Check, ExternalLink, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const Plugins = () => {
    const [integrations, setIntegrations] = useState([
        {
            id: 'github',
            name: 'GitHub',
            icon: Github,
            status: 'disconnected', // Default to disconnected
            description: 'Sync your projects directly to GitHub repositories.',
            lastSync: 'Not connected',
            color: 'blue'
        },
        {
            id: 'google-cloud',
            name: 'Google Cloud',
            icon: Cloud,
            status: 'disconnected',
            description: 'Deploy and manage cloud infrastructure via AI commands.',
            lastSync: 'Never',
            color: 'cyan'
        }
    ]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.get('/user/status');

                if (response.data.githubLinked) {
                    setIntegrations(prev => prev.map(item =>
                        item.id === 'github' ? { ...item, status: 'connected', lastSync: 'Synced' } : item
                    ));
                }
            } catch (error) {
                console.error("Failed to fetch integration status:", error);
            }
        };

        fetchStatus();

        // Check for success or error from URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('github') === 'linked') {
            setShowSuccess(true);
            setIntegrations(prev => prev.map(item =>
                item.id === 'github' ? { ...item, status: 'connected', lastSync: 'Just now' } : item
            ));
            // Cleanup URL
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => setShowSuccess(false), 5000);
        }

        if (urlParams.get('error') === 'email_mismatch') {
            setShowError("Please sign in with the email address associated with your GitHub account.");
            // Cleanup URL
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => setShowError(null), 8000);
        }
    }, []);

    const handleToggle = (id: string) => {
        setIntegrations(prev => prev.map(item =>
            item.id === id ? { ...item, status: item.status === 'connected' ? 'disconnected' : 'connected' } : item
        ));
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-10 pb-20">
                {/* Success Notification */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-between text-green-400"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Check className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Successfully Linked GitHub!</p>
                                <p className="text-xs opacity-70">DEV.OS now has permission to push code to your account.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error Notification */}
                {showError && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center justify-between text-red-400"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Link Failed</p>
                                <p className="text-xs opacity-70">{showError}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-4">
                        <Settings className="w-12 h-12 text-cyan-500" /> Plugins & Integrations
                    </h1>
                    <p className="text-slate-400 text-lg">Extend DEV's capabilities by connecting your professional toolstack.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {integrations.filter(i => i.id !== 'google-cloud').map((plugin, idx) => (
                        <motion.div
                            key={plugin.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group relative overflow-hidden col-span-2"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${plugin.color}-500/50 to-transparent`} />

                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-3xl bg-${plugin.color}-500/10 border border-${plugin.color}-500/20 shadow-neon-${plugin.color}`}>
                                    <plugin.icon className={`w-10 h-10 text-${plugin.color}-400`} />
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${plugin.status === 'connected'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                    : 'bg-slate-800 text-slate-500 border-white/5'
                                    }`}>
                                    {plugin.status.toUpperCase()}
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">{plugin.name}</h2>
                            <p className="text-slate-400 mb-10 leading-relaxed text-lg max-w-2xl">{plugin.description}</p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-neon-cyan" />
                                        <span className="text-slate-400 font-medium">Automatic Syncing</span>
                                    </div>
                                    <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer" onClick={() => handleToggle(plugin.id)}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${plugin.status === 'connected' ? 'right-1 bg-cyan-400 shadow-neon-cyan' : 'left-1 bg-slate-600'}`} />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            if (plugin.id === 'github' && plugin.status !== 'connected') {
                                                const token = localStorage.getItem('dev_token');
                                                window.location.href = `http://localhost:3001/api/auth/github${token ? `?token=${token}` : ''}`;
                                            }
                                        }}
                                        className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform ${plugin.status === 'connected' ? 'bg-slate-800 text-white border border-white/10' : 'bg-white text-black'}`}
                                    >
                                        {plugin.status === 'connected' ? 'Connected' : 'Connect Account'} <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Repo Visualization InfoGraphic */}
                            {plugin.status === 'connected' && (
                                <div className="mt-10 pt-10 border-t border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Github className="w-5 h-5" /> Recent Repositories
                                    </h3>
                                    <RepoGrid />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

const RepoGrid = () => {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchRepos = async () => {
            try {
                const token = localStorage.getItem('dev_token');
                if (!token) return;
                const res = await api.get('/github/repos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRepos(res.data);
            } catch (err) {
                console.error("Failed to load repos", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRepos();
        // Poll for updates every 10s to show new repos live
        const interval = setInterval(fetchRepos, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-slate-500 animate-pulse">Loading repositories...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo: any) => (
                <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-1"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                            <span className="font-mono text-xs text-cyan-400">{repo.language || 'Code'}</span>
                        </div>
                        <span className="text-xs text-slate-500">{new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="font-bold text-white mb-1 truncate">{repo.name}</div>
                    <p className="text-xs text-slate-400 line-clamp-2 h-8">{repo.description || 'No description provided.'}</p>
                </a>
            ))}
            {repos.length === 0 && (
                <div className="col-span-full text-center py-10 text-slate-500 border border-dashed border-white/10 rounded-2xl">
                    No repositories found yet. Try asking Dev to "Create a repo".
                </div>
            )}
        </div>
    );
};

export default Plugins;
