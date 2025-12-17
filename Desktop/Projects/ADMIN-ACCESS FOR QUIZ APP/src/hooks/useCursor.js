import { useContext } from 'react';
import { CursorContext } from '../components/Cursor/CursorProvider';

/**
 * useCursor Hook
 * 
 * Provides access to cursor state and controls
 * 
 * @returns {Object} Cursor context with:
 *   - enabled: boolean - Whether cursor is enabled
 *   - setEnabled: function - Toggle cursor on/off
 *   - setCursorType: function - Change cursor type ('default' | 'hover' | 'click')
 *   - position: {x, y} - Current cursor position
 *   - targetPosition: {x, y} - Physics-based target position
 * 
 * @example
 * const { setCursorType, enabled } = useCursor();
 * 
 * // On hover
 * onMouseEnter={() => setCursorType('hover')}
 * onMouseLeave={() => setCursorType('default')}
 */
export default function useCursor() {
  const context = useContext(CursorContext);
  
  if (!context) {
    // Fallback for components outside CursorProvider
    return {
      enabled: false,
      setEnabled: () => {},
      setCursorType: () => {},
      position: { x: 0, y: 0 },
      targetPosition: { x: 0, y: 0 },
    };
  }
  
  return context;
}
