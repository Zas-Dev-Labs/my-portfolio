import React from 'react';

/**
 * ZasDevLabs Logo
 * Uses the official ZasDevLabs logo image.
 */
export default function Logo({ size = 32 }) {
  return (
    <img
      src="/logo.jpg"
      alt="ZasDevLabs Logo"
      data-testid="brand-logo"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}
