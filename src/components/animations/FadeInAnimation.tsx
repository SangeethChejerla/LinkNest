import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const FadeInAnimation = ({
  children,
  delay = 0,
  direction = 'up',
}: FadeInAnimationProps) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: -20 },
    right: { x: 20 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};
