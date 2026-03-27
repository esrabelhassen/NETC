import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Theme base (navy night sky) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#12214a_0%,#0b1634_45%,#070f24_100%)]" />

      {/* Aurora Stripe Layer 1 */}
      <motion.div
        className="absolute -top-[20%] -left-[25%] w-[150%] h-[140%] blur-2xl mix-blend-screen"
        style={{
          background:
            `repeating-linear-gradient(
              102deg,
              rgba(255,74,28,0.00) 0%,
              rgba(255,74,28,0.22) 6%,
              rgba(110,220,255,0.26) 12%,
              rgba(170,130,255,0.20) 18%,
              rgba(255,74,28,0.00) 24%
            )`,
          maskImage:
            'radial-gradient(ellipse 75% 60% at 50% 45%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 60% at 50% 45%, black 35%, transparent 100%)',
        }}
        animate={{
          x: [0, 40, -25, 0],
          y: [0, -18, 24, 0],
          backgroundPosition: ['0% 0%', '120% 0%', '0% 0%'],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Stripe Layer 2 */}
      <motion.div
        className="absolute -top-[30%] -right-[20%] w-[150%] h-[150%] blur-xl mix-blend-screen"
        style={{
          background:
            `repeating-linear-gradient(
              100deg,
              rgba(255,74,28,0.00) 0%,
              rgba(70, 158, 199, 0.51) 6%,
              rgba(255, 60, 11, 0.71) 12%,
              rgba(140, 255, 220, 0.54) 18%,
              rgba(255,74,28,0.00) 24%
            )`,
          maskImage:
            'radial-gradient(ellipse 70% 58% at 55% 40%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 58% at 55% 40%, black 35%, transparent 100%)',
        }}
        animate={{
          x: [0, 145, -90, 0],
          y: [0, -30, 45, 0],
          backgroundPosition: ['0% 0%', '220% 0%', '0% 0%'],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora glow wash */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 25% 30%, rgba(255,74,28,0.14), transparent 30%), radial-gradient(circle at 70% 25%, rgba(120,210,255,0.14), transparent 34%), radial-gradient(circle at 50% 55%, rgba(175,130,255,0.10), transparent 38%)',
        }}
        animate={{ opacity: [0.45, 0.75, 0.55, 0.45] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.30)_100%)]" />
    </div>
  );
}