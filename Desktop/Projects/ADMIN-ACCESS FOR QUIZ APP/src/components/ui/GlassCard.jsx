import { motion } from 'framer-motion';
import { tokens } from '../../utils/tokens';

/**
 * GlassCard Component
 * 
 * Glassmorphism card with backdrop blur, subtle border, and soft shadow.
 * Premium medical aesthetic with white-first design.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover lift effect
 * @param {string} props.variant - Visual variant ('soft' | 'medium' | 'glow')
 * @param {Object} props.motionProps - Framer Motion props for animations
 * 
 * @example
 * <GlassCard hover variant="glow">
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </GlassCard>
 */
export default function GlassCard({ 
  children, 
  className = '',
  hover = true,
  variant = 'soft',
  motionProps = {},
  ...props
}) {
  const variantStyles = {
    soft: {
      bg: 'bg-white/6',
      border: 'border-white/20',
      shadow: 'shadow-glass-soft',
      blur: 'backdrop-blur-glass-light',
    },
    medium: {
      bg: 'bg-white/8',
      border: 'border-white/25',
      shadow: 'shadow-glass-medium',
      blur: 'backdrop-blur-glass-medium',
    },
    glow: {
      bg: 'bg-white/10',
      border: 'border-teal-400/30',
      shadow: 'shadow-glass-glow',
      blur: 'backdrop-blur-glass-medium',
    },
  };

  const styles = variantStyles[variant] || variantStyles.soft;

  const hoverVariants = hover ? {
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  } : {};

  return (
    <motion.div
      className={`
        ${styles.bg}
        ${styles.border}
        ${styles.shadow}
        ${styles.blur}
        border rounded-2xl p-6
        transition-colors duration-300
        ${className}
      `}
      variants={hoverVariants}
      whileHover={hover ? 'hover' : undefined}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
