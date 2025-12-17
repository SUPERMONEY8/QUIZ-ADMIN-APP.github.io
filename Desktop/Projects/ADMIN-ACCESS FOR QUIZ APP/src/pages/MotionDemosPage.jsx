import { Link } from 'react-router-dom';
import CursorProvider from '../components/Cursor/CursorProvider';
import Magnet from '../components/Magnet/Magnet';
import GlassCard from '../components/ui/GlassCard';
import MotionButton from '../components/ui/MotionButton';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Motion Demos Index Page
 * 
 * Navigation page to access all demo pages
 */
export default function MotionDemosPage() {
  return (
    <CursorProvider personality="premium-concierge">
      <MotionDemosContent />
    </CursorProvider>
  );
}

function MotionDemosContent() {
  const demos = [
    { 
      title: 'Landing Page', 
      path: '/demo/landing',
      description: 'Premium Concierge - Hero section with parallax and particles',
      icon: Sparkles,
    },
    { 
      title: 'Dashboard', 
      path: '/demo/dashboard',
      description: 'Calm Clinical - Minimal motion, metric cards',
      icon: Sparkles,
    },
    { 
      title: 'Form Demo', 
      path: '/demo/form',
      description: 'Calm Clinical - Focus-first input animations',
      icon: Sparkles,
    },
    { 
      title: 'List Demo', 
      path: '/demo/list',
      description: 'Energetic Assist - Staggered list animations',
      icon: Sparkles,
    },
    { 
      title: 'Modal Demo', 
      path: '/demo/modal',
      description: 'Premium Concierge - Scale-in from click position',
      icon: Sparkles,
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 25,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Motion Design System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore premium cursor system, magnet effects, and glassmorphism UI
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {demos.map((demo, idx) => {
            const Icon = demo.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Magnet strength={0.25} radius={140}>
                  <Link to={demo.path}>
                    <GlassCard hover variant="glow" className="h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {demo.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {demo.description}
                      </p>
                      <div className="flex items-center text-teal-600 dark:text-teal-400 font-medium">
                        View Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </GlassCard>
                  </Link>
                </Magnet>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

