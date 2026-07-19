import React from 'react';

/**
 * ZasDevLabs Logo Placeholder
 * Replace the SVG/markup below with the real logo when finalized.
 */
export default function Logo({ size = 32 }) {
  const radius = Math.round(size * 0.28);
  const fontSize = Math.round(size * 0.5);

  return (
    <div
      data-testid="brand-logo"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'linear-gradient(135deg, #004A77 0%, #005234 100%)',
        border: '1.5px solid rgba(168, 199, 250, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 12px rgba(168,199,250,0.15)',
      }}
      title="ZasDevLabs — Logo Placeholder"
    >
      <span
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800,
          fontSize,
          color: '#A8C7FA',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}
      >
        Z
      </span>
    </div>
  );
}
