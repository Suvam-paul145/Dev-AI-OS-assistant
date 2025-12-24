import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Settings, Activity, Lock } from 'lucide-react';

/**
 * Main Dashboard Component
 * Requirement 9.1: Main dashboard interface
 */
export default function Dashboard() {
  const [command, setCommand] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const handleSendCommand = () => {
    if (command.trim()) {
      setResponses([...responses, command]);
      setCommand('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Dev AI Assistant</h1>
        <p className="text-gray-400">Your intelligent operating system companion</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Command Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Avatar */}
          <div className="bg-gradient-to-b from-purple-500 to-purple-700 rounded-xl p-8 text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🤖</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Dev Assistant</h2>
            <p className="text-purple-200">Ready to help</p>
          </div>

          {/* Command Input */}
          <div className="bg-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Send className="w-5 h-5" /> Send Command
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendCommand()}
                placeholder="Type a command... (e.g., open notepad)"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className={`p-3 rounded-lg ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-purple-600 hover:bg-purple-700'
                } transition-colors`}
              >
                <Mic className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendCommand}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send
              </motion.button>
            </div>

            {isListening && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-center text-red-400"
              >
                🎤 Listening...
              </motion.div>
            )}
          </div>

          {/* Response Feed */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Response Feed
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {responses.map((resp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-700 rounded p-4 border-l-4 border-purple-500"
                >
                  <p className="text-sm text-gray-300 mb-2">Command #{idx + 1}</p>
                  <p className="text-white">{resp}</p>
                  <p className="text-xs text-gray-400 mt-2">Processing...</p>
                </motion.div>
              ))}

              {responses.length === 0 && (
                <p className="text-gray-400 text-center py-8">No commands yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Settings Panel */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" /> Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Language</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none">
                  <option>English</option>
                  <option>हिन्दी (Hindi)</option>
                  <option>Mixed (EN+HI)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Theme</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-400">Voice Enabled</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Permissions
            </h3>

            <div className="space-y-3">
              {['File Access', 'App Control', 'System Query'].map((perm) => (
                <div key={perm} className="flex items-center justify-between">
                  <span className="text-sm">{perm}</span>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    Allowed
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Session Stats</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-purple-100">Commands Processed</p>
                <p className="text-2xl font-bold">{responses.length}</p>
              </div>
              <div>
                <p className="text-sm text-purple-100">Success Rate</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
