import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const orbs = [
  {
    size: 800,
    style: { top: '-15%', left: '-10%' },
    color: 'rgba(13,27,76,0.45)',
    blur: 80,
    animate: { x: [0, 40, -20, 0], y: [0, -50, 30, 0] },
    duration: 22,
  },
  {
    size: 600,
    style: { top: '-10%', right: '-5%' },
    color: 'rgba(255,74,28,0.28)',
    blur: 90,
    animate: { x: [0, -50, 20, 0], y: [0, 40, -30, 0] },
    duration: 18,
  },
  {
    size: 700,
    style: { bottom: '-20%', right: '-10%' },
    color: 'rgba(13,27,76,0.38)',
    blur: 100,
    animate: { x: [0, 30, -40, 0], y: [0, 50, -20, 0] },
    duration: 26,
  },
  {
    size: 500,
    style: { bottom: '-5%', left: '-5%' },
    color: 'rgba(255,74,28,0.22)',
    blur: 70,
    animate: { x: [0, 60, -20, 0], y: [0, -40, 20, 0] },
    duration: 20,
  },
  {
    size: 650,
    style: { top: '30%', left: '25%' },
    color: 'rgba(13,27,76,0.20)',
    blur: 120,
    animate: { x: [0, -30, 40, 0], y: [0, 30, -40, 0] },
    duration: 30,
  },
];

export default function AnimatedBackground() {
  const cursorRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      }
      if (gridRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 18;
        const y = (e.clientY / window.innerHeight - 0.5) * 18;
        gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            ...orb.style,
          }}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop',
          }}
        />
      ))}

      {/* Grid overlay with parallax */}
      <div
        ref={gridRef}
        className="absolute inset-[-5%] transition-transform duration-75"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13,27,76,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,27,76,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Cursor glow */}
      <div
        ref={cursorRef}
        className="absolute hidden lg:block"
        style={{
          width: 400,
          height: 400,
          top: 0,
          left: 0,
          background: 'radial-gradient(circle, rgba(255,74,28,0.14) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'transform 0.12s ease-out',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}