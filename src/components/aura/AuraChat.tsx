'use client';

/**
 * AURA CHAT COMPONENT
 * The most beautiful AI chat interface ever created
 * Combines premium animations, glassmorphism, and intelligent AI
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Send, Sparkles, Zap, Brain, Mic, Image, Code, Palette } from 'lucide-react';
import { useAuraChat, useAuraInView, useMagneticMouse, useGlassmorphism } from '@/lib/ai-enhanced-hooks';
import { cn } from '@/lib/aura-utils';
import confetti from 'canvas-confetti';

// === FLOATING 3D BACKGROUND ===
const FloatingOrbs = () => (
  <Canvas style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[0.8, 64, 64]} position={[-2, 0, 0]}>
        <MeshDistortMaterial
          color="#6366F1"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
        />
      </Sphere>
    </Float>
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere args={[0.6, 64, 64]} position={[2, 1, -1]}>
        <MeshDistortMaterial
          color="#8B5CF6"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.1}
        />
      </Sphere>
    </Float>
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere args={[0.4, 64, 64]} position={[0, -1, 1]}>
        <MeshDistortMaterial
          color="#06B6D4"
          attach="material"
          distort={0.2}
          speed={2.5}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  </Canvas>
);

// === MESSAGE COMPONENT ===
const Message = ({ message, isUser }: { message: any; isUser: boolean }) => {
  const { ref, variants, animate } = useAuraInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const magneticProps = useMagneticMouse(0.1);
  const glassProps = useGlassmorphism({
    opacity: isUser ? 0.15 : 0.08,
    blur: 20,
    interactive: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      animate={animate}
      initial="hidden"
      className={cn(
        'flex w-full mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <motion.div
        ref={magneticProps.ref}
        style={{ 
          ...glassProps.style,
          transform: magneticProps.transform,
        }}
        {...glassProps.handlers}
        className={cn(
          'max-w-[80%] p-6 rounded-3xl border shadow-lg',
          'transition-all duration-300 ease-out',
          isUser 
            ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-400/30' 
            : 'border-white/10'
        )}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 20px 80px rgba(99, 102, 241, 0.3)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        {!isUser && (
          <motion.div 
            className="flex items-center mb-3 space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AURA AI
            </span>
          </motion.div>
        )}
        
        <motion.div 
          className="text-white/90 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message.content.split('').map((char: string, index: number) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: isUser ? 0 : index * 0.02,
                duration: 0.1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// === TYPING INDICATOR ===
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center space-x-2 p-4"
  >
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-indigo-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
    <span className="text-sm text-white/60">AURA is thinking...</span>
  </motion.div>
);

// === AI MODE SELECTOR ===
const ModeSelector = ({ mode, setMode }: { mode: string; setMode: (mode: string) => void }) => {
  const modes = [
    { id: 'creative', icon: Palette, label: 'Creative', color: 'from-pink-500 to-orange-500' },
    { id: 'balanced', icon: Brain, label: 'Balanced', color: 'from-indigo-500 to-purple-500' },
    { id: 'precise', icon: Code, label: 'Precise', color: 'from-emerald-500 to-cyan-500' },
  ];

  return (
    <motion.div 
      className="flex space-x-2 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {modes.map((modeOption) => {
        const Icon = modeOption.icon;
        const isActive = mode === modeOption.id;
        
        return (
          <motion.button
            key={modeOption.id}
            onClick={() => setMode(modeOption.id)}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300',
              'border backdrop-blur-lg',
              isActive 
                ? `bg-gradient-to-r ${modeOption.color} border-white/30 shadow-lg` 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{modeOption.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// === MAIN CHAT COMPONENT ===
export const AuraChat = () => {
  const [mode, setMode] = useState('balanced');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const glassProps = useGlassmorphism({ opacity: 0.05, blur: 40 });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isTyping,
    sentiment,
    append,
  } = useAuraChat({
    api: '/api/ai/premium-chat',
    onResponse: () => {
      // Celebration effect for positive responses
      if (sentiment === 'positive') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366F1', '#8B5CF6', '#06B6D4'],
        });
      }
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced submit with mode context
  const enhancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await append({
      role: 'user',
      content: inputValue,
    }, {
      body: {
        mode,
        context: {
          page: 'chat',
          feature: 'aura-chat',
          userPreferences: { preferredProvider: 'auto' },
        },
      },
    });

    setInputValue('');
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ ...glassProps.style }}
      className="relative h-[600px] w-full max-w-4xl mx-auto rounded-3xl border overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <FloatingOrbs />
      </div>

      {/* Animated Background Mesh */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1)_0%,transparent_50%)]" />
      </motion.div>

      {/* Header */}
      <motion.div 
        className="relative z-10 p-6 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                AURA Assistant
              </h2>
              <p className="text-sm text-white/60">Multi-AI Premium Experience</p>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border',
              sentiment === 'positive' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' :
              sentiment === 'negative' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
              'bg-blue-500/20 border-blue-400/30 text-blue-300'
            )}>
              {sentiment}
            </div>
          </motion.div>
        </div>

        <div className="mt-4">
          <ModeSelector mode={mode} setMode={setMode} />
        </div>
      </motion.div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 h-[350px]">
        <AnimatePresence>
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div 
        className="relative z-10 p-6 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <form onSubmit={enhancedSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AURA anything..."
              disabled={isLoading}
              className={cn(
                'w-full px-6 py-4 rounded-2xl border transition-all duration-300',
                'bg-white/5 border-white/20 text-white placeholder-white/50',
                'focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50',
                'backdrop-blur-lg'
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Mic className="w-4 h-4 text-white/70" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Image className="w-4 h-4 text-white/70" />
              </motion.button>
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-6 py-4 rounded-2xl font-medium transition-all duration-300',
              'bg-gradient-to-r from-indigo-500 to-purple-600',
              'hover:from-indigo-400 hover:to-purple-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'shadow-lg hover:shadow-xl'
            )}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span>Thinking</span>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  className="flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AuraChat;