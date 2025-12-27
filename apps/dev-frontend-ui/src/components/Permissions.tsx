
import React from 'react';
import { Shield, FileText, Globe, Cpu, ToggleRight, Info } from 'lucide-react';
import { api } from '../lib/api';

const Permissions = () => {
    // State management
    const [perms, setPerms] = React.useState({
        mic: false,
        system: false,
        automation: false
    });
    const [loading, setLoading] = React.useState(true);

    // Load permissions from backend on mount
    React.useEffect(() => {
        const loadPerms = async () => {
            try {
                const response = await api.get('/user/status');
                const p = response.data.permissions || {};
                setPerms({
                    mic: p.voice_control,
                    system: p.file_access,
                    automation: p.app_automation
                });
            } catch (error) {
                console.error("Failed to load permissions:", error);
                // Fallback to local storage
                setPerms({
                    mic: localStorage.getItem('perm_mic') === 'true',
                    system: localStorage.getItem('perm_system') === 'true',
                    automation: localStorage.getItem('perm_app_automation') === 'true',
                });
            } finally {
                setLoading(false);
            }
        };

        loadPerms();
    }, []);

    const togglePerm = async (key: string, backendKey: string) => {
        // Optimistic update
        const newState = !perms[key as keyof typeof perms];
        setPerms(prev => ({ ...prev, [key]: newState }));

        // Sync to backend
        try {
            const payload = {
                voice_control: key === 'mic' ? newState : perms.mic,
                file_access: key === 'system' ? newState : perms.system,
                app_automation: key === 'automation' ? newState : perms.automation,
            };

            await api.post('/user/permissions', payload);

            // Sync local storage as backup
            localStorage.setItem(`perm_${key === 'mic' ? 'mic' : key === 'system' ? 'system' : 'app_automation'}`, String(newState));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Failed to update permissions:", error);
            // Revert on failure
            setPerms(prev => ({ ...prev, [key]: !newState }));
        }
    };

    const permissions = [
        { key: 'pipeline', backendKey: '', name: "Pipeline", icon: <Globe className="w-4 h-4 text-blue-400" />, status: true, locked: true },
        { key: 'system', backendKey: 'file_access', name: "File Access", icon: <FileText className="w-4 h-4 text-orange-400" />, status: perms.system },
        { key: 'automation', backendKey: 'app_automation', name: "App Automation", icon: <Cpu className="w-4 h-4 text-purple-400" />, status: perms.automation },
        { key: 'mic', backendKey: 'voice_control', name: "Voice Control", icon: <Shield className="w-4 h-4 text-green-400" />, status: perms.mic }
    ];

    if (loading) return <div className="p-6 text-slate-500">Loading permissions...</div>;

    return (
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" /> Permissions
                </h2>
                <Info className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="space-y-4">
                {permissions.map((perm, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${perm.locked ? 'bg-slate-900/40 border-white/5 opacity-60 cursor-not-allowed' : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60 cursor-pointer'}`}
                        onClick={() => !perm.locked && togglePerm(perm.key, perm.backendKey)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                                {perm.icon}
                            </div>
                            <span className="font-medium text-slate-200">{perm.name}</span>
                        </div>
                        <div className={`${perm.status ? 'text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] rounded-full' : 'text-slate-600'}`}>
                            <ToggleRight className={`w-8 h-8 transition-all ${perm.status ? 'fill-current rotate-0' : 'rotate-180 opacity-50'}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-slate-500">
                    Granting permissions allows "Code Buddy" to interact with your system.
                </p>
            </div>
        </div>
    );
};

export default Permissions;
