/* ═══════════════════════════════════════════════════════════════
   TK NEXUS AI — Universal AI Assistant for TK Web Solutions
   Include on any page: <script src="ai-assistant.js"></script>
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  const CFG = {
    name: 'TK Nexus AI',
    welcome: '👋 Hi! I\'m TK Nexus AI. How can I help you today?',
    waNumber: '919079368240',
  };

  const PRICES = {
    'coaching website': { base: 7000, pages: '8-10' },
    'school website': { base: 10000, pages: '10-15' },
    'business website': { base: 7000, pages: '5-8' },
    'e-commerce website': { base: 15000, pages: '15-20' },
    'portfolio website': { base: 5000, pages: '3-5' },
    'hospital website': { base: 10000, pages: '8-12' },
    'e-mitra website': { base: 8000, pages: '5-8' },
    'android app': { base: 10000, type: 'APK' },
    'play store app': { base: 18000, type: 'Play Store' },
    'ios app': { base: 25000, type: 'iOS' },
    'android + ios': { base: 35000, type: 'Both' },
  };

  const ADDONS = {
    'payment gateway': 3000,
    'whatsapp integration': 0,
    'seo': 0,
    'blog': 2000,
    'admin panel': 5000,
    'hosting': 0,
    'domain': 800,
    'ssl': 0,
    'google analytics': 0,
    'live chat': 1500,
  };

  const style = document.createElement('style');
  style.textContent = `
    :root { --tkai-primary:#1a56ff; --tkai-accent:#00e5ff; --tkai-green:#25d366; --tkai-gold:#f59e0b; --tkai-navy:#060d1f; }
    [data-theme="dark"] .tkai-window { --tkai-bg:#0a0f1e; --tkai-card:#0f172a; --tkai-border:rgba(26,86,255,0.15); --tkai-text:#f8fafc; --tkai-text2:#94a3b8; --tkai-user:#1a56ff; }
    .tkai-wrap { position:fixed; bottom:20px; right:20px; z-index:10000; font-family:'DM Sans',system-ui,sans-serif; }
    .tkai-fab { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,var(--tkai-primary),var(--tkai-accent)); color:#fff; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 8px 32px rgba(26,86,255,0.35); transition:all 0.35s cubic-bezier(0.23,1,0.32,1); position:relative; }
    .tkai-fab:hover { transform:scale(1.08) translateY(-3px); box-shadow:0 12px 40px rgba(26,86,255,0.45); }
    .tkai-fab.pulse { animation:tkaiPulse 2s infinite; }
    @keyframes tkaiPulse { 0%,100% { box-shadow:0 8px 32px rgba(26,86,255,0.35); } 50% { box-shadow:0 8px 40px rgba(26,86,255,0.6); } }
    .tkai-fab .tkai-badge { position:absolute; top:-2px; right:-2px; width:18px; height:18px; background:var(--tkai-gold); border-radius:50%; border:2px solid #fff; animation:tkaiBadge 2s infinite; }
    @keyframes tkaiBadge { 0%,100% { transform:scale(1); } 50% { transform:scale(1.2); } }
    .tkai-window { --tkai-bg:#ffffff; --tkai-card:#f8faff; --tkai-border:rgba(26,86,255,0.1); --tkai-text:#060d1f; --tkai-text2:#6b7280; --tkai-user:linear-gradient(135deg,#1a56ff,#00e5ff); position:fixed; bottom:90px; right:20px; width:380px; max-width:calc(100vw - 40px); height:560px; max-height:calc(100vh - 120px); border-radius:24px; border:1.5px solid var(--tkai-border); background:var(--tkai-bg); box-shadow:0 24px 80px rgba(0,0,0,0.15); display:flex; flex-direction:column; overflow:hidden; opacity:0; transform:translateY(20px) scale(0.95); pointer-events:none; transition:all 0.4s cubic-bezier(0.23,1,0.32,1); }
    .tkai-window.open { opacity:1; transform:translateY(0) scale(1); pointer-events:all; }
    .tkai-header { padding:16px 20px; background:linear-gradient(135deg,var(--tkai-primary),#4f46e5); color:#fff; display:flex; align-items:center; gap:12px; position:relative; flex-shrink:0; }
    .tkai-header-avatar { width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:1.1rem; backdrop-filter:blur(8px); }
    .tkai-header-info h4 { font-size:.95rem; font-weight:700; margin:0; }
    .tkai-header-status { display:flex; align-items:center; gap:4px; font-size:.68rem; font-weight:600; }
    .tkai-header-status .dot { width:7px; height:7px; border-radius:50%; background:#4ade80; animation:tkaiBlink 2s infinite; }
    @keyframes tkaiBlink { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    .tkai-header-close { position:absolute; right:14px; top:50%; transform:translateY(-50%); width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.15); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.85rem; transition:background 0.2s; }
    .tkai-header-close:hover { background:rgba(255,255,255,0.25); }
    .tkai-messages { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:14px; scroll-behavior:smooth; }
    .tkai-messages::-webkit-scrollbar { width:4px; }
    .tkai-messages::-webkit-scrollbar-thumb { background:rgba(26,86,255,0.2); border-radius:4px; }
    .tkai-msg { display:flex; gap:8px; max-width:88%; animation:tkaiMsgIn 0.4s cubic-bezier(0.23,1,0.32,1); }
    .tkai-msg.tkai-ai { align-self:flex-start; }
    .tkai-msg.tkai-user { align-self:flex-end; flex-direction:row-reverse; }
    @keyframes tkaiMsgIn { from { opacity:0; transform:translateY(12px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
    .tkai-msg-avatar { width:28px; height:28px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:.75rem; }
    .tkai-ai .tkai-msg-avatar { background:linear-gradient(135deg,var(--tkai-primary),var(--tkai-accent)); color:#fff; }
    .tkai-user .tkai-msg-avatar { background:var(--tkai-user); color:#fff; }
    .tkai-msg-bubble { padding:10px 14px; border-radius:16px; font-size:.84rem; line-height:1.65; word-break:break-word; }
    .tkai-ai .tkai-msg-bubble { background:var(--tkai-card); border:1.5px solid var(--tkai-border); color:var(--tkai-text); border-top-left-radius:4px; }
    .tkai-user .tkai-msg-bubble { background:var(--tkai-user); color:#fff; border-top-right-radius:4px; }
    .tkai-msg-time { font-size:.65rem; color:var(--tkai-text2); margin-top:2px; padding:0 4px; }
    .tkai-typing { display:flex; align-items:center; gap:6px; padding:10px 14px; }
    .tkai-typing .dot { width:6px; height:6px; border-radius:50%; background:var(--tkai-text2); opacity:.4; animation:tkaiType 1.4s infinite; }
    .tkai-typing .dot:nth-child(2) { animation-delay:0.2s; }
    .tkai-typing .dot:nth-child(3) { animation-delay:0.4s; }
    @keyframes tkaiType { 0%,100% { opacity:.4; transform:translateY(0); } 50% { opacity:1; transform:translateY(-4px); } }
    .tkai-suggestions { display:flex; flex-wrap:wrap; gap:6px; padding:0 16px 10px; flex-shrink:0; }
    .tkai-suggestions.hidden { display:none; }
    .tkai-suggestion { padding:6px 12px; border-radius:50px; border:1.5px solid var(--tkai-border); background:var(--tkai-card); color:var(--tkai-text); font-size:.75rem; font-weight:600; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
    .tkai-suggestion:hover { background:var(--tkai-primary); color:#fff; border-color:var(--tkai-primary); transform:translateY(-1px); }
    .tkai-input-wrap { padding:12px 16px 16px; display:flex; gap:8px; flex-shrink:0; border-top:1px solid var(--tkai-border); }
    .tkai-input { flex:1; padding:10px 14px; border-radius:50px; border:1.5px solid var(--tkai-border); background:var(--tkai-card); color:var(--tkai-text); font-family:inherit; font-size:.85rem; outline:none; transition:all 0.2s; }
    .tkai-input:focus { border-color:var(--tkai-primary); box-shadow:0 0 0 3px rgba(26,86,255,0.08); }
    .tkai-input::placeholder { color:var(--tkai-text2); }
    .tkai-send { width:38px; height:38px; border-radius:50%; background:var(--tkai-primary); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.9rem; transition:all 0.2s; flex-shrink:0; }
    .tkai-send:hover { background:#0d3acc; transform:scale(1.05); }
    .tkai-send:disabled { opacity:.5; cursor:default; transform:none; }
    .tkai-wa-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; background:var(--tkai-green); color:#fff; font-size:.8rem; font-weight:700; text-decoration:none; margin-top:6px; transition:all 0.2s; }
    .tkai-wa-btn:hover { background:#1ebe5d; transform:translateY(-1px); }
    .tkai-quote-box { background:var(--tkai-card); border:1.5px solid var(--tkai-border); border-radius:12px; padding:14px; margin-top:8px; font-size:.78rem; }
    .tkai-quote-box .qt-row { display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid var(--tkai-border); }
    .tkai-quote-box .qt-row:last-child { border-bottom:none; font-weight:700; font-size:.9rem; color:var(--tkai-primary); }
    .tkai-quote-box .qt-lbl { color:var(--tkai-text2); }
    .tkai-quote-box .qt-val { color:var(--tkai-text); font-weight:600; }
    .tkai-link { color:var(--tkai-primary); font-weight:700; text-decoration:none; }
    .tkai-link:hover { text-decoration:underline; }
    .tkai-quick-btns { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
    .tkai-qbtn { padding:5px 10px; border-radius:6px; border:1.5px solid var(--tkai-border); background:transparent; color:var(--tkai-text); font-size:.75rem; font-weight:600; cursor:pointer; transition:all 0.2s; text-decoration:none; }
    .tkai-qbtn:hover { background:var(--tkai-primary); color:#fff; border-color:var(--tkai-primary); }
    .tkai-toast { position:fixed; top:20px; left:50%; transform:translateX(-50%) translateY(-20px); background:var(--tkai-navy); color:#fff; padding:10px 20px; border-radius:50px; font-size:.85rem; font-weight:600; opacity:0; transition:all 0.3s; z-index:10001; pointer-events:none; }
    .tkai-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
    @media (max-width:480px) { .tkai-window { right:10px; left:10px; width:auto; bottom:80px; max-height:calc(100vh - 100px); border-radius:20px; } .tkai-wrap { right:10px; bottom:10px; } .tkai-fab { width:50px; height:50px; font-size:1.2rem; } }
  `;
  document.head.appendChild(style);

  let history = JSON.parse(localStorage.getItem('tkai_history') || '[]');
  if (history.length > 50) history = history.slice(-50);

  const wrap = document.createElement('div');
  wrap.className = 'tkai-wrap';
  wrap.innerHTML = `
    <button class="tkai-fab pulse" id="tkaiFab" aria-label="Open chat assistant" title="TK Nexus AI">
      <i class="fas fa-robot"></i><span class="tkai-badge"></span>
    </button>
    <div class="tkai-window" id="tkaiWin" role="dialog" aria-label="TK Nexus AI Chat">
      <div class="tkai-header">
        <div class="tkai-header-avatar">🤖</div>
        <div class="tkai-header-info">
          <h4>TK Nexus AI</h4>
          <div class="tkai-header-status"><span class="dot"></span> Online</div>
        </div>
        <button class="tkai-header-close" id="tkaiClose" aria-label="Close chat">✕</button>
      </div>
      <div class="tkai-messages" id="tkaiMsgs" role="log" aria-live="polite"></div>
      <div class="tkai-suggestions" id="tkaiSugs">
        <button class="tkai-suggestion" data-q="Website pricing kya hai?">💰 Pricing</button>
        <button class="tkai-suggestion" data-q="Coaching website kitne mein banta hai?">📚 Coaching</button>
        <button class="tkai-suggestion" data-q="Android app ka price?">📱 App</button>
        <button class="tkai-suggestion" data-q="Portfolio dikhayo">🎨 Portfolio</button>
        <button class="tkai-suggestion" data-q="Meeting book karo">📅 Book</button>
        <button class="tkai-suggestion" data-q="Trust center kya hai?">🛡️ Trust</button>
      </div>
      <div class="tkai-input-wrap">
        <input type="text" class="tkai-input" id="tkaiInput" placeholder="Type a message..." aria-label="Chat message" autocomplete="off">
        <button class="tkai-send" id="tkaiSend" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
    <div class="tkai-toast" id="tkaiToast"></div>
  `;
  document.body.appendChild(wrap);

  const fab = document.getElementById('tkaiFab');
  const win = document.getElementById('tkaiWin');
  const msgs = document.getElementById('tkaiMsgs');
  const input = document.getElementById('tkaiInput');
  const sendBtn = document.getElementById('tkaiSend');
  const sugs = document.getElementById('tkaiSugs');
  const closeBtn = document.getElementById('tkaiClose');
  const toast = document.getElementById('tkaiToast');

  let isOpen = false, isTyping = false;

  function toggle() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    fab.classList.toggle('pulse', !isOpen);
    if (isOpen) { input.focus(); scrollBottom(); if (msgs.children.length === 0) addAIMsg(CFG.welcome); }
  }
  fab.addEventListener('click', toggle);
  closeBtn.addEventListener('click', toggle);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) toggle(); });

  function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 3000); }
  function now() { return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }
  function saveHistory() { localStorage.setItem('tkai_history', JSON.stringify(history)); }

  function addMsg(who, html) {
    const div = document.createElement('div');
    div.className = `tkai-msg tkai-${who}`;
    div.innerHTML = `<div class="tkai-msg-avatar">${who==='ai'?'🤖':'👤'}</div><div><div class="tkai-msg-bubble">${html}</div><div class="tkai-msg-time">${now()}</div></div>`;
    msgs.appendChild(div); scrollBottom();
    history.push({who, html, t:Date.now()}); saveHistory();
  }
  function addAIMsg(text) { addMsg('ai', text); }
  function addUserMsg(text) { addMsg('user', text); }

  function showTyping() {
    if (isTyping) return; isTyping = true;
    const div = document.createElement('div'); div.className = 'tkai-msg tkai-ai'; div.id = 'tkaiTyping';
    div.innerHTML = `<div class="tkai-msg-avatar">🤖</div><div class="tkai-msg-bubble tkai-typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    msgs.appendChild(div); scrollBottom();
  }
  function hideTyping() { const t = document.getElementById('tkaiTyping'); if (t) t.remove(); isTyping = false; }
  function scrollBottom() { msgs.scrollTop = msgs.scrollHeight; }
  function waLink(text) { return `https://wa.me/${CFG.waNumber}?text=${encodeURIComponent(text)}`; }

  function getPriceReply(key) {
    const p = PRICES[key];
    if (!p) return `Sorry, mujhe exact price nahi mila. <a href="${waLink('Hi! I want to know pricing for: ' + key)}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> WhatsApp Pe Poochho</a>`;
    return `💰 <strong>${key.toUpperCase()}</strong><br><br>• Base Price: <strong>₹${p.base.toLocaleString()}</strong><br>• Pages: ${p.pages || p.type}<br>• Delivery: 5-7 days<br>• 30 days free support included<br><br>Features included: WhatsApp button, contact form, mobile friendly, SEO ready, Google Maps.<br><br><a href="${waLink(`Hi! I want a ${key}. My requirements are...`)}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> Get Exact Quote on WhatsApp</a>`;
  }

  function getReply(text) {
    const q = text.toLowerCase();
    if (q.includes('price') || q.includes('cost') || q.includes('kitne') || q.includes('rate') || q.includes('pricing') || q.includes('₹')) {
      if (q.includes('coaching')) return getPriceReply('coaching website');
      if (q.includes('school') || q.includes('college')) return getPriceReply('school website');
      if (q.includes('business') || q.includes('shop') || q.includes('local')) return getPriceReply('business website');
      if (q.includes('e-commerce') || q.includes('ecommerce') || q.includes('shopping') || q.includes('online store')) return getPriceReply('e-commerce website');
      if (q.includes('portfolio') || q.includes('personal')) return getPriceReply('portfolio website');
      if (q.includes('hospital') || q.includes('clinic') || q.includes('health')) return getPriceReply('hospital website');
      if (q.includes('e-mitra') || q.includes('emitra') || q.includes('csc')) return getPriceReply('e-mitra website');
      if (q.includes('android') || q.includes('apk')) return getPriceReply('android app');
      if (q.includes('play store') || q.includes('playstore')) return getPriceReply('play store app');
      if (q.includes('ios') || q.includes('iphone')) return getPriceReply('ios app');
      if (q.includes('both') || q.includes('android + ios')) return getPriceReply('android + ios');
      return `Hamare packages:<br><br>• Starter Website: <strong>₹7,000</strong><br>• Business Website: <strong>₹10,000 - ₹15,000</strong><br>• E-Commerce: <strong>₹15,000+</strong><br>• Android App: <strong>₹10,000</strong><br>• Play Store App: <strong>₹18,000</strong><br><br>Konsa type chahiye?`;
    }
    if (q.includes('app') || q.includes('application') || q.includes('mobile')) {
      return `Android App (APK) = <strong>₹10,000</strong><br>Play Store App = <strong>₹18,000</strong><br>Android + iOS Both = <strong>₹35,000</strong><br><br>App mein: Design, Development, APK generation, Play Store publish support.<br><a href="${waLink('Hi! I want to develop an Android app. Please guide me.')}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> WhatsApp Pe Discuss Karo</a>`;
    }
    if (q.includes('seo') || q.includes('google') || q.includes('rank') || q.includes('search')) {
      return `SEO <strong>free included</strong> hai! 🎯<br><br>• On-page SEO (meta tags, schema)<br>• Mobile optimization<br>• Fast loading speed<br>• Google indexing ready<br>• Structured data markup<br><br><a href="${waLink('Hi! I want SEO services for my website.')}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> SEO Consultation</a>`;
    }
    if (q.includes('portfolio') || q.includes('work') || q.includes('project') || q.includes('example') || q.includes('dikhayo') || q.includes('sample')) {
      return `Hamare top projects:<br><br>🎓 <a href="https://tarunsinghgunesh.github.io/ACHIEVERSPOINT/" target="_blank" class="tkai-link">Achievers Point Coaching</a><br>🌱 <a href="https://tarunsinghgunesh.github.io/ekpahalindia/" target="_blank" class="tkai-link">Ek Pahal India NGO</a><br>🛒 <a href="https://tarunsinghgunesh.github.io/chirag-handlooms-e-commerce-/" target="_blank" class="tkai-link">Chirag Handlooms</a><br>🏪 <a href="https://tarunsinghgunesh.github.io/supportsmallbusiness/" target="_blank" class="tkai-link">Support Small Business</a><br>🏛️ <a href="https://tarunsinghgunesh.github.io/dhruvemitra/" target="_blank" class="tkai-link">Dhruv E-Mitra</a><br><br><a href="portfolio.html" class="tkai-link">View Full Portfolio →</a>`;
    }
    if (q.includes('trust') || q.includes('certificate') || q.includes('msme') || q.includes('verify') || q.includes('government') || q.includes('legit')) {
      return `Fully verified! ✅<br><br>• MSME Registered (Govt of India)<br>• Udyam Registration verified<br>• Based in Bharatpur, Rajasthan<br>• 100+ projects delivered<br>• 4.8/5 Google Reviews<br><br><a href="trust.html" class="tkai-link">Visit Trust Center →</a><br><a href="trust.html#gov-verify" class="tkai-link">Verify MSME Certificate →</a>`;
    }
    if (q.includes('book') || q.includes('meeting') || q.includes('appointment') || q.includes('call') || q.includes('consultation') || q.includes('schedule') || q.includes('baat') || q.includes('milna')) {
      return `Free consultation book kar sakte ho! 📅<br><br>• 15-minute free call<br>• Google Meet / Phone / WhatsApp<br>• In-person at Bharatpur office<br><br><div class="tkai-quick-btns"><a href="trust.html#consultation" class="tkai-qbtn">Book Online</a><a href="${waLink('Hi! I want to book a free consultation. My name is: ')}" target="_blank" class="tkai-qbtn">WhatsApp</a></div>`;
    }
    if (q.includes('lead') || q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('call kare')) {
      return `Contact details:<br><br>📱 <strong>+91 90793 68240</strong><br>📧 tkwebsolution1301@gmail.com<br>📍 Bharatpur, Rajasthan<br>🌐 tkwebsolutions.in<br><br><a href="${waLink('Hi TK Web Solutions! I am interested in your services. Please contact me.')}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>`;
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('namaste') || q.includes('hey') || q.includes('hola')) {
      return `👋 Namaste! Main TK Nexus AI hoon. Aapko kya help chahiye?<br><br>• Pricing pata karo<br>• Portfolio dekho<br>• Meeting book karo<br>• Trust center visit karo<br>• Ya kuch bhi poochho!`;
    }
    if (q.includes('time') || q.includes('kitna') || q.includes('delivery') || q.includes('days') || q.includes('din')) {
      return `Delivery time:<br><br>• Simple Website: <strong>5-7 days</strong><br>• Business Website: <strong>7-10 days</strong><br>• E-Commerce: <strong>10-14 days</strong><br>• Android App: <strong>7-10 days</strong><br>• Play Store App: <strong>10-14 days</strong><br><br>Fast delivery guarantee! 🚀`;
    }
    if (q.includes('support') || q.includes('help') || q.includes('service') || q.includes('maintenance')) {
      return `Support details:<br><br>• <strong>30 days free</strong> technical support<br>• WhatsApp support available<br>• Email: tkwebsolution1301@gmail.com<br>• Phone: +91 90793 68240<br>• Lifetime minor changes (reasonable fees)<br><br>Har project pe full commitment! 💪`;
    }
    if (q.includes('generate') || q.includes('quotation') || q.includes('quote') || q.includes('estimate') || q.includes('calculator')) {
      return `Instant quotation generate karna hai? 👇<br><br><a href="pricing-calculator.html" class="tkai-link">🧮 Interactive Pricing Calculator</a><br><br>Features select karo, instant price milega!<br><br><a href="${waLink('Hi! I want a custom quotation for my project.')}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> Custom Quote</a>`;
    }
    if (q.includes('about') || q.includes('company') || q.includes('who') || q.includes('tarun') || q.includes('founder')) {
      return `TK Web Solutions ek Bharatpur, Rajasthan based software company hai. Founder: <strong>Tarun Singh</strong>.<br><br>• 100+ projects delivered<br>• MSME Registered<br>• 5+ years experience<br>• Specialization: Websites & Apps<br><br><a href="founder.html" class="tkai-link">Founder Page →</a>`;
    }
    return `Main samajh gaya! 👍<br><br>Aapko exact help chahiye toh humare team se directly baat karo:<br><br><a href="${waLink('Hi TK Web Solutions! I have a question: ' + text)}" target="_blank" class="tkai-wa-btn"><i class="fab fa-whatsapp"></i> Ask on WhatsApp</a><br><br>Ya koi aur suggestion:<br><div class="tkai-quick-btns"><a href="pricing-calculator.html" class="tkai-qbtn">💰 Pricing</a><a href="trust.html" class="tkai-qbtn">🛡️ Trust</a><a href="portfolio.html" class="tkai-qbtn">🎨 Portfolio</a></div>`;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addUserMsg(text);
    sugs.classList.add('hidden');
    showTyping();
    setTimeout(() => {
      hideTyping();
      addAIMsg(getReply(text));
    }, 600 + Math.random() * 800);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  document.querySelectorAll('.tkai-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      input.value = q; sendMessage();
    });
  });

  // Restore history on open
  if (history.length > 0) {
    history.forEach(h => {
      const div = document.createElement('div');
      div.className = `tkai-msg tkai-${h.who}`;
      div.innerHTML = `<div class="tkai-msg-avatar">${h.who==='ai'?'🤖':'👤'}</div><div><div class="tkai-msg-bubble">${h.html}</div><div class="tkai-msg-time">${new Date(h.t).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div>`;
      msgs.appendChild(div);
    });
  }

  // Proactive greeting after 30s
  setTimeout(() => {
    if (!isOpen && msgs.children.length === 0) {
      fab.classList.add('pulse');
      showToast('👋 Need help? Ask TK Nexus AI!');
    }
  }, 30000);
})();
