import { useState } from 'react';
import { motion } from 'framer-motion';
import CursorProvider from '../components/Cursor/CursorProvider';
import GlassCard from '../components/ui/GlassCard';
import MotionInput from '../components/ui/MotionInput';
import MotionButton from '../components/ui/MotionButton';
import { tokens } from '../utils/tokens';
import { Send } from 'lucide-react';

/**
 * Form Demo Page
 * 
 * Demonstrates "Calm Clinical" personality:
 * - Reduced motion
 * - Focus-first micro-animations on inputs
 * - Keyboard nav smoothness
 * - Subtle form interactions
 */
export default function FormDemoPage() {
  return (
    <CursorProvider personality="calm-clinical">
      <FormDemoContent />
    </CursorProvider>
  );
}

function FormDemoContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Form
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience smooth, focus-first form interactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <GlassCard variant="medium" className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <MotionInput
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />

              <MotionInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />

              <div className="relative">
                <motion.label
                  className="absolute left-4 text-gray-500 dark:text-gray-400 pointer-events-none origin-left"
                  animate={{
                    y: formData.message ? -28 : 0,
                    scale: formData.message ? 0.85 : 1,
                    color: formData.message ? tokens.colors.teal.primary : undefined,
                  }}
                  transition={{
                    type: 'spring',
                    ...tokens.motion.spring.smooth,
                  }}
                  style={{
                    top: '1.5rem',
                    transform: 'translateY(-50%)',
                  }}
                >
                  Message
                </motion.label>
                <motion.textarea
                  value={formData.message}
                  onChange={handleChange('message')}
                  className="w-full px-4 pt-6 pb-2 min-h-[120px] bg-white/6 backdrop-blur-glass-light border-2 rounded-xl text-gray-900 dark:text-white focus:outline-none transition-colors duration-200 border-white/20 focus:border-teal-400 focus:shadow-teal-glow resize-none"
                  required
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionButton
                  type="submit"
                  variant="primary"
                  className="w-full text-lg py-4"
                >
                  Send Message
                  <Send className="inline ml-2 h-5 w-5" />
                </MotionButton>
              </motion.div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

