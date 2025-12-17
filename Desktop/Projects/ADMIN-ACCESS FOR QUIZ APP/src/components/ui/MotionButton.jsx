import { motion } from 'framer-motion';
import { tokens } from '../../utils/tokens';
import Magnet from '../Magnet/Magnet';

/**
 * MotionButton Component
 * 
 * Animated button with glassmorphism, magnet effect, and premium interactions.
 * Includes focus states, hover animations, and press feedback.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style ('primary' | 'secondary' | 'ghost')
 * @param {boolean} props.magnet - Enable magnet effect (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {Object} props.motionProps - Framer Motion props
 * 
 * @example
 * <MotionButton variant="primary" onClick={handleClick}>
 *   Click Me
 * </MotionButton>
 */
export default function MotionButton({
  children,
  variant = 'primary',
  magnet = true,
  className = '',
  onClick,
  motionProps = {},
  ...props
}) {
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-teal-500 to-teal-600
      text-white
      shadow-teal-glow
      hover:from-teal-400 hover:to-teal-500
    `,
    secondary: `
      bg-white/10 backdrop-blur-glass-light
      border border-white/20
      text-teal-600 dark:text-teal-400
      hover:bg-white/15
    `,
    ghost: `
      bg-transparent
      text-teal-600 dark:text-teal-400
      hover:bg-white/5
    `,
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: 'spring',
        ...tokens.motion.spring.smooth,
      },
    },
    tap: { 
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const ButtonContent = (
    <motion.button
      className={`
        ${variantStyles[variant]}
        px-6 py-3 rounded-xl
        font-medium
        focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
        transition-colors duration-200
        ${className}
      `}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );

  if (magnet) {
    return (
      <Magnet strength={0.25} radius={120} clamp={8}>
        {ButtonContent}
      </Magnet>
    );
  }

  return ButtonContent;
}
