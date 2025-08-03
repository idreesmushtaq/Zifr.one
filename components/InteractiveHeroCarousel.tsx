import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, Play, Star, Quote, ArrowRight, Zap, Code, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "Transform Your Digital Vision",
    subtitle: "Built on Zero. Driven by One.",
    description: "Revolutionary technology solutions that transform businesses and drive innovation in the digital era.",
    ctaText: "Start Your Journey",
    ctaLink: "/contact",
    backgroundGradient: "from-emerald-100/60 via-teal-100/50 to-cyan-100/60",
    bgColor: "#e6f7ff",
    icon: Zap,
    stats: [
      { value: "500+", label: "Projects Delivered" },
      { value: "250+", label: "Happy Clients" },
      { value: "99.9%", label: "Uptime" }
    ]
  },
  {
    id: 2,
    title: "Custom Software Development",
    subtitle: "Tailored Solutions for Every Need",
    description: "From concept to deployment, we build scalable software solutions that perfectly align with your business objectives.",
    ctaText: "Explore Services",
    ctaLink: "/services",
    backgroundGradient: "from-green-100/50 via-emerald-100/60 to-teal-100/50",
    bgColor: "#f0f9f4",
    icon: Code,
    stats: [
      { value: "24/7", label: "Support" },
      { value: "95%", label: "Client Retention" },
      { value: "10+", label: "Years Experience" }
    ]
  },
  {
    id: 3,
    title: "UI/UX Design Excellence",
    subtitle: "User-Centered Experiences",
    description: "Create intuitive and engaging digital experiences that delight users and drive business results.",
    ctaText: "Learn More",
    ctaLink: "/about",
    backgroundGradient: "from-blue-100/50 via-cyan-100/60 to-emerald-100/50",
    bgColor: "#f0f8ff",
    icon: Palette,
    stats: [
      { value: "10x", label: "Better UX" },
      { value: "60%", label: "User Engagement" },
      { value: "100%", label: "Design Quality" }
    ]
  }
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "CTO, TechCorp",
    content: "Zifr.one transformed our digital infrastructure completely. Their expertise in technology solutions saved us 60% in operational costs.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Founder, StartupXYZ",
    content: "The team's ability to understand our vision and translate it into a scalable solution was remarkable. Highly recommended!",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "CEO, InnovateCo",
    content: "Working with Zifr.one was a game-changer. Their 24/7 support and dedication to quality is unmatched in the industry.",
    rating: 5,
    avatar: "ER"
  }
];

function StatCard({ stat, delay }: { stat: { value: string; label: string }; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        className="text-2xl md:text-3xl font-bold text-primary mb-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
      >
        {stat.value}
      </motion.div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, isActive }: { testimonial: typeof testimonials[0]; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.9,
        y: isActive ? 0 : 10
      }}
      transition={{ duration: 0.5 }}
      className={`${isActive ? 'z-10' : 'z-0'} relative`}
    >
      <Card className="bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
              {testimonial.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Quote className="w-4 h-4 text-primary" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-3 text-sm italic">"{testimonial.content}"</p>
              <div>
                <div className="font-medium text-foreground">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">{testimonial.position}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function InteractiveHeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background with improved color palette */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.backgroundGradient}`}
        style={{ backgroundColor: currentSlideData.bgColor }}
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Animated Background Shapes with improved colors */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`bg-shape-${currentSlide}-${i}`}
            className="absolute w-64 h-64 rounded-full opacity-10"
            style={{ 
              background: i % 3 === 0 
                ? 'linear-gradient(135deg, #e6f7ff, #f0f9f4)' 
                : i % 3 === 1
                ? 'linear-gradient(135deg, #f0f8ff, #e0f8f8)'
                : 'linear-gradient(135deg, #f0f9f4, #e6f7ff)'
            }}
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              scale: [1, 1.2, 1],
              rotate: 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8 }}
              >
                {/* Icon */}
                <motion.div
                  className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title and Subtitle */}
                <motion.h1 
                  className="text-4xl md:text-6xl lg:text-7xl text-foreground mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <span className="gradient-icon">{currentSlideData.title}</span>
                </motion.h1>

                <motion.p 
                  className="text-xl md:text-2xl text-primary mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {currentSlideData.subtitle}
                </motion.p>

                <motion.p 
                  className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {currentSlideData.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild className="gradient-button px-8 py-6 text-lg rounded-full shadow-lg">
                      <Link to={currentSlideData.ctaLink}>
                        {currentSlideData.ctaText}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 text-lg rounded-full border-2 hover:border-primary bg-card/50 backdrop-blur-sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      <Play className="mr-2 w-5 h-5" />
                      {isPlaying ? 'Pause Tour' : 'Start Tour'}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  {currentSlideData.stats.map((stat, index) => (
                    <StatCard key={stat.label} stat={stat} delay={0.7 + index * 0.1} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Content - Testimonials */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl text-foreground mb-2">What Our Clients Say</h3>
                <p className="text-muted-foreground">Real feedback from our amazing clients</p>
              </div>

              <div className="relative h-64">
                <AnimatePresence mode="wait">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`absolute inset-0 ${index === currentTestimonial ? 'z-10' : 'z-0'}`}
                    >
                      <TestimonialCard 
                        testimonial={testimonial} 
                        isActive={index === currentTestimonial}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'gradient-bg scale-125' 
                        : 'bg-border hover:bg-primary/50'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'gradient-bg scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}