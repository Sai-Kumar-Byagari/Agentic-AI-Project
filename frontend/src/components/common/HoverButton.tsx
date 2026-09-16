import React, { useState } from 'react';
import type { CSSProperties } from 'react';

interface HoverButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  baseStyle: CSSProperties;
  hoverStyle?: CSSProperties;
}

/**
 * Button that merges a hover style patch on pointer-enter — the React
 * equivalent of the reference's `style-hover` attribute. Keeps the many
 * hover transitions in the console faithful without repeating enter/leave
 * handlers at every call site.
 */
export const HoverButton: React.FC<HoverButtonProps> = ({
  baseStyle,
  hoverStyle,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      {...rest}
      style={hover && hoverStyle ? { ...baseStyle, ...hoverStyle } : baseStyle}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
};
