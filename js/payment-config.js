/**
 * TK Web Solutions — Central Payment & Service Catalog Configuration
 * Single source of truth for services, pricing, maintenance plans, and business details.
 */

window.TK_CONFIG = {
  business: {
    name: "TK Web Solutions",
    tagline: "From Dreams.... to Digital Reality",
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
    currency: "INR",
    currencySymbol: "₹"
  },

  razorpay: {
    keyId: "rzp_live_T3mcmKzaGbCA8j",
    themeColor: "#0052ff",
    companyName: "TK Web Solutions"
  },

  api: {
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbwpV7Bz3YGT87PWaezn1fBKc5GQYQETJjHqqxCPohHKGkXWZIVlHFg8tUipPbTP7Cy4Sw/exec",
    spreadsheetId: "1MEpLHMm4ShYWsaJBH7jN1L59WKA81JwMsP_mmmRU06M",
    backendUrl: "/api" // Node.js / Serverless API mount point
  },

  // Central Service Catalog (Website Services, Apps, Maintenance & Support)
  catalog: {
    websites: [
      { id: "portfolio-web", name: "Portfolio Website", price: 9999, category: "Website", delivery: "5-7 Days", desc: "Personal branding, portfolio showcase, bio, contact & social links" },
      { id: "emitra-web", name: "E-Mitra Website", price: 11999, category: "Website", delivery: "5-7 Days", desc: "Online service list, certificate assistance, rate card & customer lead form" },
      { id: "redesign-web", name: "Website Redesign", price: 11999, category: "Website", delivery: "5-7 Days", desc: "Modern visual upgrade, 100% mobile responsiveness, speed optimization" },
      { id: "starter-web", name: "Starter Website", price: 14999, category: "Website", delivery: "5-7 Days", desc: "Fast 5-page business site, modern UI, SEO essentials, WhatsApp CTA" },
      { id: "coaching-web", name: "Coaching Website", price: 14999, category: "Website", delivery: "5-7 Days", desc: "Batches, fee structure, faculty profiles, results & student inquiry form" },
      { id: "business-web", name: "Business Website", price: 17999, category: "Website", delivery: "5-7 Days", desc: "Full commercial presence, service showcase, trust badges & lead capture" },
      { id: "school-web", name: "School Website", price: 19999, category: "Website", delivery: "7-10 Days", desc: "Admissions, notices, faculty directory, gallery & parent inquiry system" },
      { id: "ecommerce-web", name: "E-Commerce Website", price: 19999, category: "Website", delivery: "7-10 Days", desc: "Product catalog, cart, online payment gateway & order notification system" }
    ],

    applications: [
      { id: "android-apk", name: "Android App (APK)", price: 14999, category: "Application", delivery: "7-10 Days", desc: "Fast Android application APK with custom branding & offline capability" },
      { id: "playstore-app", name: "Play Store App", price: 24999, category: "Application", delivery: "10-14 Days", desc: "Complete Google Play Store app with policy compliance & publication setup" },
      { id: "cross-platform-app", name: "Android + iOS App", price: 44999, category: "Application", delivery: "14-21 Days", desc: "Unified Flutter codebase running natively on both Android and iOS devices" }
    ],

    // TK Web Solutions Care & Support Plans (Monthly / Recurring)
    maintenance: [
      {
        id: "care-basic",
        name: "Basic Care",
        price: 1499,
        interval: "month",
        category: "Maintenance",
        badge: "Essential",
        desc: "Ideal for small websites needing routine checks and regular minor updates.",
        features: [
          "1 content or image update per month",
          "Monthly speed & uptime monitoring",
          "Core software & security check",
          "Standard email & WhatsApp support (24-48h)"
        ]
      },
      {
        id: "care-business",
        name: "Business Care",
        price: 3499,
        interval: "month",
        category: "Maintenance",
        badge: "Most Popular",
        desc: "For active coaching institutes, schools, and growing commercial businesses.",
        features: [
          "Up to 4 content / banner / batch updates",
          "Bi-weekly cloud backups & uptime check",
          "Priority WhatsApp & phone support (12-24h)",
          "Monthly performance & SEO review report",
          "Minor styling & layout adjustments"
        ]
      },
      {
        id: "care-growth",
        name: "Growth Care",
        price: 6999,
        interval: "month",
        category: "Maintenance",
        badge: "Pro Dedicated",
        desc: "Direct founder-level priority support for mission-critical digital platforms.",
        features: [
          "Unlimited routine text/image/page updates",
          "Weekly automated cloud backups",
          "Direct founder-level WhatsApp priority line",
          "Monthly feature improvements & optimization",
          "DNS, domain & server health management",
          "Emergency bugfix turnaround within 6 hours"
        ]
      }
    ],

    addons: [
      { id: "addon-maintenance", name: "Website Maintenance (One-Time)", price: 2499, category: "Support", desc: "Full site health check, speed cleanup & broken links fix" },
      { id: "addon-content", name: "Content / Banner Update", price: 1499, category: "Support", desc: "New pages, batch updates, pricing changes or banner refreshes" },
      { id: "addon-support", name: "Technical Support / Debugging", price: 1999, category: "Support", desc: "Fixing layout errors, script bugs, forms, or API connections" },
      { id: "addon-hosting", name: "Hosting / Deployment Setup", price: 2999, category: "Support", desc: "Custom domain connection, SSL certificate, CDN & Cloudflare setup" },
      { id: "addon-test", name: "Live ₹1 Test Payment", price: 1, category: "Test", desc: "Live instant ₹1 test payment for QR/UPI verification" },
      { id: "addon-advance", name: "Advance Project Payment", price: 0, isCustom: true, category: "Custom", desc: "Custom advance milestone payment towards your project" },
      { id: "addon-remaining", name: "Remaining Project Payment", price: 0, isCustom: true, category: "Custom", desc: "Final balance payment upon project sign-off" },
      { id: "addon-custom", name: "Other Digital Service", price: 0, isCustom: true, category: "Custom", desc: "Custom tailored service agreed with TK Web Solutions" }
    ]
  }
};
