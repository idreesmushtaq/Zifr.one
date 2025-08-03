import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Code, Rocket, Zap, ArrowRight } from 'lucide-react';

const transformationStages = [
  {
    id: 0,
    icon: Lightbulb,
    title: "Ideas",
    description: "Starting from zero",
    color: "#666666",
    particles: 3
  },
  {
    id: 1,
    icon: Code,
    title: "Development",
    description: "Building the foundation",
    color: "#00a9c0",
    particles: 6
  },
  {
    id: 2,
    icon: Zap,
    title: "Innovation",
    description: "Transforming concepts",
    color: "#6fce44",
    particles: 9
  },
  {
    id: 3,
    icon: Rocket,
    title: "Reality",
    description: "Driven by one vision",
    color: "#FFC107",
    particles: 12
  }
];

function FloatingParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      initial={{ 
        x: Math.random() * 300 - 150,
        y: Math.random() * 200 - 100,
        opacity: 0,
        scale: 0
      }}
      animate={{
        x: Math.random() * 400 - 200,
        y: Math.random() * 300 - 150,
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

function NumberTransition({ stage }: { stage: number }) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <motion.div
        key={`number-${stage}`}
        className="text-8xl font-bold"
        style={{ color: transformationStages[stage].color }}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {stage === 0 ? "0" : "1"}
      </motion.div>
      
      {stage > 0 && stage < 3 && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ArrowRight 
            className="w-12 h-12" 
            style={{ color: transformationStages[stage].color }}
          />
        </motion.div>
      )}
    </div>
  );
}

export default function ZeroToOneAnimation() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % transformationStages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = transformationStages[currentStage];

  return (
    <div className="relative h-96 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-muted/30 to-primary/5 rounded-lg">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: current.particles }).map((_, i) => (
          <FloatingParticle 
            key={`${currentStage}-${i}`}
            delay={i * 0.2}
            color={current.color}
          />
        ))}
      </div>

      {/* Central Animation */}
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          <NumberTransition key={currentStage} stage={currentStage} />
        </AnimatePresence>

        {/* Icon and Text */}
        <motion.div
          key={`content-${currentStage}`}
          className="flex flex-col items-center space-y-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: current.color }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            animate={{ 
              boxShadow: [
                `0 0 20px ${current.color}30`,
                `0 0 40px ${current.color}50`,
                `0 0 20px ${current.color}30`
              ]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <current.icon className="w-10 h-10 text-white" />
          </motion.div>

          <div>
            <motion.h3 
              className="text-2xl text-foreground mb-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              {current.title}
            </motion.h3>
            <motion.p 
              className="text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              {current.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Progress Indicators */}
        <motion.div 
          className="flex space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          {transformationStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              className="w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: index === currentStage ? stage.color : 'transparent',
                borderColor: stage.color
              }}
              animate={{
                scale: index === currentStage ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          background: [
            `radial-gradient(circle at center, ${current.color}10 0%, transparent 70%)`,
            `radial-gradient(circle at center, ${current.color}20 0%, transparent 70%)`,
            `radial-gradient(circle at center, ${current.color}10 0%, transparent 70%)`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Corner Text */}
      <div className="absolute bottom-4 right-4 text-right">
        <motion.p 
          className="text-sm text-muted-foreground italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Built on Zero. Driven by One.
        </motion.p>
      </div>
    </div>
  );
}