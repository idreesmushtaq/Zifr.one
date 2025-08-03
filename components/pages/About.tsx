import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Lightbulb, Users, Target, Award } from 'lucide-react';
import ZeroToOneAnimation from '../ZeroToOneAnimation';
import { useSafeThree } from '../ThreeProvider';

// Dynamic import for Three.js background
const DynamicAboutBackground = React.lazy(() => import('../AboutThreeBackground'));

export default function About() {
  const { shouldRender, isLoading, hasError } = useSafeThree();

  const backgroundFallback = (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
  );

  return (
    <div className="relative">
      {/* Three.js Animated Background */}
      {shouldRender && (
        <React.Suspense fallback={backgroundFallback}>
          <DynamicAboutBackground />
        </React.Suspense>
      )}
      {(isLoading || hasError) && backgroundFallback}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl text-foreground mb-6">
              About Our Company
            </h1>
            <p className="text-lg text-muted-foreground">
              We are a forward-thinking technology company dedicated to delivering 
              innovative solutions that transform businesses and drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-card/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
              <h2 className="text-3xl text-foreground mb-6">Vision</h2>
              <p className="text-muted-foreground mb-6">
                At Zifr.one, we believe in the power of transformation. Our journey began with a simple yet profound vision: to bridge the gap between zero and one, turning innovative ideas into tangible realities that shape the future.
              </p>
              <p className="text-muted-foreground mb-6">
                We understand that every breakthrough starts from nothing—from zero. But with the right vision, expertise, and determination, we transform these concepts into revolutionary solutions that drive businesses forward. This is what it means to be "Built on Zero. Driven by One."
              </p>
              <p className="text-muted-foreground">
                Our team of visionaries, developers, and innovators work tirelessly to ensure that every project we undertake represents this transformative journey from concept to reality, from zero to one.
              </p>
            </div>
            <div className="lg:h-96">
              <ZeroToOneAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-foreground mb-4">Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and drive our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-border bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group hover:shadow-xl">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly push boundaries and embrace new technologies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-border bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group hover:shadow-xl">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Collaboration</h3>
                <p className="text-muted-foreground">
                  We believe in the power of teamwork and partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-border bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group hover:shadow-xl">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Focus</h3>
                <p className="text-muted-foreground">
                  We maintain laser focus on delivering results that matter.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-border bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group hover:shadow-xl">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for perfection in every project and interaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}