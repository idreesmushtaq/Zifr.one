# Zifr.one Professional Website

> **Built on Zero. Driven by One.**

A modern, professional website for Zifr.one featuring cutting-edge animations, Three.js backgrounds, and innovative shimmer effects. Built with React, TypeScript, Tailwind CSS, and advanced web technologies.

## 🚀 Features

- **Modern React Architecture** - Built with React 18, TypeScript, and Vite
- **Stunning 3D Animations** - Three.js powered background animations for each page
- **Shimmer Effects** - Professional shimmer animations throughout the interface
- **Responsive Design** - Mobile-first approach with Tailwind CSS v4
- **Performance Optimized** - Code splitting, lazy loading, and optimized bundles
- **Production Ready** - Comprehensive security headers and error boundaries
- **SEO Optimized** - Meta tags, structured data, and accessibility features

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS animations
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animations**: Framer Motion, Custom shimmer effects
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Routing**: React Router DOM
- **Forms**: React Hook Form with validation
- **Build Tools**: Vite, ESLint, TypeScript

## 📋 Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: Latest version

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zifr-one-website.git
cd zifr-one-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run preview      # Preview production build
npm run serve        # Serve production build on port 3000
```

### Building

```bash
npm run build               # Production build
npm run build:production    # Production build with linting and type checking
npm run clean              # Clean dist folder
```

### Code Quality

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run type-check     # TypeScript type checking
```

### Analysis

```bash
npm run analyze        # Bundle size analysis
```

### Deployment

```bash
npm run deploy:netlify    # Deploy to Netlify
npm run deploy:vercel     # Deploy to Vercel
```

## 🏗️ Project Structure

```
├── components/                 # React components
│   ├── pages/                 # Page components (Home, About, Services, Contact)
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   ├── utils/                 # Utility functions and security
│   ├── *ThreeBackground.tsx   # Three.js background components
│   ├── ShimmerComponents.tsx  # Shimmer effect components
│   └── *.tsx                  # Other components
├── styles/                    # CSS and styling files
│   └── globals.css           # Global styles and animations
├── public/                    # Static assets
├── netlify/                   # Netlify functions (optional)
├── dist/                      # Production build output
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🎨 Shimmer Effects

The website features advanced shimmer effects implemented through:

### CSS Animations
- `shimmer` - Basic shimmer sweep effect
- `shimmer-glow` - Glowing pulse animation
- `shimmer-wave` - Gradient wave animation
- `shimmer-pulse` - Pulsing shadow effect

### React Components
- `ShimmerCard` - Cards with hover shimmer effects
- `ShimmerText` - Gradient text animations
- `ShimmerButton` - Enhanced button interactions
- `LoadingSkeleton` - Loading state animations

### Usage Example

```tsx
import { ShimmerCard, ShimmerText } from './components/ShimmerComponents';

<ShimmerCard variant="glow">
  <ShimmerText>Built on Zero. Driven by One.</ShimmerText>
</ShimmerCard>
```

## 🌐 Deployment

### Netlify Deployment

1. **Automatic Deployment**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build:production`
   - Set publish directory: `dist`
   - Deploy automatically on push

2. **Manual Deployment**:
   ```bash
   npm run deploy:netlify
   ```

3. **Environment Variables** (Optional):
   ```
   NODE_ENV=production
   VITE_API_URL=your-api-url
   ```

### Vercel Deployment

1. **Automatic Deployment**:
   - Connect your GitHub repository to Vercel
   - Deploy automatically with `vercel.json` configuration

2. **Manual Deployment**:
   ```bash
   npm run deploy:vercel
   ```

### Traditional Web Hosting

1. Build the project:
   ```bash
   npm run build:production
   ```

2. Upload the `dist/` folder contents to your web server

3. Configure your server to serve `index.html` for all routes (SPA routing)

## ⚡ Performance Optimizations

### Code Splitting
- Automatic route-based splitting
- Component lazy loading
- Three.js backgrounds loaded dynamically

### Bundle Optimization
- Vendor chunks separated
- Tree shaking enabled
- Terser minification

### Caching Strategy
- Static assets: 1 year cache
- HTML: No cache
- Service worker ready (optional)

### Image Optimization
- WebP format support
- Lazy loading
- Responsive images

## 🔒 Security Features

### Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-XSS-Protection enabled
- Referrer Policy configured

### Input Security
- Form validation and sanitization
- Rate limiting on submissions
- CSRF protection ready

### Error Handling
- Global error boundaries
- Graceful fallbacks
- Secure error reporting

## 🎯 SEO & Accessibility

### SEO Features
- Meta tags optimization
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Semantic HTML

### Accessibility
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast support
- Focus management

## 🐛 Troubleshooting

### Common Issues

1. **Three.js Errors**:
   - Clear browser cache
   - Check WebGL support
   - Disable browser extensions

2. **Build Errors**:
   ```bash
   npm run clean
   npm install
   npm run build
   ```

3. **TypeScript Errors**:
   ```bash
   npm run type-check
   ```

4. **Shimmer Effects Not Working**:
   - Ensure CSS is loaded
   - Check browser compatibility
   - Verify component props

### Performance Issues
- Enable hardware acceleration in browser
- Close unnecessary browser tabs
- Check network connection
- Disable browser extensions

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **WebGL**: Required for Three.js effects
- **ES2020**: Modern JavaScript features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Test in multiple browsers
- Optimize for performance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Zifr.one Development Team**
- **Contact**: support@zifr.one
- **Website**: [https://zifr.one](https://zifr.one)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Three.js](https://threejs.org/) - 3D Graphics
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Vite](https://vitejs.dev/) - Build Tool
- [Lucide](https://lucide.dev/) - Icons

## 📊 Status

- **Build**: [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
- **Version**: [![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
- **License**: [![License](https://img.shields.io/badge/license-MIT-green)]()
- **TypeScript**: [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)]()

---

**Built with ❤️ by the Zifr.one team**

*"Built on Zero. Driven by One."*