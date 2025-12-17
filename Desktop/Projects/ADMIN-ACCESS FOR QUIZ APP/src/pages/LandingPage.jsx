import { motion } from 'framer-motion';
import useCursor from '../hooks/useCursor';
import CursorProvider from '../components/Cursor/CursorProvider';
import Magnet from '../components/Magnet/Magnet';
import GlassCard from '../components/ui/GlassCard';
import MotionButton from '../components/ui/MotionButton';
import { tokens } from '../utils/tokens';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Landing Page Demo
 * 
 * Demonstrates "Premium Concierge" personality:
 * - Pronounced parallax effects
 * - Slow orbiting background particles
 * - Larger cursor halo with slower damping
 * - Hero section with magnetic interactions
 */
export default function LandingPage() {
  return (
    <CursorProvider personality="premium-concierge">
      <LandingContent />
    </CursorProvider>
  );
}

function LandingContent() {
  const { setCursorType } = useCursor();

  // Stagger animation for hero elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        ...tokens.motion.spring.smooth,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Particles */}
      <ParticleBackground />

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              onMouseEnter={() => setCursorType('hover')}
              onMouseLeave={() => setCursorType('default')}
            >
              Medical
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
                Excellence
              </span>
            </motion.h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Premium healthcare solutions with precision, care, and innovation.
            Experience the future of medical technology.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Magnet strength={0.28} radius={140}>
              <MotionButton variant="primary" className="text-lg px-8 py-4">
                Get Started
                <ArrowRight className="inline ml-2 h-5 w-5" />
              </MotionButton>
            </Magnet>
            <Magnet strength={0.25} radius={120}>
              <MotionButton variant="secondary" className="text-lg px-8 py-4">
                Learn More
              </MotionButton>
            </Magnet>
          </motion.div>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {[
            { title: 'Precision Care', desc: 'Advanced medical technology' },
            { title: 'Expert Team', desc: 'World-class healthcare professionals' },
            { title: 'Innovation', desc: 'Cutting-edge treatment methods' },
          ].map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Magnet strength={0.22} radius={140}>
                <GlassCard hover variant="glow" className="h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </GlassCard>
              </Magnet>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Particle Background Component
 * Slow orbiting particles for premium feel
 */
function ParticleBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-teal-400/20"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8 + (i % 3) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

