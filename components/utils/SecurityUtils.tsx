export class SecurityUtils {
  // Enhanced email validation with multiple checks
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    
    // Basic format check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return false;
    
    // Length checks
    if (email.length > 254) return false;
    
    // Domain checks
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    if (localPart.length > 64 || domain.length > 253) return false;
    
    // Blocked domains (disposable email services)
    const blockedDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];
    if (blockedDomains.includes(domain.toLowerCase())) return false;
    
    return true;
  }

  // Enhanced phone validation with international support
  static isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    
    // Remove all non-numeric characters except + and spaces
    const cleanPhone = phone.replace(/[^\d\+\s\-\(\)]/g, '');
    
    // Basic international phone validation
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(cleanPhone) && cleanPhone.replace(/\D/g, '').length >= 8;
  }

  // Enhanced input sanitization
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocols
      .replace(/vbscript:/gi, '') // Remove vbscript: protocols
      .substring(0, 10000); // Limit length
  }

  // Comprehensive form data sanitization
  static sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (value !== null && value !== undefined) {
        sanitized[key] = String(value).substring(0, 1000); // Convert to string and limit
      }
    }
    
    return sanitized;
  }

  // Enhanced rate limiting with multiple strategies
  private static rateLimitStore = new Map<string, { count: number; lastReset: number; blocked: boolean }>();

  static checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const identifier = `${key}_${this.getClientIdentifier()}`;
    
    let record = this.rateLimitStore.get(identifier);
    
    if (!record) {
      record = { count: 0, lastReset: now, blocked: false };
      this.rateLimitStore.set(identifier, record);
    }
    
    // Reset count if window has passed
    if (now - record.lastReset > windowMs) {
      record.count = 0;
      record.lastReset = now;
      record.blocked = false;
    }
    
    // Check if already blocked
    if (record.blocked) {
      return false;
    }
    
    // Increment count
    record.count++;
    
    // Block if limit exceeded
    if (record.count > maxRequests) {
      record.blocked = true;
      // Auto-unblock after extended period
      setTimeout(() => {
        const currentRecord = this.rateLimitStore.get(identifier);
        if (currentRecord) {
          currentRecord.blocked = false;
          currentRecord.count = 0;
        }
      }, windowMs * 2);
      return false;
    }
    
    return true;
  }

  // Get client identifier for rate limiting
  private static getClientIdentifier(): string {
    const userAgent = navigator.userAgent.substring(0, 100);
    const screen = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return btoa(`${userAgent}_${screen}_${timezone}`).substring(0, 32);
  }

  // Secure API request with enhanced error handling and security
  static async secureApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const secureOptions: RequestInit = {
        ...options,
        signal: controller.signal,
        credentials: 'same-origin',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Client-Version': '1.0.0',
          'X-Timestamp': Date.now().toString(),
          ...options.headers,
        },
      };

      // Add CSRF token if available
      const csrfToken = this.getCSRFToken();
      if (csrfToken) {
        (secureOptions.headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(url, secureOptions);
      
      // Log suspicious responses
      if (!response.ok && response.status >= 400) {
        console.warn(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('Unknown network error occurred');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Get CSRF token from meta tag or cookie
  private static getCSRFToken(): string | null {
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (metaTag) return metaTag.content;
    
    // Try to get from cookie
    const match = document.cookie.match(/csrf-token=([^;]+)/);
    return match ? match[1] : null;
  }

  // Generate secure session ID
  static generateSessionId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Content Security Policy validation
  static validateContent(content: string): boolean {
    // Check for dangerous patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<applet/i,
      /<form/i,
      /data:(?!image\/)/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(content));
  }

  // Event tracking with privacy protection
  static trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    try {
      // Only track in production and with user consent
      if (process.env.NODE_ENV !== 'production') return;
      
      const event = {
        name: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          sessionId: this.getSessionId(),
          userAgent: navigator.userAgent.substring(0, 100)
        }
      };
      
      // Store locally for now (can be sent to analytics service)
      const events = JSON.parse(localStorage.getItem('app_events') || '[]');
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('app_events', JSON.stringify(events));
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Get or create session ID
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  // Password strength validation (if needed for admin features)
  static validatePasswordStrength(password: string): { isValid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain uppercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Password must contain numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Password must contain special characters');
    
    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }

  // File upload validation
  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }
    
    return { isValid: true };
  }

  // Clean up old rate limit records
  static cleanupRateLimit(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now - record.lastReset > maxAge) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}

// Initialize cleanup on module load
if (typeof window !== 'undefined') {
  // Clean up every hour
  setInterval(() => SecurityUtils.cleanupRateLimit(), 60 * 60 * 1000);
}