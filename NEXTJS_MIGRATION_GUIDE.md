# Next.js Migration Guide for Zifr.one

This guide outlines the steps to convert the current React application to Next.js for better performance, SEO, and deployment capabilities.

## Current Architecture vs Next.js

### Current (React + Vite)
- Client-side routing with React Router
- Single-page application (SPA)
- Client-side rendering only
- Build artifacts served statically

### Next.js Benefits
- Server-side rendering (SSR) and Static Site Generation (SSG)
- Built-in routing system
- Better SEO optimization
- Automatic code splitting
- API routes for backend functionality
- Built-in optimizations (images, fonts, etc.)

## Migration Steps

### 1. Project Structure Changes

```
# Current structure
/components
/pages (React Router pages)
/styles
App.tsx
index.tsx

# Next.js structure
/components
/pages (Next.js file-based routing)
/public
/styles
/api (for API routes)
_app.tsx
_document.tsx
```

### 2. Package.json Updates

```json
{
  "name": "zifr-one-nextjs",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@next/font": "^14.0.0"
  }
}
```

### 3. File-based Routing Conversion

```typescript
// Current: App.tsx with React Router
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/contact" element={<Contact />} />
</Routes>

// Next.js: File-based routing
/pages/index.tsx        → /
/pages/about.tsx        → /about
/pages/services.tsx     → /services
/pages/contact.tsx      → /contact
```

### 4. Component Updates Required

#### Remove React Router Dependencies
- Remove `react-router-dom` imports
- Replace `Link` components with Next.js `Link`
- Remove `useNavigate`, `useLocation` hooks

#### Update Link Components
```typescript
// Before (React Router)
import { Link } from 'react-router-dom';
<Link to="/about">About</Link>

// After (Next.js)
import Link from 'next/link';
<Link href="/about">About</Link>
```

#### Update Image Components
```typescript
// Before
<img src="/logo.png" alt="Logo" />

// After (Next.js optimized)
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={200} height={100} />
```

### 5. Three.js Considerations

The Three.js components need updates for SSR compatibility:

```typescript
// Add dynamic imports for client-side only rendering
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('../components/ThreeBackground'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
});
```

### 6. API Routes Setup

Create API routes for form submissions:

```typescript
// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Handle contact form submission
    // Integrate with SendGrid here
    res.status(200).json({ message: 'Success' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

### 7. Environment Variables

```bash
# .env.local
SENDGRID_API_KEY=your_sendgrid_key
NEXT_PUBLIC_SITE_URL=https://zifr.one
```

### 8. Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Use pages directory
  },
  images: {
    domains: ['unsplash.com'], // For external images
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 9. Tailwind CSS Setup

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
};
```

### 10. _app.tsx Setup

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ScrollToTop } from '../components/AnimatedElements';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
}
```

### 11. SEO Optimization

```typescript
// components/SEO.tsx
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

export default function SEO({ title, description, canonical }: SEOProps) {
  return (
    <Head>
      <title>{title} | Zifr.one</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}
```

### 12. Performance Optimizations

- Use `next/image` for all images
- Implement ISR (Incremental Static Regeneration) for blog/content pages
- Use `next/font` for font optimization
- Implement lazy loading for heavy components

### 13. Deployment Considerations

- Vercel (recommended for Next.js)
- Netlify with Next.js plugin
- Custom server deployment

## Security Enhancements for Next.js

1. **Built-in Security Headers**
2. **API Route Protection**
3. **CSRF Protection**
4. **Rate Limiting**
5. **Input Validation**

## Migration Checklist

- [ ] Setup Next.js project structure
- [ ] Convert routing from React Router to file-based
- [ ] Update all Link components
- [ ] Add dynamic imports for client-side only components
- [ ] Setup API routes for form handling
- [ ] Configure environment variables
- [ ] Update Image components
- [ ] Add SEO components
- [ ] Test all functionality
- [ ] Deploy and test production build

## Estimated Migration Time

- **Small team (1-2 developers)**: 2-3 weeks
- **Medium team (3-5 developers)**: 1-2 weeks
- **Large team (5+ developers)**: 1 week

## Benefits After Migration

1. **Better SEO**: Server-side rendering improves search engine visibility
2. **Faster Loading**: Automatic code splitting and optimizations
3. **Better UX**: Faster page transitions and optimized assets
4. **API Integration**: Built-in API routes for backend functionality
5. **Production Ready**: Built-in optimizations for production deployment