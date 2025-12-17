import { motion } from 'framer-motion';
import CursorProvider from '../components/Cursor/CursorProvider';
import Magnet from '../components/Magnet/Magnet';
import GlassCard from '../components/ui/GlassCard';
import { tokens } from '../utils/tokens';
import { Users, TrendingUp, Activity, Award } from 'lucide-react';

/**
 * Dashboard Page Demo
 * 
 * Demonstrates "Calm Clinical" personality:
 * - Minimal motion
 * - Tiny hover lifts
 * - Magnet on metric cards
 * - Subtle entrance transitions for charts
 */
export default function DashboardPage() {
  return (
    <CursorProvider personality="calm-clinical">
      <DashboardContent />
    </CursorProvider>
  );
}

function DashboardContent() {
  const metrics = [
    { label: 'Total Patients', value: '2,847', icon: Users, color: 'teal' },
    { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'green' },
    { label: 'Active Cases', value: '342', icon: Activity, color: 'blue' },
    { label: 'Success Rate', value: '98.2%', icon: Award, color: 'purple' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        ...tokens.motion.spring.gentle,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your medical practice
          </p>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Magnet strength={0.18} radius={120} clamp={6}>
                  <GlassCard hover variant="soft" className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                        <Icon className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {metric.label}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                  </GlassCard>
                </Magnet>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <GlassCard variant="medium" className="h-96">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Patient Statistics
            </h2>
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>Chart visualization would appear here</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

