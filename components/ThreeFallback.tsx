import React from 'react';
import { motion } from 'framer-motion';

export default function ThreeFallback() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* CSS-only animated background as fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
      
      {/* Animated CSS shapes as fallback */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`fallback-circle-${i}`}
            className="absolute w-4 h-4 rounded-full gradient-bg opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}

        {/* Floating squares */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`fallback-square-${i}`}
            className="absolute w-6 h-6 gradient-bg opacity-10 rounded-lg"
            animate={{
              x: [0, -80, 0],
              y: [0, 120, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              right: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
          />
        ))}

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/5 to-primary/10 opacity-50" />
      </div>
    </div>
  );
}