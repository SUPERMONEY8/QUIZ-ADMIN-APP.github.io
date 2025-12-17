import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../utils/tokens';

/**
 * CursorContext
 * Provides cursor state and controls to child components
 */
export const CursorContext = createContext(null);

/**
 * CursorProvider Component
 * 
 * Manages the custom cursor system with physics-based floating target.
 * Provides cursor state and controls via context.
 * 
 * @param {Object} props
 * @param {boolean} props.enabled - Whether cursor is enabled (default: true)
 * @param {string} props.personality - Motion personality preset ('calm-clinical' | 'premium-concierge' | 'energetic-assist')
 * @param {Object} props.config - Override cursor config (damping, mass, haloSize)
 * @param {React.ReactNode} props.children - Child components
 * 
 * @example
 * <CursorProvider enabled={true} personality="premium-concierge">
 *   <App />
 * </CursorProvider>
 */
export default function CursorProvider({ 
  children, 
  enabled: initialEnabled = true,
  personality = 'premium-concierge',
  config = {}
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'hover' | 'click'
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  
  const rafId = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  
  // Get personality config or use defaults
  const personalityConfig = tokens.personalities[personality] || tokens.personalities['premium-concierge'];
  const cursorConfig = {
    damping: config.damping ?? personalityConfig.cursor.damping ?? tokens.motion.cursor.damping,
    mass: config.mass ?? personalityConfig.cursor.mass ?? tokens.motion.cursor.mass,
    haloSize: config.haloSize ?? personalityConfig.cursor.haloSize ?? tokens.motion.cursor.halo.base,
  };

  /**
   * Physics-based cursor smoothing using critical-damped spring
   * Formula: acceleration = (target - position) * stiffness - velocity * damping
   * Using exponential smoothing for performance
   */
  const updateCursor = useCallback(() => {
    if (!enabled) return;

    const { x: px, y: py } = pointerRef.current;
    const { x: tx, y: ty } = targetRef.current;
    const { x: vx, y: vy } = velocityRef.current;

    // Calculate distance to target
    const dx = px - tx;
    const dy = py - ty;

    // Critical-damped spring physics
    // Stiffness derived from damping and mass for critical damping
    const stiffness = (cursorConfig.damping * 2) ** 2 / (4 * cursorConfig.mass);
    
    // Calculate acceleration
    const ax = (dx * stiffness - vx * cursorConfig.damping) / cursorConfig.mass;
    const ay = (dy * stiffness - vy * cursorConfig.damping) / cursorConfig.mass;

    // Update velocity
    velocityRef.current.x += ax * 0.016; // ~60fps
    velocityRef.current.y += ay * 0.016;

    // Update position
    targetRef.current.x += velocityRef.current.x * 0.016;
    targetRef.current.y += velocityRef.current.y * 0.016;

    // Update state (throttled for performance - only update every frame)
    setTargetPosition({ x: targetRef.current.x, y: targetRef.current.y });
    setPosition({ x: px, y: py });
  }, [enabled, cursorConfig]);

  // Handle pointer movement
  useEffect(() => {
    if (!enabled) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      return;
    }

    const handlePointerMove = (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };

    // Use passive listener for better performance
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    
    // Start animation loop
    const loop = () => {
      updateCursor();
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [enabled, updateCursor]);

  // Initialize target position
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      pointerRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }, [enabled]);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setEnabled(false);
    }
  }, []);

  // Check for touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setEnabled(false);
    }
  }, []);

  const contextValue = {
    enabled,
    setEnabled,
    cursorType,
    setCursorType,
    position,
    targetPosition,
    config: cursorConfig,
  };

  return (
    <CursorContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {enabled && (
          <CursorVisual 
            position={targetPosition}
            cursorType={cursorType}
            haloSize={cursorConfig.haloSize}
          />
        )}
      </AnimatePresence>
    </CursorContext.Provider>
  );
}

/**
 * CursorVisual Component
 * Renders the two-layer cursor (pointer + halo)
 */
function CursorVisual({ position, cursorType, haloSize }) {
  const isHover = cursorType === 'hover';
  const isClick = cursorType === 'click';

  // Halo variants for different states
  const haloVariants = {
    default: {
      scale: 1,
      opacity: 0.4,
      borderWidth: 1,
    },
    hover: {
      scale: 1.3,
      opacity: 0.6,
      borderWidth: 2,
    },
    click: {
      scale: 0.9,
      opacity: 0.8,
      borderWidth: 2,
    },
  };

  // Pointer variants
  const pointerVariants = {
    default: {
      scale: 1,
      opacity: 1,
    },
    hover: {
      scale: 1.2,
      opacity: 1,
    },
    click: {
      scale: 0.8,
      opacity: 1,
    },
  };

  return (
    <>
      {/* Halo / Target Layer */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          x: '-50%',
          y: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute rounded-full border-2 border-teal-400"
          style={{
            width: haloSize,
            height: haloSize,
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%',
          }}
          variants={haloVariants}
          animate={cursorType}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
        {/* Subtle pulse animation */}
        <motion.div
          className="absolute rounded-full border border-teal-300/50"
          style={{
            width: haloSize,
            height: haloSize,
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: [1, tokens.motion.cursor.halo.pulse.scale, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: tokens.motion.cursor.halo.pulse.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Precise Pointer Layer */}
      <motion.div
        className="fixed pointer-events-none z-[10000] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          x: '-50%',
          y: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-teal-400"
          variants={pointerVariants}
          animate={cursorType}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        />
      </motion.div>
    </>
  );
}
