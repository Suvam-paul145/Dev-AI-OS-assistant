
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import CodeBuddy from '@/components/CodeBuddy';
import CommandHistory from '@/components/CommandHistory';
import TasksControls from '@/components/TasksControls';
import ActivityLog from '@/components/ActivityLog';
import Permissions from '@/components/Permissions';
import PermissionModal from '@/components/PermissionModal';
import { motion, Reorder } from 'framer-motion';
import { api } from '../lib/api';

export default function Dashboard() {
    const [showPermissions, setShowPermissions] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userName, setUserName] = useState('');
    const [items, setItems] = useState(['controls', 'activity', 'buddy']);

    const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

    // Check for Auth Token and Fetch Status
    React.useEffect(() => {
        setIsHydrated(true);

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const name = params.get('name');
        const storedName = localStorage.getItem('dev_user_name');

        if (name) {
            setUserName(name);
            localStorage.setItem('dev_user_name', name);
        } else if (storedName) {
            setUserName(storedName);
        }

        if (token) {
            localStorage.setItem('dev_token', token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const fetchStatus = async () => {
            try {
                const response = await api.get('/user/status');
                const p = response.data.permissions;

                if (p) {
                    // Sync backend perms to localStorage for UI consistency
                    localStorage.setItem('perm_mic', String(p.voice_control));
                    localStorage.setItem('perm_system', String(p.file_access));
                    localStorage.setItem('perm_app_automation', String(p.app_automation));
                    window.dispatchEvent(new Event('storage'));

                    // If all critical permissions are false, it might be a new user, show modal
                    if (!p.voice_control && !p.file_access) {
                        setShowPermissions(true);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user status/permissions:", err);
                if (!localStorage.getItem('perm_mic')) {
                    setShowPermissions(true);
                }
            }
        };

        fetchStatus();
    }, []);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <Layout>
            <PermissionModal isOpen={showPermissions} onComplete={() => setShowPermissions(false)} />

            {isHydrated && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-end justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                            {getTimeGreeting()}, {userName.split(' ')[0] || 'Developer'}
                        </h1>
                        <p className="text-slate-400 mt-2">Systems online. Ready for command.</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Status Pills */}
                        <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            OS ACTIVE
                        </div>
                    </div>
                </motion.div>
            )}

            {isHydrated && (
                <Reorder.Group
                    axis="x"
                    values={items}
                    onReorder={setItems}
                    className="grid grid-cols-12 gap-8 pb-10 min-h-full"
                    as="div"
                >
                    {items.map((item) => (
                        <Reorder.Item
                            key={item}
                            value={item}
                            className={`col-span-12 ${item === 'activity' ? 'lg:col-span-6' : 'lg:col-span-3'}`}
                            as="div"
                            dragListener={true}
                            whileDrag={{ scale: 1.02, zIndex: 50 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Drag Handle Overlay */}
                            <div className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2 bg-black/40 rounded-lg backdrop-blur border border-white/5 hover:bg-white/10">
                                <div className="space-y-1">
                                    <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                                    <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                                    <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                                </div>
                            </div>

                            {item === 'controls' && (
                                <div className="h-full group">
                                    <TasksControls onCommandExecuted={handleRefresh} />
                                </div>
                            )}
                            {item === 'activity' && (
                                <div className="flex flex-col gap-8 h-full group">
                                    <div className="flex-1">
                                        <ActivityLog />
                                    </div>
                                    <div className="flex-1">
                                        <CommandHistory refreshTrigger={refreshTrigger} />
                                    </div>
                                </div>
                            )}
                            {item === 'buddy' && (
                                <div className="h-full group">
                                    <div className="sticky top-6 h-[calc(100vh-160px)]">
                                        <CodeBuddy onCommandExecuted={handleRefresh} />
                                    </div>
                                </div>
                            )}
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </Layout>
    );
}
