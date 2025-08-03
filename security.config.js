// Security configuration for Zifr.one website
export const securityConfig = {
  // Content Security Policy
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Vite in development
      "'unsafe-eval'", // Required for Three.js
      "https://unpkg.com",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https:",
      "http:"
    ],
    connectSrc: [
      "'self'",
      "https://api.zifr.one",
      "wss:",
      "ws:"
    ],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    childSrc: ["'self'"],
    workerSrc: ["'self'", "blob:"],
    manifestSrc: ["'self'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none'
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for static assets
      return req.url.includes('/assets/') || req.url.includes('/favicon');
    }
  },

  // Contact Form Rate Limiting
  contactFormRateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Limit to 3 contact form submissions per minute
    message: 'Too many contact form submissions, please wait before trying again'
  },

  // Input Validation Rules
  validation: {
    name: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/,
      sanitize: true
    },
    email: {
      maxLength: 254,
      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      sanitize: true,
      blockedDomains: [
        '10minutemail.com',
        'tempmail.org',
        'guerrillamail.com',
        'mailinator.com',
        'throwaway.email',
        'temp-mail.org'
      ]
    },
    phone: {
      maxLength: 20,
      pattern: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
      sanitize: true
    },
    message: {
      minLength: 10,
      maxLength: 2000,
      sanitize: true
    },
    subject: {
      minLength: 5,
      maxLength: 200,
      sanitize: true
    }
  },

  // File Upload Security
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ],
    maxFiles: 5,
    virusScan: true
  },

  // XSS Protection Patterns
  xssPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<applet/gi,
    /<form/gi,
    /data:(?!image\/)/gi,
    /<link/gi,
    /<meta/gi,
    /<style/gi
  ],

  // SQL Injection Protection Patterns
  sqlInjectionPatterns: [
    /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|declare)\b)/gi,
    /(--|\/\*|\*\/|;|'|"|`)/g,
    /(\b(or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/gi
  ],

  // Trusted Domains for External Resources
  trustedDomains: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'unpkg.com',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'api.whatsapp.com',
    'wa.me'
  ],

  // Session Security
  session: {
    name: 'zifr_session',
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://zifr.one', 'https://www.zifr.one']
      : true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-Client-Version',
      'X-Timestamp'
    ]
  },

  // Error Handling
  errorHandling: {
    showStackTrace: process.env.NODE_ENV !== 'production',
    logErrors: true,
    reportErrors: process.env.NODE_ENV === 'production',
    sanitizeErrors: true
  },

  // Monitoring and Alerting
  monitoring: {
    enableSecurityEvents: true,
    alertThresholds: {
      rateLimitViolations: 10,
      xssAttempts: 5,
      sqlInjectionAttempts: 3,
      invalidTokens: 5
    },
    alertEmails: [
      'security@zifr.one',
      'admin@zifr.one'
    ]
  },

  // Backup and Recovery
  backup: {
    enabled: true,
    interval: '0 2 * * *', // Daily at 2 AM
    retention: 30, // Keep backups for 30 days
    destination: process.env.BACKUP_DESTINATION || './backups'
  },

  // API Security
  api: {
    authRequired: false, // No authentication required for contact form
    rateLimitByIP: true,
    validateReferer: true,
    requireHTTPS: process.env.NODE_ENV === 'production',
    timeout: 30000, // 30 seconds
    maxRequestSize: '10mb'
  },

  // WhatsApp Security
  whatsapp: {
    validateNumber: true,
    rateLimitClicks: true,
    maxRedirects: 3,
    timeout: 5000,
    trustedDomains: [
      'wa.me',
      'api.whatsapp.com',
      'web.whatsapp.com'
    ]
  }
};

// Security utility functions
export const securityUtils = {
  // Generate secure CSP header
  generateCSP: () => {
    const csp = securityConfig.csp;
    return Object.entries(csp)
      .map(([directive, sources]) => {
        const kebabDirective = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabDirective} ${sources.join(' ')}`;
      })
      .join('; ');
  },

  // Validate input against XSS patterns
  validateInput: (input, type = 'general') => {
    const validation = securityConfig.validation[type] || securityConfig.validation.general;
    const patterns = securityConfig.xssPatterns;
    
    // Check for XSS patterns
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        return { valid: false, reason: 'Potentially malicious content detected' };
      }
    }
    
    // Check validation rules if they exist
    if (validation) {
      if (validation.minLength && input.length < validation.minLength) {
        return { valid: false, reason: `Minimum length is ${validation.minLength}` };
      }
      
      if (validation.maxLength && input.length > validation.maxLength) {
        return { valid: false, reason: `Maximum length is ${validation.maxLength}` };
      }
      
      if (validation.pattern && !validation.pattern.test(input)) {
        return { valid: false, reason: 'Invalid format' };
      }
    }
    
    return { valid: true };
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .substring(0, 10000);
  },

  // Check if domain is trusted
  isTrustedDomain: (url) => {
    try {
      const domain = new URL(url).hostname;
      return securityConfig.trustedDomains.includes(domain);
    } catch {
      return false;
    }
  },

  // Generate security headers object
  getSecurityHeaders: () => {
    return {
      ...securityConfig.headers,
      'Content-Security-Policy': securityUtils.generateCSP()
    };
  }
};

export default securityConfig;