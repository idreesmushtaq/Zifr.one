import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollIndicator } from '../AnimatedElements';
import { ShimmerOverlay, LoadingSkeleton } from '../ShimmerComponents';

// Lazy load heavy components for better performance
const TechShowcase = React.lazy(() => import('../TechShowcase'));
const InteractiveHeroCarousel = React.lazy(() => import('../InteractiveHeroCarousel'));
const DynamicThreeBackground = React.lazy(() => import('../ThreeBackground'));

// Loading component for heavy sections
function SectionLoader() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSkeleton lines={5} />
      </div>
    </div>
  );
}

export default function Home() {
  const [componentsLoaded, setComponentsLoaded] = React.useState({
    threeBackground: false,
    heroCarousel: false,
    techShowcase: false
  });

  React.useEffect(() => {
    // Stagger the loading of heavy components to prevent blocking
    const timers = [
      setTimeout(() => {
        setComponentsLoaded(prev => ({ ...prev, threeBackground: true }));
      }, 100),
      setTimeout(() => {
        setComponentsLoaded(prev => ({ ...prev, heroCarousel: true }));
      }, 300),
      setTimeout(() => {
        setComponentsLoaded(prev => ({ ...prev, techShowcase: true }));
      }, 600)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative">
      {/* Three.js Background - Load first but render last for performance */}
      {componentsLoaded.threeBackground && (
        <Suspense fallback={<div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />}>
          <DynamicThreeBackground />
        </Suspense>
      )}

      {/* Interactive Hero Carousel Section - Critical above-the-fold content */}
      <section className="relative min-h-screen">
        <ShimmerOverlay isLoading={!componentsLoaded.heroCarousel}>
          {componentsLoaded.heroCarousel ? (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                <LoadingSkeleton lines={8} className="max-w-4xl mx-auto p-8" />
              </div>
            }>
              <InteractiveHeroCarousel />
            </Suspense>
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <LoadingSkeleton lines={8} />
              </div>
            </div>
          )}
        </ShimmerOverlay>
        <ScrollIndicator />
      </section>

      {/* UI/UX Designing Showcase Section - Lazy loaded */}
      <ShimmerOverlay isLoading={!componentsLoaded.techShowcase}>
        {componentsLoaded.techShowcase ? (
          <Suspense fallback={<SectionLoader />}>
            <TechShowcase />
          </Suspense>
        ) : (
          <SectionLoader />
        )}
      </ShimmerOverlay>

      {/* Features Section - Load immediately for better perceived performance */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-primary/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl text-foreground mb-4">Why Choose Zifr.one?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our innovative approach and cutting-edge solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Design Excellence",
                description: "Award-winning UI/UX designs that combine aesthetics with functionality for exceptional user experiences.",
                features: ["User-Centered Design", "Design Systems", "Accessibility Focused"]
              },
              {
                title: "Technical Innovation",
                description: "Cutting-edge development practices and modern technologies that ensure scalable, performant solutions.",
                features: ["Modern Frameworks", "Performance Optimized", "Future-Ready Architecture"]
              },
              {
                title: "Expert Team",
                description: "Industry veterans and technology pioneers working together to deliver excellence.",
                features: ["10+ Years Experience", "Certified Professionals", "Continuous Learning"]
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full p-8 border-border hover:shadow-xl transition-all duration-300 group bg-card/80 backdrop-blur-sm">
                  <CardContent className="space-y-6">
                    <motion.div
                      className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <motion.div
                          key={item}
                          className="flex items-center space-x-3"
                          initial={{ x: -10, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + idx * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <div className="w-2 h-2 gradient-bg rounded-full" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Always visible for conversion */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl text-foreground mb-6">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the digital revolution with Zifr.one. Let's create exceptional user experiences together.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="gradient-button px-8 py-6 text-lg rounded-full shimmer-button">
                <Link to="/contact">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}