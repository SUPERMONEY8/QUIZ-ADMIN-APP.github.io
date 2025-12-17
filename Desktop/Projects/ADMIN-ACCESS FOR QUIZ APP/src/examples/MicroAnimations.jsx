/**
 * Micro-Animations Examples
 * 
 * 5 ready-to-use micro-animation snippets for common UI interactions
 * Copy and paste these into your components
 */

import { motion } from 'framer-motion';
import { tokens } from '../utils/tokens';

// ============================================
// 1. Button Hover & Tap
// ============================================
export function ButtonHoverExample() {
  return (
    <motion.button
      className="px-6 py-3 bg-teal-500 text-white rounded-xl font-medium"
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 0 20px ${tokens.colors.teal.glow}`,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      Hover Me
    </motion.button>
  );
}

// ============================================
// 2. Input Focus Animation
// ============================================
export function InputFocusExample() {
  return (
    <div className="relative">
      <motion.label
        className="absolute left-4 text-gray-500 pointer-events-none"
        animate={{
          y: -28,
          scale: 0.85,
          color: tokens.colors.teal.primary,
        }}
        transition={{
          type: 'spring',
          ...tokens.motion.spring.smooth,
        }}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        Email
      </motion.label>
      <motion.input
        type="email"
        className="w-full px-4 pt-6 pb-2 bg-white/6 border-2 border-teal-400 rounded-xl"
        animate={{
          boxShadow: `0 0 0 4px ${tokens.colors.teal.glow}`,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />
    </div>
  );
}

// ============================================
// 3. Card Lift on Hover
// ============================================
export function CardLiftExample() {
  return (
    <motion.div
      className="bg-white/6 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: tokens.glass.shadow.medium,
      }}
      transition={{
        type: 'spring',
        ...tokens.motion.spring.smooth,
      }}
    >
      <h3 className="text-xl font-bold mb-2">Card Title</h3>
      <p className="text-gray-600">Hover to lift</p>
    </motion.div>
  );
}

// ============================================
// 4. List Item Staggered Entrance
// ============================================
export function ListItemEntranceExample() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        ...tokens.motion.spring.snappy,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl p-4"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// 5. Modal Scale-In from Click Position
// ============================================
export function ModalScaleInExample({ isOpen, onClose, clickPosition }) {
  const initialX = clickPosition?.x - window.innerWidth / 2 || 0;
  const initialY = clickPosition?.y - window.innerHeight / 2 || 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full"
          initial={{
            opacity: 0,
            scale: 0.8,
            x: initialX,
            y: initialY,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
          }}
          transition={{
            type: 'spring',
            ...tokens.motion.spring.smooth,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
          <p className="text-gray-600 mb-6">Modal content goes here</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-500 text-white rounded-xl"
          >
            Close
          </button>
        </motion.div>
      </div>
    </>
  );
}

