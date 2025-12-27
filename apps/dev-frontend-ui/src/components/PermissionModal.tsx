import React, { useState } from 'react';
import { Shield, Mic, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

interface PermissionModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onComplete }) => {
    const [step, setStep] = useState(0);
    const [pendingPerms, setPendingPerms] = useState({
        voice_control: false,
        file_access: false,
        app_automation: false
    });

    if (!isOpen) return null;

    const syncToBackend = async (payload: any) => {
        try {
            await api.post('/user/permissions', payload);
        } catch (err) {
            console.error("Failed to sync permissions to backend:", err);
        }
    };

    const savePermission = (key: string, value: boolean) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value.toString());
            window.dispatchEvent(new Event('storage'));
        }
    };

    const steps = [
        {
            title: "Voice Access",
            desc: "Allow Dev to listen and respond via your microphone.",
            icon: <Mic className="w-8 h-8 text-blue-400" />,
            action: async () => {
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                    const newPerms = { ...pendingPerms, voice_control: true };
                    setPendingPerms(newPerms);
                    savePermission('perm_mic', true);
                    await syncToBackend(newPerms);
                    setStep(1);
                } catch (err) {
                    console.error("Microphone permission denied:", err);
                    alert("Microphone access is needed for voice commands. Please allow it in your browser settings.");
                    savePermission('perm_mic', false);
                    setStep(1);
                }
            }
        },
        {
            title: "System Control",
            desc: "Allow Dev to manage apps and files (via Local Server).",
            icon: <Shield className="w-8 h-8 text-purple-400" />,
            action: async () => {
                const newPerms = { ...pendingPerms, file_access: true, app_automation: true };
                setPendingPerms(newPerms);
                savePermission('perm_system', true);
                savePermission('perm_app_automation', true);
                await syncToBackend(newPerms);

                await new Promise(r => setTimeout(r, 500));
                onComplete();
            }
        }
    ];

    const currentStep = steps[step];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-white/10 p-8 rounded-2xl max-w-md w-full text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-slate-800 rounded-full border border-white/5">
                            {currentStep.icon}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">{currentStep.title}</h2>
                    <p className="text-slate-400 mb-8">{currentStep.desc}</p>

                    <button
                        onClick={currentStep.action}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                        Allow Access
                    </button>

                    <div className="mt-4 flex justify-center gap-2">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PermissionModal;
