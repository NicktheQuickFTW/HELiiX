/**
 * AI-ENHANCED HOOKS
 * Premium React hooks with AI capabilities for the most intelligent UI
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useChat, useCompletion, useAssistant } from 'ai/react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { debounce, throttle } from './aura-utils';

// === AI CHAT HOOK WITH PREMIUM UX ===
export const useAuraChat = (options?: {
  api?: string;
  id?: string;
  initialMessages?: any[];
  onResponse?: (response: any) => void;
  onError?: (error: Error) => void;
}) => {
  const chat = useChat({
    api: options?.api || '/api/ai/chat',
    id: options?.id,
    initialMessages: options?.initialMessages,
    onResponse: options?.onResponse,
    onError: options?.onError,
  });

  const [isTyping, setIsTyping] = useState(false);
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');

  // Analyze message sentiment for UI adaptation
  const analyzeSentiment = useCallback((message: string) => {
    const positiveWords = ['great', 'awesome', 'excellent', 'perfect', 'amazing'];
    const negativeWords = ['error', 'problem', 'issue', 'wrong', 'failed'];
    
    const lowerMessage = message.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerMessage.includes(word));
    const hasNegative = negativeWords.some(word => lowerMessage.includes(word));
    
    if (hasPositive && !hasNegative) setSentiment('positive');
    else if (hasNegative && !hasPositive) setSentiment('negative');
    else setSentiment('neutral');
  }, []);

  // Enhanced append with typing indicator
  const enhancedAppend = useCallback(async (message: any) => {
    setIsTyping(true);
    analyzeSentiment(message.content);
    
    try {
      await chat.append(message);
    } finally {
      setIsTyping(false);
    }
  }, [chat.append, analyzeSentiment]);

  return {
    ...chat,
    isTyping,
    sentiment,
    append: enhancedAppend,
  };
};

// === AI COMPLETION HOOK WITH SMART SUGGESTIONS ===
export const useAuraCompletion = (options?: {
  api?: string;
  id?: string;
  onFinish?: (prompt: string, completion: string) => void;
}) => {
  const completion = useCompletion({
    api: options?.api || '/api/ai/complete',
    id: options?.id,
    onFinish: options?.onFinish,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);

  // Generate smart suggestions based on input
  const generateSuggestions = useCallback(
    debounce((input: string) => {
      if (input.length < 3) {
        setSuggestions([]);
        return;
      }

      // Simple suggestion algorithm (can be enhanced with AI)
      const commonSuggestions = [
        `${input} analysis`,
        `${input} recommendations`,
        `${input} best practices`,
        `${input} examples`,
        `${input} implementation`,
      ];

      setSuggestions(commonSuggestions);
      setConfidence(Math.min(input.length / 20, 1));
    }, 300),
    []
  );

  const enhancedComplete = useCallback(async (prompt: string) => {
    generateSuggestions(prompt);
    return completion.complete(prompt);
  }, [completion.complete, generateSuggestions]);

  return {
    ...completion,
    suggestions,
    confidence,
    complete: enhancedComplete,
  };
};

// === ANIMATED SCROLL HOOK ===
export const useAuraScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const updateScroll = useCallback(
    throttle(() => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      setScrollY(currentScrollY);
      setScrollProgress(maxScroll > 0 ? currentScrollY / maxScroll : 0);
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      setIsScrolling(true);
      
      lastScrollY.current = currentScrollY;

      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
    }, 16),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, [updateScroll]);

  return { scrollY, scrollDirection, isScrolling, scrollProgress };
};

// === MAGNETIC MOUSE HOOK ===
export const useMagneticMouse = (strength: number = 0.3) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setMousePosition({ x: deltaX, y: deltaY });
  }, [strength]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    document.addEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
    document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  return {
    ref: elementRef,
    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
    isHovering,
  };
};

// === INTERSECTION OBSERVER HOOK WITH ANIMATIONS ===
export const useAuraInView = (options?: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animationVariants?: any;
}) => {
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, {
    threshold: options?.threshold || 0.1,
    margin: options?.rootMargin || '0px',
    once: options?.triggerOnce ?? true,
  });

  const defaultVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      filter: 'blur(10px)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const variants = options?.animationVariants || defaultVariants;

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!options?.triggerOnce) {
      controls.start('hidden');
    }
  }, [inView, controls, options?.triggerOnce]);

  return {
    ref,
    controls,
    inView,
    variants,
    animate: controls,
  };
};

// === PARTICLE SYSTEM HOOK ===
export const useParticleSystem = (config?: {
  count?: number;
  colors?: string[];
  speed?: number;
  size?: number;
}) => {
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
  }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const defaultConfig = {
    count: 50,
    colors: ['#6366F1', '#8B5CF6', '#3B82F6', '#06B6D4'],
    speed: 1,
    size: 2,
    ...config,
  };

  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newParticles = Array.from({ length: defaultConfig.count }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * defaultConfig.speed,
      vy: (Math.random() - 0.5) * defaultConfig.speed,
      size: Math.random() * defaultConfig.size + 1,
      color: defaultConfig.colors[Math.floor(Math.random() * defaultConfig.colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
    }));

    setParticles(newParticles);
  }, [defaultConfig]);

  const updateParticles = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    setParticles(prev => prev.map(particle => {
      let { x, y, vx, vy } = particle;
      
      x += vx;
      y += vy;
      
      // Bounce off edges
      if (x <= 0 || x >= rect.width) vx *= -1;
      if (y <= 0 || y >= rect.height) vy *= -1;
      
      return { ...particle, x, y, vx, vy };
    }));

    animationRef.current = requestAnimationFrame(updateParticles);
  }, []);

  useEffect(() => {
    initializeParticles();
    updateParticles();

    const handleResize = debounce(initializeParticles, 300);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeParticles, updateParticles]);

  return {
    containerRef,
    particles,
    reinitialize: initializeParticles,
  };
};

// === GLASSMORPHISM HOOK ===
export const useGlassmorphism = (options?: {
  opacity?: number;
  blur?: number;
  borderOpacity?: number;
  interactive?: boolean;
}) => {
  const [glassStyle, setGlassStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const defaultOptions = {
    opacity: 0.1,
    blur: 16,
    borderOpacity: 0.12,
    interactive: true,
    ...options,
  };

  const baseStyle = useMemo(() => ({
    background: `rgba(255, 255, 255, ${defaultOptions.opacity})`,
    backdropFilter: `blur(${defaultOptions.blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${defaultOptions.borderOpacity})`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [defaultOptions]);

  const hoveredStyle = useMemo(() => ({
    ...baseStyle,
    background: `rgba(255, 255, 255, ${defaultOptions.opacity + 0.05})`,
    backdropFilter: `blur(${defaultOptions.blur + 8}px)`,
    border: `1px solid rgba(255, 255, 255, ${defaultOptions.borderOpacity + 0.08})`,
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6), 0 0 100px rgba(99, 102, 241, 0.15)',
  }), [baseStyle, defaultOptions]);

  useEffect(() => {
    setGlassStyle(isHovered && defaultOptions.interactive ? hoveredStyle : baseStyle);
  }, [isHovered, baseStyle, hoveredStyle, defaultOptions.interactive]);

  const handlers = defaultOptions.interactive ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  return {
    style: glassStyle,
    handlers,
    isHovered,
  };
};

// === SMART THEME HOOK ===
export const useSmartTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');
  const [adaptiveColors, setAdaptiveColors] = useState({});

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Analyze content for adaptive colors
  const analyzeContentColors = useCallback((element?: HTMLElement) => {
    if (!element) return;

    // Simple color analysis (can be enhanced with AI)
    const images = element.querySelectorAll('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (images.length > 0 && ctx) {
      // Extract dominant colors from first image
      const img = images[0] as HTMLImageElement;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Simplified color extraction logic
        setAdaptiveColors({
          primary: '#6366F1', // Fallback to default
          accent: '#8B5CF6',
        });
      } catch (error) {
        // Fallback colors
        setAdaptiveColors({
          primary: '#6366F1',
          accent: '#8B5CF6',
        });
      }
    }
  }, []);

  const currentTheme = theme === 'auto' ? systemTheme : theme;

  return {
    theme: currentTheme,
    setTheme,
    systemTheme,
    adaptiveColors,
    analyzeContentColors,
  };
};

export default {
  useAuraChat,
  useAuraCompletion,
  useAuraScroll,
  useMagneticMouse,
  useAuraInView,
  useParticleSystem,
  useGlassmorphism,
  useSmartTheme,
};