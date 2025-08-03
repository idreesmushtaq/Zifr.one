// Application configuration with fallbacks to prevent undefined errors
export interface AppConfig {
  whatsapp: {
    businessNumber: string;
    defaultMessage: string;
    enabled: boolean;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    businessHours: string;
  };
  features: {
    threeJS: boolean;
    animations: boolean;
    shimmerEffects: boolean;
    lazyLoading: boolean;
    whatsappIntegration: boolean;
    contactForm: boolean;
  };
  security: {
    rateLimitRequests: number;
    rateLimitWindow: number;
    enableInputSanitization: boolean;
    enableRateLimiting: boolean;
  };
  api: {
    contactFormEndpoint: string;
    fallbackEndpoint: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    description: string;
    environment: string;
  };
}

// Get environment variable with fallback
function getEnvVar(key: string, fallback: string = ''): string {
  try {
    return import.meta.env[key] || fallback;
  } catch {
    return fallback;
  }
}

// Get boolean environment variable with fallback
function getEnvBool(key: string, fallback: boolean = false): boolean {
  try {
    const value = import.meta.env[key];
    return value === 'true' || value === '1' || fallback;
  } catch {
    return fallback;
  }
}

// Get number environment variable with fallback
function getEnvNumber(key: string, fallback: number = 0): number {
  try {
    const value = import.meta.env[key];
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  } catch {
    return fallback;
  }
}

// Default configuration with all necessary fallbacks
export const appConfig: AppConfig = {
  whatsapp: {
    businessNumber: getEnvVar('VITE_WHATSAPP_NUMBER', '+919876543210'),
    defaultMessage: getEnvVar(
      'VITE_WHATSAPP_DEFAULT_MESSAGE', 
      'Hi! I found your website and would like to know more about your services.'
    ),
    enabled: getEnvBool('VITE_ENABLE_WHATSAPP_INTEGRATION', true),
  },
  contact: {
    email: getEnvVar('VITE_CONTACT_EMAIL', 'support@zifr.one'),
    phone: getEnvVar('VITE_CONTACT_PHONE', '+91 98765 43210'),
    address: getEnvVar('VITE_COMPANY_ADDRESS', 'Chennai, Tamil Nadu, India'),
    businessHours: getEnvVar('VITE_BUSINESS_HOURS', 'Mon - Fri: 9:00 AM - 6:00 PM IST'),
  },
  features: {
    threeJS: getEnvBool('VITE_ENABLE_THREE_JS', true),
    animations: getEnvBool('VITE_ENABLE_ANIMATIONS', true),
    shimmerEffects: getEnvBool('VITE_ENABLE_SHIMMER_EFFECTS', true),
    lazyLoading: getEnvBool('VITE_ENABLE_LAZY_LOADING', true),
    whatsappIntegration: getEnvBool('VITE_ENABLE_WHATSAPP_INTEGRATION', true),
    contactForm: getEnvBool('VITE_ENABLE_CONTACT_FORM', true),
  },
  security: {
    rateLimitRequests: getEnvNumber('VITE_RATE_LIMIT_REQUESTS', 5),
    rateLimitWindow: getEnvNumber('VITE_RATE_LIMIT_WINDOW', 60000),
    enableInputSanitization: getEnvBool('VITE_ENABLE_INPUT_SANITIZATION', true),
    enableRateLimiting: getEnvBool('VITE_ENABLE_RATE_LIMITING', true),
  },
  api: {
    contactFormEndpoint: getEnvVar('VITE_FORM_ENDPOINT', '/.netlify/functions/send-contact-message'),
    fallbackEndpoint: getEnvVar('VITE_FORM_FALLBACK_ENDPOINT', '/api/send-contact-message'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  },
  app: {
    name: getEnvVar('VITE_APP_TITLE', 'Zifr.one'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    description: getEnvVar('VITE_APP_DESCRIPTION', 'Built on Zero. Driven by One.'),
    environment: getEnvVar('NODE_ENV', 'development'),
  },
};

// Configuration validation
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate WhatsApp number format
  if (appConfig.whatsapp.enabled) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(appConfig.whatsapp.businessNumber)) {
      errors.push('Invalid WhatsApp business number format');
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(appConfig.contact.email)) {
    errors.push('Invalid contact email format');
  }

  // Validate rate limiting values
  if (appConfig.security.rateLimitRequests <= 0) {
    errors.push('Rate limit requests must be greater than 0');
  }

  if (appConfig.security.rateLimitWindow <= 0) {
    errors.push('Rate limit window must be greater than 0');
  }

  // Validate API timeout
  if (appConfig.api.timeout <= 0) {
    errors.push('API timeout must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Get WhatsApp configuration
export function getWhatsAppConfig() {
  return {
    businessNumber: appConfig.whatsapp.businessNumber,
    defaultMessage: appConfig.whatsapp.defaultMessage,
    enabled: appConfig.whatsapp.enabled,
    chatUrl: (message: string) => {
      const cleanNumber = appConfig.whatsapp.businessNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    },
    callUrl: `tel:${appConfig.whatsapp.businessNumber}`,
  };
}

// Get contact information
export function getContactInfo() {
  return {
    email: appConfig.contact.email,
    phone: appConfig.contact.phone,
    address: appConfig.contact.address,
    businessHours: appConfig.contact.businessHours,
  };
}

// Get feature flags
export function getFeatures() {
  return appConfig.features;
}

// Get security configuration
export function getSecurityConfig() {
  return appConfig.security;
}

// Get API configuration
export function getApiConfig() {
  return appConfig.api;
}

// Development mode helpers
export function isDevelopment(): boolean {
  return appConfig.app.environment === 'development';
}

export function isProduction(): boolean {
  return appConfig.app.environment === 'production';
}

// Debug function for development
export function logConfig(): void {
  if (isDevelopment()) {
    console.group('App Configuration');
    console.log('App:', appConfig.app);
    console.log('Features:', appConfig.features);
    console.log('WhatsApp:', { ...appConfig.whatsapp, businessNumber: appConfig.whatsapp.businessNumber.replace(/\d/g, '*') });
    console.log('Contact:', { ...appConfig.contact, email: appConfig.contact.email.replace(/[^@.]./g, '*') });
    console.log('Security:', appConfig.security);
    console.log('API:', appConfig.api);
    console.groupEnd();

    // Validate configuration
    const validation = validateConfig();
    if (!validation.isValid) {
      console.warn('Configuration Errors:', validation.errors);
    }
  }
}

// Initialize configuration logging in development
if (isDevelopment() && typeof window !== 'undefined') {
  setTimeout(logConfig, 1000);
}

export default appConfig;