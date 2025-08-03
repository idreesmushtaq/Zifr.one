// Vercel serverless function for secure contact form handling
import nodemailer from 'nodemailer';

// Security and validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .substring(0, 10000);
};

const rateLimitStore = new Map();

const checkRateLimit = (identifier, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  let record = rateLimitStore.get(identifier);
  
  if (!record) {
    record = { count: 0, lastReset: now };
    rateLimitStore.set(identifier, record);
  }
  
  if (now - record.lastReset > windowMs) {
    record.count = 0;
    record.lastReset = now;
  }
  
  record.count++;
  return record.count <= maxRequests;
};

export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://zifr.one' 
    : '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, X-CSRF-Token, X-Client-Version, X-Timestamp');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP, 3, 60000)) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    // Validate required fields
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      company: sanitizeInput(req.body.company || ''),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      whatsapp: sanitizeInput(req.body.whatsapp || ''),
      timestamp: new Date().toISOString(),
      clientIP: clientIP,
      userAgent: req.headers['user-agent']?.substring(0, 200) || 'Unknown'
    };

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email content (same as Netlify function)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(90deg, #00a9c0, #6fce44); color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { background: white; padding: 10px; border-radius: 5px; margin-top: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Zifr.one Website</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${sanitizedData.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${sanitizedData.email}</div>
            </div>
            ${sanitizedData.company ? `
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${sanitizedData.company}</div>
            </div>
            ` : ''}
            ${sanitizedData.whatsapp ? `
            <div class="field">
              <div class="label">WhatsApp:</div>
              <div class="value">${sanitizedData.whatsapp}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${sanitizedData.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${sanitizedData.message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">Submitted:</div>
              <div class="value">${sanitizedData.timestamp}</div>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent through the Zifr.one contact form.</p>
            <p>Client IP: ${sanitizedData.clientIP} | User Agent: ${sanitizedData.userAgent}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Zifr.one Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'support@zifr.one',
      replyTo: sanitizedData.email,
      subject: `[Contact Form] ${sanitizedData.subject}`,
      html: emailHtml,
      text: `
        New contact form submission from Zifr.one

        Name: ${sanitizedData.name}
        Email: ${sanitizedData.email}
        Company: ${sanitizedData.company}
        WhatsApp: ${sanitizedData.whatsapp}
        Subject: ${sanitizedData.subject}
        
        Message:
        ${sanitizedData.message}
        
        Submitted: ${sanitizedData.timestamp}
        IP: ${sanitizedData.clientIP}
      `
    };

    await transporter.sendMail(mailOptions);

    // Log successful submission
    console.log('Contact form submitted successfully:', {
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      timestamp: sanitizedData.timestamp
    });

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to send message. Please try again later.'
    });
  }
}