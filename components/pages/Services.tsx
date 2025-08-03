import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Settings, Code, Palette, Headphones, Search, Smartphone } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useSafeThree } from '../ThreeProvider';
import { ShimmerCard, ShimmerIcon, HoverShimmer, ShimmerText } from '../ShimmerComponents';

// Dynamic import for Three.js background
const DynamicServicesBackground = React.lazy(() => import('../ServicesThreeBackground'));

export default function Services() {
  const { shouldRender, isLoading, hasError } = useSafeThree();

  const services = [
    {
      icon: Settings,
      title: 'Custom Software Development',
      description: 'Tailored software solutions designed to meet your specific business requirements and drive operational efficiency.',
      features: ['Custom Applications', 'System Integration', 'Legacy Modernization', 'API Development']
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Modern, responsive websites and web applications built with cutting-edge technologies for optimal performance.',
      features: ['Responsive Design', 'E-commerce Solutions', 'CMS Development', 'Progressive Web Apps']
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.',
      features: ['iOS & Android Apps', 'React Native Development', 'Flutter Applications', 'Mobile UI/UX Design']
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'User-centered design solutions that create intuitive and engaging digital experiences for your customers.',
      features: ['User Research', 'Wireframing & Prototyping', 'Visual Design', 'Usability Testing']
    },
    {
      icon: Search,
      title: 'Technology Review',
      description: 'Comprehensive analysis and evaluation of your current technology stack to optimize performance and security.',
      features: ['Architecture Assessment', 'Security Audit', 'Performance Analysis', 'Modernization Strategy']
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Round-the-clock technical assistance and maintenance services to ensure your systems run smoothly.',
      features: ['24/7 Monitoring', 'Issue Resolution', 'System Maintenance', 'Performance Optimization']
    }
  ];

  const backgroundFallback = (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
  );

  return (
    <div className="relative">
      {/* Three.js Animated Background */}
      {shouldRender && (
        <React.Suspense fallback={backgroundFallback}>
          <DynamicServicesBackground />
        </React.Suspense>
      )}
      {(isLoading || hasError) && backgroundFallback}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ShimmerText enabled className="text-4xl md:text-5xl text-foreground mb-6">
              Our Services
            </ShimmerText>
            <p className="text-lg text-muted-foreground">
              Comprehensive technology solutions designed to accelerate your business 
              growth and digital transformation journey.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-card/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <ShimmerCard 
                  key={index} 
                  variant="glow"
                  className="p-0"
                >
                  <Card className="p-8 border-border hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm group hover:bg-card/90 h-full">
                    <CardHeader className="pb-4">
                      <HoverShimmer>
                        <ShimmerIcon className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8 text-white" />
                        </ShimmerIcon>
                      </HoverShimmer>
                      <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                        <ShimmerText enabled={false}>
                          {service.title}
                        </ShimmerText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">{service.description}</p>
                      <div>
                        <h4 className="text-foreground mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              <ChevronRight className="w-4 h-4 text-black mr-3 flex-shrink-0 group-hover:text-primary transition-colors duration-300 shimmer-icon" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </ShimmerCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-foreground mb-4">
              <ShimmerText enabled>Our Process</ShimmerText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven methodology that ensures successful project delivery and exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'We analyze your requirements and goals' },
              { step: '02', title: 'Planning', description: 'Strategic planning and project roadmap' },
              { step: '03', title: 'Development', description: 'Agile development with regular updates' },
              { step: '04', title: 'Delivery', description: 'Testing, deployment, and ongoing support' }
            ].map((item, index) => (
              <HoverShimmer key={index} className="text-center group">
                <ShimmerCard variant="pulse" className="inline-block">
                  <div className="w-16 h-16 gradient-bg text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-lg font-medium">{item.step}</span>
                  </div>
                </ShimmerCard>
                <h3 className="text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </HoverShimmer>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}