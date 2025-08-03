import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Send,
  Shield,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  Clock,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { SecurityUtils } from "../utils/SecurityUtils";
import { useSafeThree } from "../ThreeProvider";
import {
  ShimmerCard,
  ShimmerText,
  HoverShimmer,
} from "../ShimmerComponents";
import {
  getWhatsAppConfig,
  getContactInfo,
  getApiConfig,
  getSecurityConfig,
} from "../config/AppConfig";

// Dynamic import for Three.js background
const DynamicContactBackground = React.lazy(
  () => import("../ContactThreeBackground"),
);

export default function Contact() {
  const { shouldRender, isLoading, hasError } = useSafeThree();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  // Get configurations safely with error handling
  const [whatsAppConfig, setWhatsAppConfig] = useState(() => {
    try {
      return getWhatsAppConfig();
    } catch (error) {
      console.warn("Failed to load WhatsApp config:", error);
      return {
        businessNumber: "+919876543210",
        defaultMessage:
          "Hi! I found your website and would like to know more about your services.",
        enabled: true,
        chatUrl: (message: string) =>
          `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
        callUrl: "tel:+919876543210",
      };
    }
  });

  const [contactInfo, setContactInfo] = useState(() => {
    try {
      return getContactInfo();
    } catch (error) {
      console.warn("Failed to load contact info:", error);
      return {
        email: "support@zifr.one",
        phone: "+91 98765 43210",
        address: "Chennai, Tamil Nadu, India",
        businessHours: "Mon - Fri: 9:00 AM - 6:00 PM IST",
      };
    }
  });

  const [apiConfig] = useState(() => {
    try {
      return getApiConfig();
    } catch (error) {
      console.warn("Failed to load API config:", error);
      return {
        contactFormEndpoint:
          "/.netlify/functions/send-contact-message",
        fallbackEndpoint: "/api/send-contact-message",
        timeout: 30000,
      };
    }
  });

  const [securityConfig] = useState(() => {
    try {
      return getSecurityConfig();
    } catch (error) {
      console.warn("Failed to load security config:", error);
      return {
        rateLimitRequests: 3,
        rateLimitWindow: 60000,
        enableInputSanitization: true,
        enableRateLimiting: true,
      };
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      newErrors.name =
        "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      try {
        if (!SecurityUtils.isValidEmail(formData.email)) {
          newErrors.email =
            "Please enter a valid email address";
        }
      } catch (error) {
        console.warn("Email validation error:", error);
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject =
        "Subject must be at least 5 characters";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        "Message must be at least 10 characters";
    }

    // WhatsApp validation (optional)
    if (formData.whatsapp) {
      try {
        if (!SecurityUtils.isValidPhone(formData.whatsapp)) {
          newErrors.whatsapp =
            "Please enter a valid phone number (e.g., +91 98765 43210)";
        }
      } catch (error) {
        console.warn("Phone validation error:", error);
        newErrors.whatsapp =
          "Please enter a valid phone number";
      }
    }

    // Company validation (optional, but if provided, validate)
    if (
      formData.company &&
      formData.company.trim().length > 0 &&
      formData.company.trim().length < 2
    ) {
      newErrors.company =
        "Company name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Additional input sanitization
    let sanitizedValue = value;

    try {
      if (securityConfig.enableInputSanitization) {
        if (name === "name") {
          // Remove numbers and special characters except spaces, hyphens, and apostrophes
          sanitizedValue = value.replace(/[^a-zA-Z\s'-]/g, "");
        } else if (name === "whatsapp") {
          // Allow only numbers, spaces, hyphens, plus, and parentheses
          sanitizedValue = value.replace(
            /[^0-9\s\-\+\(\)]/g,
            "",
          );
        }
      }
    } catch (error) {
      console.warn("Error sanitizing input:", error);
      sanitizedValue = value; // Fallback to original value
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    // Enhanced rate limiting check
    if (securityConfig.enableRateLimiting) {
      try {
        if (
          !SecurityUtils.checkRateLimit(
            "contact_form",
            securityConfig.rateLimitRequests,
            securityConfig.rateLimitWindow,
          )
        ) {
          toast.error(
            "Too many requests. Please wait a minute before trying again.",
          );
          return;
        }
      } catch (error) {
        console.warn("Rate limiting check failed:", error);
        // Continue without rate limiting if there's an error
      }
    }

    setIsSubmitting(true);

    try {
      // Sanitize form data with enhanced security
      let sanitizedData;
      try {
        sanitizedData =
          SecurityUtils.sanitizeFormData(formData);
      } catch (error) {
        console.warn("Data sanitization failed:", error);
        sanitizedData = { ...formData }; // Fallback to original data
      }

      // Create secure payload
      const payload = {
        ...sanitizedData,
        to: contactInfo.email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 200), // Limit user agent length
        referer: document.referrer.substring(0, 200), // Limit referer length
        sessionId: SecurityUtils.generateSessionId(),
        formVersion: "1.0.0",
      };

      // Attempt to send via primary endpoint first, then fallback
      let response;
      try {
        response = await SecurityUtils.secureApiRequest(
          apiConfig.contactFormEndpoint,
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
        );
      } catch (primaryError) {
        console.warn("Primary endpoint failed:", primaryError);
        // Fallback to secondary endpoint
        try {
          response = await SecurityUtils.secureApiRequest(
            apiConfig.fallbackEndpoint,
            {
              method: "POST",
              body: JSON.stringify(payload),
            },
          );
        } catch (fallbackError) {
          console.warn(
            "Fallback endpoint failed:",
            fallbackError,
          );
          // Final fallback - show WhatsApp option
          toast.error(
            "Email service temporarily unavailable. Please contact us via WhatsApp below.",
          );
          return;
        }
      }

      if (response && response.ok) {
        toast.success(
          "Message sent successfully! We'll get back to you within 24 hours.",
        );
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          whatsapp: "",
        });
        setErrors({});
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        "Failed to send message. Please try WhatsApp or call us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppChat = () => {
    try {
      if (!whatsAppConfig.enabled) {
        toast.error(
          "WhatsApp integration is currently disabled.",
        );
        return;
      }

      const customMessage = formData.name
        ? `Hi! I'm ${formData.name} and I found your website. I'd like to know more about your services.`
        : whatsAppConfig.defaultMessage;

      const chatUrl = whatsAppConfig.chatUrl(customMessage);
      window.open(chatUrl, "_blank", "noopener,noreferrer");

      // Track WhatsApp interaction
      try {
        SecurityUtils.trackEvent("whatsapp_chat_clicked", {
          timestamp: new Date().toISOString(),
          hasFormData: !!formData.name,
        });
      } catch (trackingError) {
        console.warn(
          "Error tracking WhatsApp interaction:",
          trackingError,
        );
      }
    } catch (error) {
      console.error("Error opening WhatsApp chat:", error);
      toast.error(
        "Unable to open WhatsApp. Please try calling directly.",
      );
    }
  };

  const handleWhatsAppCall = () => {
    try {
      if (!whatsAppConfig.enabled) {
        toast.error(
          "WhatsApp integration is currently disabled.",
        );
        return;
      }

      window.open(whatsAppConfig.callUrl, "_self");

      // Track call interaction
      try {
        SecurityUtils.trackEvent("whatsapp_call_clicked", {
          timestamp: new Date().toISOString(),
        });
      } catch (trackingError) {
        console.warn(
          "Error tracking call interaction:",
          trackingError,
        );
      }
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error(
        "Unable to initiate call. Please dial manually: " +
          whatsAppConfig.businessNumber,
      );
    }
  };

  const backgroundFallback = (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
  );

  return (
    <div className="relative">
      {/* Three.js Animated Background */}
      {shouldRender && (
        <React.Suspense fallback={backgroundFallback}>
          <DynamicContactBackground />
        </React.Suspense>
      )}
      {(isLoading || hasError) && backgroundFallback}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ShimmerText className="text-4xl md:text-5xl text-foreground mb-6">
              Contact Us
            </ShimmerText>
            <p className="text-lg text-muted-foreground">
              Ready to start your next project? Get in touch
              with our team to discuss how we can help transform
              your business.
            </p>
          </div>
        </div>
      </section>

      <div className="py-20 bg-card/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl text-foreground mb-6">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground mb-8">
                  We're here to help and answer any question you
                  might have. We look forward to hearing from
                  you.
                </p>
              </div>

              <div className="space-y-6">
                <HoverShimmer>
                  <ShimmerCard
                    variant="glow"
                    className="p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50"
                  >
                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-foreground mb-2">
                          Email
                        </h3>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  </ShimmerCard>
                </HoverShimmer>

                <HoverShimmer>
                  <ShimmerCard
                    variant="glow"
                    className="p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50"
                  >
                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-foreground mb-2">
                          Phone
                        </h3>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  </ShimmerCard>
                </HoverShimmer>

                <HoverShimmer>
                  <ShimmerCard
                    variant="glow"
                    className="p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50"
                  >
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-foreground mb-2">
                          Location
                        </h3>
                        <p className="text-muted-foreground">
                          {contactInfo.address}
                        </p>
                      </div>
                    </div>
                  </ShimmerCard>
                </HoverShimmer>

                <HoverShimmer>
                  <ShimmerCard
                    variant="glow"
                    className="p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50"
                  >
                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-foreground mb-2">
                          Business Hours
                        </h3>
                        <p className="text-muted-foreground">
                          {contactInfo.businessHours}
                        </p>
                      </div>
                    </div>
                  </ShimmerCard>
                </HoverShimmer>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <h2 className="text-3xl text-foreground">
                    Send us a message
                  </h2>
                  <Shield
                    className="w-6 h-6 text-primary"
                    title="Secure Form"
                  />
                </div>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to
                  you as soon as possible.
                </p>
              </div>

              <ShimmerCard
                variant="glow"
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-foreground mb-2"
                      >
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className={`w-full bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                          errors.name
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }`}
                        placeholder="Enter your full name"
                        maxLength={100}
                        minLength={2}
                      />
                      {errors.name && (
                        <p
                          className="text-destructive text-sm mt-1"
                          role="alert"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-foreground mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className={`w-full bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                          errors.email
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }`}
                        placeholder="Enter your email address"
                        maxLength={254}
                      />
                      {errors.email && (
                        <p
                          className="text-destructive text-sm mt-1"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-foreground mb-2"
                      >
                        Company
                      </label>
                      <Input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        autoComplete="organization"
                        className={`w-full bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                          errors.company
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }`}
                        placeholder="Enter your company name"
                        maxLength={100}
                      />
                      {errors.company && (
                        <p
                          className="text-destructive text-sm mt-1"
                          role="alert"
                        >
                          {errors.company}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="whatsapp"
                        className="block text-foreground mb-2"
                      >
                        WhatsApp Number
                      </label>
                      <Input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        autoComplete="tel"
                        className={`w-full bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                          errors.whatsapp
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }`}
                        placeholder="+91 98765 43210"
                        maxLength={20}
                      />
                      {errors.whatsapp && (
                        <p
                          className="text-destructive text-sm mt-1"
                          role="alert"
                        >
                          {errors.whatsapp}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-foreground mb-2"
                    >
                      Subject *
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                        errors.subject
                          ? "border-destructive focus:border-destructive"
                          : ""
                      }`}
                      placeholder="Enter the subject"
                      maxLength={200}
                      minLength={5}
                    />
                    {errors.subject && (
                      <p
                        className="text-destructive text-sm mt-1"
                        role="alert"
                      >
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-foreground mb-2"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className={`w-full bg-background/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 resize-none ${
                        errors.message
                          ? "border-destructive focus:border-destructive"
                          : ""
                      }`}
                      placeholder="Tell us about your project..."
                      maxLength={2000}
                      minLength={10}
                    />
                    {errors.message && (
                      <p
                        className="text-destructive text-sm mt-1"
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      size="lg"
                      className="gradient-button px-12 py-6 shimmer-button"
                      disabled={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting
                        ? "Sending..."
                        : "Send Message"}
                    </Button>
                  </div>

                  {/* WhatsApp Integration Section */}
                  {whatsAppConfig.enabled && (
                    <div className="border-t border-border pt-6 mt-8">
                      <div className="text-center mb-6">
                        <h3 className="text-lg text-foreground mb-2">
                          Prefer instant communication?
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Connect with us directly via WhatsApp
                          for immediate response
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          type="button"
                          onClick={handleWhatsAppChat}
                          className="gradient-button px-6 py-3 shimmer-button flex items-center justify-center"
                          variant="default"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Chat on WhatsApp
                        </Button>

                        <Button
                          type="button"
                          onClick={handleWhatsAppCall}
                          className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 flex items-center justify-center transition-all duration-300"
                          variant="outline"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Call via WhatsApp
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        WhatsApp:{" "}
                        {whatsAppConfig.businessNumber}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>
                      Your data is protected with
                      enterprise-grade security
                    </span>
                  </div>
                </form>
              </ShimmerCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}