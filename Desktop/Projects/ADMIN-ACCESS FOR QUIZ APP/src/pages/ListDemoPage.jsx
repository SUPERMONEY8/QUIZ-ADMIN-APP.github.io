import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorProvider from '../components/Cursor/CursorProvider';
import Magnet from '../components/Magnet/Magnet';
import GlassCard from '../components/ui/GlassCard';
import MotionInput from '../components/ui/MotionInput';
import { tokens } from '../utils/tokens';
import { Search, User, Mail, Calendar } from 'lucide-react';

/**
 * List Demo Page
 * 
 * Demonstrates "Energetic Assist" personality:
 * - Magnet on list items
 * - Subtle staggered entrance when data loads
 * - Quick, responsive interactions
 */
export default function ListDemoPage() {
  return (
    <CursorProvider personality="energetic-assist">
      <ListDemoContent />
    </CursorProvider>
  );
}

function ListDemoContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([
        { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.j@medical.com', date: '2024-01-15' },
        { id: 2, name: 'Dr. Michael Chen', email: 'michael.c@medical.com', date: '2024-01-14' },
        { id: 3, name: 'Dr. Emily Rodriguez', email: 'emily.r@medical.com', date: '2024-01-13' },
        { id: 4, name: 'Dr. James Wilson', email: 'james.w@medical.com', date: '2024-01-12' },
        { id: 5, name: 'Dr. Lisa Anderson', email: 'lisa.a@medical.com', date: '2024-01-11' },
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        ...tokens.motion.spring.snappy,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Medical Staff Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and browse medical professionals
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <MotionInput
              label="Search by name or email"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </motion.div>

        {/* List Items */}
        {loading ? (
          <GlassCard variant="soft" className="p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full" />
            </motion.div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </GlassCard>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                >
                  <Magnet strength={0.28} radius={140} clamp={8}>
                    <GlassCard hover variant="soft" className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {item.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Magnet>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <GlassCard variant="soft" className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No results found</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

