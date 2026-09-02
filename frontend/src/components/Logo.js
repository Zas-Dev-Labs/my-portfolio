import React, { useState } from 'react';

/**
 * ZasDevLabs Logo
 * Uses the official ZasDevLabs logo image with resilient fallback.
 */
export default function Logo({ size = 32 }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        data-testid="brand-logo"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
        }}
        className="bg-gradient-to-br from-[#00BFFF] to-[#32CD32] flex items-center justify-center font-heading font-black text-black select-none shrink-0 shadow-sm"
      >
        <span style={{ fontSize: Math.max(10, Math.round(size * 0.55)), lineHeight: 1 }}>Z</span>
      </div>
    );
  }

  return (
    <img
      src="/logo.jpg"
      alt="ZasDevLabs Logo"
      data-testid="brand-logo"
      onError={() => setImgError(true)}
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
