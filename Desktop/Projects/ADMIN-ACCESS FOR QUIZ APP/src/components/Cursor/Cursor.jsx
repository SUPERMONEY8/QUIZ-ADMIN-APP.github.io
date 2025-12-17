import { motion } from 'framer-motion';
import { useCursorContext } from './CursorProvider';

/**
 * Cursor Component
 * Renders the custom cursor with pointer and halo
 */
export default function Cursor({ x, y, targetX, targetY, isHovering, haloSize }) {
  const { personality } = useCursorContext();

  return (
    <>
      {/* Small precise pointer */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: targetX,
          top: targetY,
          x: -4,
          y: -4,
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>

      {/* Floating halo/target */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: targetX,
          top: targetY,
          x: -haloSize / 2,
          y: -haloSize / 2,
        }}
        animate={{
          width: haloSize,
          height: haloSize,
          opacity: isHovering ? 0.6 : 0.3,
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 25,
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-teal-400/50 bg-teal-400/10 backdrop-blur-sm" />
      </motion.div>
    </>
  );
}

