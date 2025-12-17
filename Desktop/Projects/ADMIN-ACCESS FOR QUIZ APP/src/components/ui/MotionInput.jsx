import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../utils/tokens';

/**
 * MotionInput Component
 * 
 * Animated input with focus-first micro-animations:
 * - Label lift on focus
 * - Glow effect on focus
 * - Smooth transitions
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (default: 'text')
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 * 
 * @example
 * <MotionInput
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 */
export default function MotionInput({
  label,
  type = 'text',
  value,
  onChange,
  className = '',
  motionProps = {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasValue(value && value.length > 0);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) onChange(e);
  };

  const isActive = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <motion.label
        className="absolute left-4 text-gray-500 dark:text-gray-400 pointer-events-none origin-left"
        animate={{
          y: isActive ? -28 : 0,
          scale: isActive ? 0.85 : 1,
          color: isActive ? tokens.colors.teal.primary : undefined,
        }}
        transition={{
          type: 'spring',
          ...tokens.motion.spring.smooth,
        }}
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {label}
      </motion.label>

      <motion.input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          w-full px-4 pt-6 pb-2
          bg-white/6 backdrop-blur-glass-light
          border-2 rounded-xl
          text-gray-900 dark:text-white
          focus:outline-none
          transition-colors duration-200
          ${isFocused 
            ? 'border-teal-400 shadow-teal-glow' 
            : 'border-white/20'
          }
        `}
        animate={{
          boxShadow: isFocused 
            ? `0 0 0 4px ${tokens.colors.teal.glow}` 
            : '0 0 0 0px transparent',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        {...motionProps}
        {...props}
      />

      {/* Focus glow effect */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `0 0 20px ${tokens.colors.teal.glow}`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
