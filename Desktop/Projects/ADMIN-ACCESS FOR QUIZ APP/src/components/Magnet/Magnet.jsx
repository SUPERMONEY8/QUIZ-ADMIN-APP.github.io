import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useCursor from '../../hooks/useCursor';
import { tokens } from '../../utils/tokens';

/**
 * Magnet Component
 * 
 * Creates a magnetic attraction effect between the cursor and the element.
 * Both the cursor target and the element move slightly when hovering.
 * 
 * @param {Object} props
 * @param {number} props.strength - Pull strength (0.1-0.4, default: 0.22)
 * @param {number} props.radius - Attraction radius in px (80-200, default: 140)
 * @param {number} props.clamp - Max element movement in px (5-20, default: 12)
 * @param {React.ReactNode} props.children - Child element(s) to apply magnet effect to
 * @param {string} props.className - Additional CSS classes
 * 
 * @example
 * <Magnet strength={0.25} radius={160}>
 *   <button>Hover me</button>
 * </Magnet>
 */
export default function Magnet({ 
  children, 
  strength = tokens.motion.magnet.defaultStrength,
  radius = tokens.motion.magnet.defaultRadius,
  clamp = tokens.motion.magnet.elementShiftClamp,
  className = '',
}) {
  const elementRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { enabled, setCursorType, targetPosition } = useCursor();

  // Motion values for smooth spring animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for element movement
  const springConfig = tokens.motion.magnet.spring;
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  /**
   * Calculate magnet effect
   * Vector math: compute direction from element center to cursor,
   * normalize, scale by strength, clamp by radius
   */
  const updateMagnet = useCallback(() => {
    if (!enabled || !isHovered || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const elementCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Vector from element center to cursor target
    const dx = targetPosition.x - elementCenter.x;
    const dy = targetPosition.y - elementCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only apply magnet effect within radius
    if (distance < radius) {
      // Normalize vector and scale by strength
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;
      
      // Calculate pull strength (stronger when closer)
      const proximityFactor = 1 - (distance / radius);
      const pullStrength = strength * proximityFactor;

      // Apply to element (reverse direction, clamped)
      const elementShiftX = Math.max(-clamp, Math.min(clamp, normalizedX * pullStrength * clamp));
      const elementShiftY = Math.max(-clamp, Math.min(clamp, normalizedY * pullStrength * clamp));

      x.set(elementShiftX);
      y.set(elementShiftY);
    } else {
      // Reset when outside radius
      x.set(0);
      y.set(0);
    }
  }, [enabled, isHovered, targetPosition, strength, radius, clamp, x, y]);

  // Update magnet effect on hover and cursor movement
  useEffect(() => {
    if (!enabled || !isHovered) {
      x.set(0);
      y.set(0);
      return;
    }

    const rafId = requestAnimationFrame(function loop() {
      updateMagnet();
      requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(rafId);
  }, [enabled, isHovered, updateMagnet, x, y]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorType('hover');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorType('default');
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{
        type: 'spring',
        ...springConfig,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnet HOC (Higher Order Component)
 * 
 * Wraps any component with magnet effect
 * 
 * @param {React.Component} Component - Component to wrap
 * @param {Object} defaultProps - Default magnet props
 * @returns {React.Component} Wrapped component with magnet effect
 * 
 * @example
 * const MagnetButton = withMagnet(Button, { strength: 0.25 });
 */
export function withMagnet(Component, defaultProps = {}) {
  return function MagnetWrapper(props) {
    return (
      <Magnet {...defaultProps}>
        <Component {...props} />
      </Magnet>
    );
  };
}
