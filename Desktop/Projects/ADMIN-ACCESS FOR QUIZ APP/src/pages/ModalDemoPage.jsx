import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorProvider from '../components/Cursor/CursorProvider';
import GlassCard from '../components/ui/GlassCard';
import MotionButton from '../components/ui/MotionButton';
import { tokens } from '../utils/tokens';
import { X, AlertCircle } from 'lucide-react';

/**
 * Modal Demo Page
 * 
 * Demonstrates "Premium Concierge" personality:
 * - Focus-lock animations
 * - Dim background with glass blur transform
 * - Animated scale-in from cursor position
 */
export default function ModalDemoPage() {
  return (
    <CursorProvider personality="premium-concierge">
      <ModalDemoContent />
    </CursorProvider>
  );
}

function ModalDemoContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const openModal = (e) => {
    if (e) {
      setClickPosition({ x: e.clientX, y: e.clientY });
    } else {
      setClickPosition({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Modal Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Experience premium modal interactions with glassmorphism
          </p>

          <MotionButton
            variant="primary"
            onClick={openModal}
            className="text-lg px-8 py-4"
          >
            Open Modal
          </MotionButton>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {isOpen && (
            <Modal
              isOpen={isOpen}
              onClose={closeModal}
              clickPosition={clickPosition}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Modal Component
 * Animated modal with glass blur background
 */
function Modal({ isOpen, onClose, clickPosition }) {
  // Calculate initial position from click
  const initialX = clickPosition.x - window.innerWidth / 2;
  const initialY = clickPosition.y - window.innerHeight / 2;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          className="pointer-events-auto max-w-md w-full"
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
            transition: { duration: 0.2 },
          }}
          transition={{
            type: 'spring',
            ...tokens.motion.spring.smooth,
          }}
        >
          <GlassCard variant="glow" className="p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Confirm Action
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to proceed with this action?
              </p>
            </div>

            <div className="flex gap-4">
              <MotionButton
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                magnet={false}
              >
                Cancel
              </MotionButton>
              <MotionButton
                variant="primary"
                onClick={onClose}
                className="flex-1"
                magnet={false}
              >
                Confirm
              </MotionButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}

