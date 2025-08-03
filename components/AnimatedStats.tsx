import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, Code, Zap } from 'lucide-react';

const lineData = [
  { name: 'Jan', value: 30, growth: 20 },
  { name: 'Feb', value: 45, growth: 35 },
  { name: 'Mar', value: 60, growth: 50 },
  { name: 'Apr', value: 80, growth: 70 },
  { name: 'May', value: 95, growth: 85 },
  { name: 'Jun', value: 120, growth: 110 },
];

const pieData = [
  { name: 'Web Dev', value: 40, color: '#00a9c0' },
  { name: 'Software', value: 35, color: '#6fce44' },
  { name: 'Cloud', value: 25, color: '#FFC107' },
];

const radialData = [
  { name: 'Performance', value: 92, fill: '#00a9c0' },
  { name: 'Reliability', value: 96, fill: '#6fce44' },
  { name: 'Security', value: 88, fill: '#FFC107' },
];

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [end, duration, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AnimatedStats() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl text-foreground mb-4">Performance Analytics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into our technology solutions and business growth
          </p>
        </motion.div>

        {/* Animated Counter Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, title: "Happy Clients", value: 250, suffix: "+" },
            { icon: Code, title: "Projects Completed", value: 500, suffix: "+" },
            { icon: TrendingUp, title: "Growth Rate", value: 95, suffix: "%" },
            { icon: Zap, title: "Uptime", value: 99, suffix: ".9%" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center p-6 border-border hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Interactive Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-6 border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-foreground">Growth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00a9c0" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00a9c0" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6fce44" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6fce44" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#666666" />
                      <YAxis stroke="#666666" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #E0E0E0',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#00a9c0" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        strokeWidth={3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="growth" 
                        stroke="#6fce44" 
                        fillOpacity={1} 
                        fill="url(#colorGrowth)" 
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="p-6 border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-foreground">Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #E0E0E0',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="p-6 border-border hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-foreground text-center">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
                    <RadialBar 
                      minAngle={15} 
                      label={{ position: 'insideStart', fill: '#fff' }} 
                      background 
                      clockWise={true} 
                      dataKey="value" 
                      cornerRadius={10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px'
                      }} 
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}