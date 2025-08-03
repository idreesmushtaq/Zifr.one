import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { 
  Palette, 
  Smartphone, 
  Users, 
  Eye, 
  MousePointer, 
  Layout,
  Layers,
  Zap
} from 'lucide-react';

const designServices = [
  {
    icon: Palette,
    title: "Visual Design",
    description: "Beautiful, modern interfaces that captivate users and reflect your brand identity",
    color: "#00a9c0",
    features: ["Brand Identity", "Color Psychology", "Typography", "Visual Hierarchy"]
  },
  {
    icon: Users,
    title: "User Experience",
    description: "Research-driven UX design that creates intuitive and delightful user journeys",
    color: "#6fce44",
    features: ["User Research", "Journey Mapping", "Wireframing", "Usability Testing"]
  },
  {
    icon: Smartphone,
    title: "Mobile Design",
    description: "Responsive designs optimized for all devices and screen sizes",
    color: "#FFC107",
    features: ["Responsive Design", "Mobile-First", "Touch Interactions", "App Design"]
  },
  {
    icon: Eye,
    title: "Prototyping",
    description: "Interactive prototypes that bring your ideas to life before development",
    color: "#F44336",
    features: ["Interactive Prototypes", "Figma", "User Testing", "Design Systems"]
  },
];

const designTools = [
  { name: "Figma", color: "#F24E1E" },
  { name: "Adobe XD", color: "#FF61F6" },
  { name: "Sketch", color: "#F7B500" },
  { name: "Principle", color: "#5C2E91" },
  { name: "InVision", color: "#FF3366" },
  { name: "Framer", color: "#0055FF" },
];

function DesignCard({ service, index }: { service: typeof designServices[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-5"
          style={{ background: `linear-gradient(135deg, ${service.color}, transparent)` }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-8 relative z-10">
          <motion.div
            className="mb-6"
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: service.color }}
            >
              <service.icon className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h3 className="text-xl text-foreground mb-4">{service.title}</h3>
          <p className="text-muted-foreground mb-6">{service.description}</p>

          <motion.div
            className="space-y-2"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {service.features.map((feature, idx) => (
              <motion.div
                key={feature}
                className="flex items-center space-x-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FloatingDesignBadge({ tool, index }: { tool: typeof designTools[0]; index: number }) {
  return (
    <motion.div
      className="absolute"
      initial={{ 
        x: Math.random() * 300,
        y: Math.random() * 200,
        scale: 0,
        opacity: 0
      }}
      animate={{
        x: Math.random() * 300,
        y: Math.random() * 200,
        scale: 1,
        opacity: 0.8,
        rotate: [0, 360]
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
        delay: index * 0.2
      }}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
        style={{ backgroundColor: tool.color }}
      >
        {tool.name.slice(0, 2)}
      </div>
    </motion.div>
  );
}

export default function TechShowcase() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl text-foreground mb-4">UI/UX Designing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creating exceptional user experiences through thoughtful design and innovative solutions
          </p>
        </motion.div>

        {/* Floating Design Tool Badges Background */}
        <div className="absolute inset-0 pointer-events-none">
          {designTools.map((tool, index) => (
            <FloatingDesignBadge key={tool.name} tool={tool} index={index} />
          ))}
        </div>

        {/* Design Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
          {designServices.map((service, index) => (
            <DesignCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Animated Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex justify-center space-x-8 items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Layout className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Layers className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <MousePointer className="w-12 h-12 text-primary" />
            </motion.div>
          </div>
          <motion.p 
            className="text-muted-foreground mt-6 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Built on Zero. Driven by One. Crafting digital experiences that users love and businesses trust.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}