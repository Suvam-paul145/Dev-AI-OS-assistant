import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Mic, Send, Cpu, Wifi, Battery, Layers, Code, Terminal, 
  Activity, Zap, Volume2, Sparkles, Box, Shield, 
  ArrowDown, ChevronRight, BarChart3, Globe, Loader,
  VolumeX, Play
} from 'lucide-react';

// --- 1. GEMINI API HELPERS ---

const apiKey = ""; // Injected by env

const callGemini = async (prompt, systemInstruction, jsonMode = true) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: jsonMode ? { 
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          response: { type: "STRING" },
          mode: { type: "STRING" },
          intent: { type: "STRING" },
          steps: { 
            type: "ARRAY", 
            items: { 
              type: "OBJECT", 
              properties: { id: { type: "NUMBER" }, name: { type: "STRING" } } 
            } 
          },
          code: { type: "STRING" }
        }
      }
    } : {}
  };

  const maxRetries = 5;
  let delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error(`API status: ${res.status}`);
      
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("Empty response from AI");
      
      return jsonMode ? JSON.parse(text) : text;
    } catch (e) {
      if (i === maxRetries - 1) {
        console.error("Max retries reached. Gemini Error:", e);
        return null;
      }
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};

// Neural TTS using gemini-2.5-flash-preview-tts
const generateSpeech = async (text) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: `Say in a calm, futuristic, robotic tone: ${text}` }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Fenrir" }
        }
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error("TTS API fail");
    
    const result = await res.json();
    const audioData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) return null;

    const pcmToWav = (base64Pcm) => {
      const pcmData = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0)).buffer;
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);
      const sampleRate = 24000;
      
      view.setUint32(0, 0x46464952, true); // "RIFF"
      view.setUint32(4, 36 + pcmData.byteLength, true);
      view.setUint32(8, 0x45564157, true); // "WAVE"
      view.setUint32(12, 0x20746d66, true); // "fmt "
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      view.setUint32(36, 0x61746164, true); // "data"
      view.setUint32(40, pcmData.byteLength, true);

      const blob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    };

    const audioUrl = pcmToWav(audioData);
    return new Audio(audioUrl);
  } catch (e) {
    console.error("TTS Error:", e);
    return null;
  }
};

// --- 2. UI COMPONENTS ---

const GlassCard = ({ children, className = "", id = "" }) => (
  <div 
    id={id}
    className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:border-cyan-500/30 ${className}`}
  >
    {children}
  </div>
);

// --- 3. MAIN APP ---

export default function App() {
  const [status, setStatus] = useState('IDLE');
  const [inputText, setInputText] = useState('');
  const [logs, setLogs] = useState([{ id: 0, type: 'SYS', text: 'Neural Interface Online', time: '08:00' }]);
  const [aiResponse, setAiResponse] = useState(null);
  const [mode, setMode] = useState('ASSISTANT');
  const [libsReady, setLibsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [coreColor, setCoreColor] = useState(0x06b6d4);
  
  // Mock System Stats
  const cpuVal = 82;
  const memVal = 56;
  const [diagText, setDiagText] = useState("");

  const canvasContainerRef = useRef();
  const coreRef = useRef();
  const logIdRef = useRef(1);

  // --- MANUAL THREE.JS SETUP ---
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = canvasContainerRef.current.clientWidth;
    const height = canvasContainerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0891b2,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(geometry, material);
    coreRef.current = core;
    scene.add(core);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.02, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 5 })
    );
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.01, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x818cf8, emissiveIntensity: 3 })
    );
    ring2.rotation.y = Math.PI / 2;
    scene.add(ring2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight1 = new THREE.PointLight(0x06b6d4, 1.5);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      if (coreRef.current) {
        coreRef.current.rotation.y = t * 0.2;
        coreRef.current.rotation.x = t * 0.1;
        const s = 1 + Math.sin(t * 2) * 0.05;
        coreRef.current.scale.set(s, s, s);
      }
      ring1.rotation.z = t * 0.5;
      ring2.rotation.y = -t * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasContainerRef.current) return;
      const w = canvasContainerRef.current.clientWidth;
      const h = canvasContainerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (canvasContainerRef.current) canvasContainerRef.current.innerHTML = '';
    };
  }, []);

  // Sync color changes with Core
  useEffect(() => {
    if (coreRef.current) {
      coreRef.current.material.emissive.setHex(coreColor);
      coreRef.current.material.color.setHex(coreColor);
    }
  }, [coreColor]);

  // Dynamic Library Loading for GSAP and Lenis
  useEffect(() => {
    const loadScripts = async () => {
      const scripts = [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        'https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js'
      ];
      for (const src of scripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
      }
      setLibsReady(true);
    };
    loadScripts();
  }, []);

  useEffect(() => {
    if (!libsReady || !window.gsap) return;
    const { gsap, ScrollTrigger } = window;
    const LenisClass = window.Lenis?.default || window.Lenis;
    
    if (!LenisClass) return;
    
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new LenisClass({ duration: 1.2, smoothWheel: true });
    
    function raf(time) { 
      lenis.raf(time); 
      requestAnimationFrame(raf); 
    }
    requestAnimationFrame(raf);
    
    gsap.utils.toArray('.reveal').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, scrollTrigger: {
          trigger: section, start: "top 85%", toggleActions: "play none none reverse"
        }}
      );
    });
    
    return () => lenis.destroy();
  }, [libsReady]);

  const addLog = (type, text) => {
    setLogs(prev => [...prev, {
      id: logIdRef.current++,
      type, text: String(text), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleAction = async () => {
    if (!inputText.trim() || status === 'PROCESSING') return;
    const cmd = inputText;
    setInputText('');
    setStatus('PROCESSING');
    addLog('USER', cmd);
    
    const sysInstruction = `You are JARVIS. Persona: Futuristic OS Assistant. 
    Analyze command. Return JSON. 
    Mode must be one of [ASSISTANT, DEV, CHILL]. 
    If mode is DEV, generate relevant code. If CHILL, focus on relaxation.
    Reply in Hinglish if the user does.`;
    
    const result = await callGemini(cmd, sysInstruction);
    if (!result) {
      setStatus('IDLE');
      return;
    }

    setAiResponse(result);
    setMode(result.mode || 'ASSISTANT');
    addLog('SYS', result.response || "Neural link acknowledged.");

    // Dynamic Core Color
    if (result.mode === 'DEV') setCoreColor(0x8b5cf6);
    else if (result.mode === 'CHILL') setCoreColor(0x3b82f6);
    else setCoreColor(0x06b6d4);

    // Speak Response
    const speech = await generateSpeech(result.response || "");
    if (speech && !isMuted) {
      setStatus('SPEAKING');
      speech.play();
      speech.onended = () => setStatus('IDLE');
    } else {
      setStatus('IDLE');
    }
  };

  const runDiagnostic = async () => {
    setStatus('PROCESSING');
    addLog('SYS', 'Initializing Neural Scan ✨');
    const prompt = `Perform a system diagnostic scan. CPU is at ${cpuVal}%, Memory at ${memVal}%, Heat is NOMINAL. Give a short, cryptic, sci-fi status update.`;
    const sysInstruction = "You are a hardware monitor AI. Be technical and futuristic.";
    const report = await callGemini(prompt, sysInstruction, false);
    
    setDiagText(String(report || "Diagnostic output corrupted."));
    addLog('SYS', 'Diagnostic complete.');
    setCoreColor(0xf59e0b); 
    setTimeout(() => setCoreColor(0x06b6d4), 3000);
    
    const speech = await generateSpeech(report || "");
    if (speech && !isMuted) {
      setStatus('SPEAKING');
      speech.play();
      speech.onended = () => setStatus('IDLE');
    } else {
      setStatus('IDLE');
    }
  };

  const features = [
    { Icon: Code, title: 'Vibe Coding', desc: 'Real-time collaborative neural code generation.' },
    { Icon: Shield, title: 'Core Security', desc: 'Isolated sandbox for critical system execution.' },
    { Icon: Zap, title: 'Instant Uplink', desc: 'Ultra-low latency connection to global APIs.' }
  ];

  return (
    <div className="bg-[#050505] text-white selection:bg-cyan-500/30 font-sans leading-relaxed overflow-x-hidden min-h-screen">
      
      {/* 3D CORE BACKGROUND */}
      <div ref={canvasContainerRef} className="fixed inset-0 z-0 opacity-60 pointer-events-none" />

      {/* UI OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-10" />

      {/* CONTENT */}
      <div className="relative z-10">
        
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs mb-6 animate-pulse">
              <Zap className="w-3 h-3" /> Jarvis OS v2.5: Neural Link Active
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              JARVIS<span className="text-cyan-500">.</span>OS
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg mb-8 font-light">
              Autonomous neural interface with vocal synthesis and dynamic core modulation.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
              >
                {isMuted ? <VolumeX className="text-red-400" /> : <Volume2 className="text-cyan-400" />}
              </button>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <ArrowDown className="w-6 h-6 text-cyan-500" />
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="container mx-auto px-6 py-24 grid grid-cols-12 gap-8">
          
          {/* METRICS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <GlassCard className="reveal">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold tracking-widest text-cyan-500 uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4" /> System Health
                </h3>
                <button 
                  onClick={runDiagnostic}
                  className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30 hover:bg-cyan-500/40 transition-all flex items-center gap-1"
                >
                   Scan ✨
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Neural Link', val: 82, color: 'bg-cyan-500' },
                  { label: 'Quantum Memory', val: 56, color: 'bg-blue-500' },
                ].map((item, i) => (
                  <div key={`stat-${i}`}>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-gray-400">{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {diagText && (
                <div className="mt-6 text-[11px] font-mono text-amber-300 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in">
                  &gt; {diagText}
                </div>
              )}
            </GlassCard>

            <GlassCard className="reveal delay-150">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-indigo-400">
                <Globe className="w-4 h-4" /> Neural Uplink
              </h3>
              <div className="space-y-3 h-40 overflow-y-auto custom-scrollbar pr-2">
                {logs.slice().reverse().map((log) => (
                  <div key={log.id} className="text-[10px] font-mono border-l border-white/10 pl-3 py-1 animate-in fade-in slide-in-from-left-2">
                    <span className="text-cyan-500/60">[{log.time}]</span> <span className={log.type === 'USER' ? 'text-blue-300' : 'text-gray-300'}>{log.text}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* MAIN AI INTERFACE */}
          <div className="col-span-12 lg:col-span-8">
            <GlassCard className="reveal min-h-[500px] flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent group-hover:via-cyan-400 transition-all duration-500" />
              
              <div className="flex-1 p-4 space-y-6">
                {aiResponse ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-cyan-400 text-xs font-mono mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> JARVIS NEURAL OUTPUT
                    </div>
                    <p className="text-2xl font-light text-white leading-relaxed mb-8">
                      {String(aiResponse.response || "")}
                    </p>
                    
                    {aiResponse.code && (
                      <div className="relative group/code">
                         <div className="absolute top-2 right-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                           Dev Mode
                         </div>
                         <div className="bg-black/60 rounded-xl p-6 border border-white/5 font-mono text-sm text-green-400 overflow-x-auto shadow-inner">
                            <pre className="custom-scrollbar"><code>{String(aiResponse.code)}</code></pre>
                         </div>
                      </div>
                    )}

                    {aiResponse.steps && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                         {aiResponse.steps.map((step, idx) => (
                           <div key={`step-${idx}`} className="flex items-center gap-3 text-[10px] text-gray-400 border border-white/5 p-2 rounded bg-white/5">
                              <Zap className="w-3 h-3 text-cyan-500" />
                              {String(step.name || "")}
                           </div>
                         ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-20">
                    <Sparkles className="w-16 h-16 mb-4 animate-pulse text-cyan-500" />
                    <p className="font-mono text-sm tracking-[0.3em] uppercase">Vocal Link Primed</p>
                  </div>
                )}
              </div>

              {/* INPUT */}
              <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
                <div className="relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                    placeholder="Speak your intent..."
                    className="w-full bg-transparent border-none py-4 px-12 text-lg text-white placeholder-gray-700 focus:ring-0 font-light"
                  />
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button 
                      onClick={handleAction}
                      disabled={status === 'PROCESSING'}
                      className="p-3 bg-cyan-500 rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      {status === 'PROCESSING' || status === 'SPEAKING' ? 
                        <Loader className="w-4 h-4 animate-spin text-black" /> : 
                        <Send className="w-4 h-4 text-black" />}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const { Icon } = feature;
              return (
                <GlassCard key={`feature-${i}`} className="reveal text-center group cursor-default">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-cyan-500/50">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">{feature.title}</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">{feature.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

      </div>
      
      {/* SCROLLBARS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.2); }
        .reveal { transition: all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}} />
    </div>
  );
}