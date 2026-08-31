/**
 * TK Web Solutions — Central Business, Pricing & Service Catalog Configuration
 * Single source of truth for services, standardized pricing, maintenance plans, lead capture, and WhatsApp CTAs.
 */

window.TK_CONFIG = {
  business: {
    name: "TK Web Solutions",
    tagline: "From Dreams.... to Digital Reality",
    positioning: "Founder-led Web & App Development Studio",
    founder: "Tarun Singh",
    founderTitle: "Founder & Lead Developer",
    education: "BBA in Digital Marketing • Manipal University Jaipur",
    address: "Bharatpur, Rajasthan, 321001, India",
    phone: "+91 90793 68240",
    phoneClean: "919079368240",
    email: "tkwebsolution1301@gmail.com",
    website: "https://tkwebsolutions.in",
    logoPath: "logo.png",
    signaturePath: "assets/tarun-singh-signature.png",
    upiId: "9079368240@ybl",
    invoicePrefix: "TK-INV-2026-",
    quotePrefix: "TK-QUO-2026-",
    currency: "INR",
    currencySymbol: "₹"
  },

  razorpay: {
    keyId: "rzp_live_T3mcmKzaGbCA8j",
    themeColor: "#0052ff",
    companyName: "TK Web Solutions"
  },

  api: {
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbyVscaGuEj3V9YkeYJ3TpACLHdwRXHivcHWjnk7vPWFEoW0gBxskIWi0WQTGTCPYK1I6A/exec",
    spreadsheetId: "1MEpLHMm4ShYWsaJBH7jN1L59WKA81JwMsP_mmmRU06M",
    backendUrl: "/api"
  },

  // 3 Primary High-Impact Sales Offers (Homepage focus)
  offers: [
    {
      id: "offer-online",
      title: "Get Your Business Online",
      subtitle: "Professional Business Website",
      startingPrice: 9999,
      ctaText: "GET FREE DEMO",
      ctaLink: "https://wa.me/919079368240?text=" + encodeURIComponent("Hi Tarun, I found TK Web Solutions and I'm interested in getting a professional website for my business. Please share the details.")
    },
    {
      id: "offer-local-seo",
      title: "Get More Local Customers",
      subtitle: "Website + Local SEO & Online Presence",
      startingPrice: 14999,
      ctaText: "GET FREE AUDIT",
      ctaLink: "#free-audit"
    },
    {
      id: "offer-app",
      title: "Turn Your Business Into An App",
      subtitle: "Native Android Application Development",
      startingPrice: 14999,
      ctaText: "DISCUSS MY APP",
      ctaLink: "https://wa.me/919079368240?text=" + encodeURIComponent("Hi Tarun, I'm interested in developing an Android app for my business. I would like to discuss my requirements.")
    }
  ],

  // Central Standard Price List (Single Source of Truth)
  catalog: {
    websites: [
      {
        id: "starter-web",
        name: "Starter Business Website",
        price: 9999,
        category: "Website",
        delivery: "5-7 Days",
        ctaText: "GET MY WEBSITE",
        badge: "Essential",
        desc: "For small businesses that need a clean, professional online presence.",
        features: [
          "Responsive mobile-first website (Up to 5 sections/pages)",
          "Business overview, services & contact section",
          "One-click WhatsApp & call integration",
          "Interactive Google Maps location embed",
          "Direct inquiry & lead contact form",
          "Basic SEO-ready meta & speed optimization",
          "Fast cloud hosting setup & domain connection",
          "30 days founder-level technical warranty & support"
        ]
      },
      {
        id: "pro-web",
        name: "Professional Business Website",
        price: 14999,
        category: "Website",
        delivery: "5-7 Days",
        ctaText: "GET A FREE DEMO",
        badge: "Most Popular",
        desc: "For businesses wanting a stronger commercial brand and higher lead conversions.",
        features: [
          "Everything in Starter Plan",
          "Multi-page structured layout with high-converting UI/UX",
          "Dedicated lead capture & inquiry forms",
          "Social media integration & trust badges",
          "Enhanced on-page SEO & JSON-LD schema markup",
          "Speed & mobile responsiveness testing",
          "30 days dedicated support & minor updates"
        ]
      },
      {
        id: "business-coaching-pro",
        name: "Business / Coaching Pro",
        price: 19999,
        category: "Website",
        delivery: "7-10 Days",
        ctaText: "DISCUSS MY WEBSITE",
        badge: "Growth",
        desc: "For coaching institutes, schools, consultants, and established service businesses.",
        features: [
          "Everything in Professional Plan",
          "Batches, fee structure, faculty profiles & gallery",
          "Student/client inquiry & admission capture form",
          "Notice board / updates section",
          "Local SEO optimization (Google Business Profile ready)",
          "Interactive WhatsApp direct lead routing",
          "30 days founder assistance & warranty"
        ]
      },
      {
        id: "ecommerce-web",
        name: "E-Commerce Website",
        price: 24999,
        isStartingFrom: true,
        category: "Website",
        delivery: "10-14 Days",
        ctaText: "GET E-COMMERCE QUOTE",
        badge: "Commercial",
        desc: "For online stores selling products with online payment and ordering workflows.",
        features: [
          "Complete product catalog with categories & search",
          "Shopping cart & direct WhatsApp order system",
          "Razorpay / UPI online payment gateway setup",
          "Order notification & client invoice generation",
          "Mobile-optimized checkout & shipping configuration",
          "Final price tailored to product count & admin workflow",
          "30 days technical support & staff guidance"
        ]
      }
    ],

    applications: [
      {
        id: "android-apk",
        name: "Android App (APK)",
        price: 14999,
        isStartingFrom: true,
        category: "Application",
        delivery: "7-10 Days",
        ctaText: "DISCUSS MY APP",
        badge: "Fast Delivery",
        desc: "Direct shareable Android APK for client portfolios, staff, or customer utilities.",
        features: [
          "Native Android app built with modern Android Studio / Flutter",
          "Direct APK file — easy to share on WhatsApp or website download",
          "Push notifications & offline usability",
          "WhatsApp lead & contact buttons",
          "Custom branding, logo, and smooth UI/UX",
          "Final price tailored to exact feature requirements"
        ]
      },
      {
        id: "playstore-app",
        name: "Android + Play Store",
        price: 24999,
        isStartingFrom: true,
        category: "Application",
        delivery: "10-14 Days",
        ctaText: "BUILD MY APP",
        badge: "Full Launch",
        desc: "Complete Android application published directly on the Google Play Store.",
        features: [
          "Everything in Android App plan",
          "Google Play Store submission & policy compliance setup",
          "App icon, store screenshots & promotional graphics",
          "Push notifications & analytics integration",
          "Play Console release management & guidance"
        ]
      },
      {
        id: "custom-app",
        name: "Custom Application",
        price: 39999,
        isStartingFrom: true,
        category: "Application",
        delivery: "14-21 Days",
        ctaText: "REQUEST CUSTOM QUOTE",
        badge: "Enterprise",
        desc: "For advanced portals, multi-role management dashboards, and custom software systems.",
        features: [
          "Tailored full-stack application architecture",
          "Admin panel, database & role-based authentication",
          "API integrations & custom workflow automation",
          "Quotation-based scope with clear milestone delivery"
        ]
      }
    ],

    // TK Web Solutions Care & Support Plans (Recurring Revenue)
    maintenance: [
      {
        id: "care-standard",
        name: "TK Web Solutions Care & Support",
        price: 2999,
        interval: "month",
        category: "Maintenance",
        badge: "Recommended",
        ctaText: "KEEP MY WEBSITE RUNNING",
        desc: "Keep your website secure, fast, updated and error-free every month.",
        features: [
          "Technical maintenance & uptime monitoring",
          "Up to 3 minor content / banner / text updates per month",
          "Website health checks & broken links repair",
          "Core security checks & cloud backup",
          "Priority WhatsApp support directly from founder"
        ]
      }
    ],

    addons: [
      { id: "addon-audit", name: "Free 5-Minute Website Audit", price: 0, category: "LeadMagnet", desc: "Expert assessment of your website or online presence" },
      { id: "addon-maintenance", name: "Website Maintenance (Monthly)", price: 2999, category: "Support", desc: "TK Web Solutions Care & Support Plan" },
      { id: "addon-advance", name: "Advance Project Milestone Payment", price: 0, isCustom: true, category: "Custom", desc: "Advance payment towards your agreed project scope" },
      { id: "addon-remaining", name: "Final Project Delivery Payment", price: 0, isCustom: true, category: "Custom", desc: "Final balance payment upon project sign-off" },
      { id: "addon-test", name: "Live ₹1 Test Payment", price: 1, category: "Test", desc: "Live instant ₹1 test payment for QR/UPI verification" },
      { id: "addon-custom", name: "Custom Tailored Digital Service", price: 0, isCustom: true, category: "Custom", desc: "Custom tailored service agreed with TK Web Solutions" }
    ]
  },

  // WhatsApp Intent Message Templates
  whatsapp: {
    businessWebsite: "Hi Tarun, I found TK Web Solutions and I'm interested in getting a professional website for my business. Please share the details.",
    androidApp: "Hi Tarun, I'm interested in developing an Android app for my business. I would like to discuss my requirements.",
    freeAudit: "Hi Tarun, I would like to get a free website/online presence audit for my business.",
    ecommerce: "Hi Tarun, I'm interested in an e-commerce website and would like to discuss my requirements.",
    customProject: "Hi Tarun, I have a custom digital project and would like to discuss the requirements with you.",
    referral: "Hi Tarun, I know a business that needs a website or app. I would like to refer them to TK Web Solutions.",
    general: "Hi Tarun, I'm interested in discussing a project with TK Web Solutions."
  },

  // Helper Methods
  getWhatsAppUrl: function(type, customText) {
    var msg = customText || this.whatsapp[type] || this.whatsapp.general;
    return "https://wa.me/" + this.business.phoneClean + "?text=" + encodeURIComponent(msg);
  },

  formatINR: function(amount) {
    return "₹" + parseInt(amount || 0).toLocaleString("en-IN");
  }
};
