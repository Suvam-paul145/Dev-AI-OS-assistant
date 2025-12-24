import React from 'react';
import { motion } from 'framer-motion';

/**
 * Avatar Component
 * Requirement 9.2: Animated 3D avatar with expressions
 */
export function Avatar() {
  const [expression, setExpression] = React.useState<'neutral' | 'listening' | 'thinking' | 'happy'>('neutral');

  React.useEffect(() => {
    const timer = setInterval(() => {
      const expressions: Array<'neutral' | 'listening' | 'thinking' | 'happy'> = ['neutral', 'listening', 'thinking', 'happy'];
      setExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getEmojiForExpression = () => {
    switch (expression) {
      case 'listening':
        return '👂';
      case 'thinking':
        return '🤔';
      case 'happy':
        return '😊';
      default:
        return '🤖';
    }
  };

  return (
    <motion.div
      animate={{ scale: expression === 'listening' ? 1.1 : 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
        <motion.span
          animate={{ rotate: expression === 'thinking' ? 360 : 0 }}
          transition={{ duration: 2, repeat: expression === 'thinking' ? Infinity : 0 }}
          className="text-7xl"
        >
          {getEmojiForExpression()}
        </motion.span>
      </div>
      <p className="text-sm text-gray-400 capitalize">{expression}</p>
    </motion.div>
  );
}

/**
 * Command Bar Component
 * Requirement 9.3: Voice and text input interface
 */
export function CommandBar() {
  const [input, setInput] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);

  const handleSubmit = () => {
    if (input.trim()) {
      console.log('Command submitted:', input);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type or say a command..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRecording(!isRecording)}
          className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          🎤
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          Send
        </motion.button>
      </div>
      {isRecording && (
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-center text-red-400 text-sm"
        >
          🎤 Listening...
        </motion.p>
      )}
    </div>
  );
}

/**
 * Response Feed Component
 * Requirement 9.4: Display assistant responses
 */
export function ResponseFeed({ responses }: { responses: string[] }) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {responses.map((response, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700 rounded p-4 border-l-4 border-purple-500"
        >
          <p className="text-white">{response}</p>
          <p className="text-xs text-gray-400 mt-2">Just now</p>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Activity Feed Component
 * Requirement 9.5: Show command history
 */
export function ActivityFeed({ activities }: { activities: Array<{ action: string; time: string }> }) {
  return (
    <div className="space-y-2">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 bg-slate-700 rounded">
          <span className="text-sm text-white">{activity.action}</span>
          <span className="text-xs text-gray-400">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}
