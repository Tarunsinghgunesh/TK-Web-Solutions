/**
 * ============================================================
 * TK WEB SOLUTIONS — LUNA OFFICIAL LAUNCH ENGINE & AUTOMATION
 * ============================================================
 * Launch Timestamp: 1 September 2026, 11:11:00 AM IST (UTC+05:30)
 * Official LUNA Website: https://luna-website-flame.vercel.app/
 *
 * Features:
 * - Real-time countdown (Days, Hours, Minutes, Seconds)
 * - AUTO SWITCH to LIVE at exactly 11:11:00 AM IST on 1 Sept 2026
 * - Countdown block hides on LIVE, download button activates
 * - Download counter tracked in localStorage + Google Sheets
 * - Admin dashboard integration for download analytics
 */

(function (window, document) {
  'use strict';

  /* ────────────────────────────────────
     CONFIG
  ──────────────────────────────────── */
  var LUNA_CONFIG = {
    launchTimestamp: '2026-09-01T11:11:00+05:30',
    launchTargetTime: new Date('2026-09-01T11:11:00+05:30').getTime(),
    officialUrl: 'https://luna-website-flame.vercel.app/',
    appName: 'LUNA',
    tagline: "Women's Health & Sanctuary",
    motto: 'For You. With You. Always.',
    launchDateText: '1 September 2026 • 11:11 AM IST',
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbyVscaGuEj3V9YkeYJ3TpACLHdwRXHivcHWjnk7vPWFEoW0gBxskIWi0WQTGTCPYK1I6A/exec',
    downloadStorageKey: 'luna_download_count',
    downloadLogsKey: 'luna_download_logs'
  };

  window.LUNA_CONFIG = LUNA_CONFIG;

  /* ────────────────────────────────────
     STATE HELPERS
  ──────────────────────────────────── */
  window.getLunaLaunchState = function (overrideNow) {
    var now = overrideNow !== undefined ? overrideNow : Date.now();
    return now >= LUNA_CONFIG.launchTargetTime ? 'LIVE' : 'PRE_LAUNCH';
  };

  /* ────────────────────────────────────
     DOWNLOAD COUNTER
  ──────────────────────────────────── */
  function getLunaDownloadCount() {
    return parseInt(localStorage.getItem(LUNA_CONFIG.downloadStorageKey) || '0', 10);
  }

  function incrementLunaDownload() {
    var count = getLunaDownloadCount() + 1;
    localStorage.setItem(LUNA_CONFIG.downloadStorageKey, count);

    var logs = [];
    try { logs = JSON.parse(localStorage.getItem(LUNA_CONFIG.downloadLogsKey) || '[]'); } catch (e) {}
    logs.push({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Direct'
    });
    localStorage.setItem(LUNA_CONFIG.downloadLogsKey, JSON.stringify(logs));

    // Ping Apps Script to log download
    try {
      var url = LUNA_CONFIG.appsScriptUrl + '?action=lunaDownload&ts=' + encodeURIComponent(new Date().toISOString()) + '&ref=' + encodeURIComponent(document.referrer || 'Direct');
      var img = new Image();
      img.src = url;
    } catch (e) {}

    updateAllDownloadCounters();
    return count;
  }

  function updateAllDownloadCounters() {
    var count = getLunaDownloadCount();
    document.querySelectorAll('.luna-dl-count').forEach(function (el) {
      el.textContent = count;
    });
    document.querySelectorAll('.luna-dl-count-formatted').forEach(function (el) {
      el.textContent = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
    });
  }

  window.getLunaDownloadCount = getLunaDownloadCount;

  /* ────────────────────────────────────
     DOWNLOAD TRIGGER
  ──────────────────────────────────── */
  window.triggerLunaDownload = function () {
    if (window.getLunaLaunchState() === 'PRE_LAUNCH') {
      showLunaPreLaunchModal();
      return false;
    }
    var count = incrementLunaDownload();
    showLunaDownloadToast(count);
    // Open official website in new tab
    window.open(LUNA_CONFIG.officialUrl, '_blank', 'noopener,noreferrer');
    return true;
  };

  function showLunaDownloadToast(count) {
    var existing = document.getElementById('lunaDownloadToast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'lunaDownloadToast';
    toast.style.cssText = 'position:fixed;bottom:28px;right:22px;background:linear-gradient(135deg,#130926,#1d0c38);border:1.5px solid rgba(236,72,153,0.45);color:#fff;padding:16px 22px;border-radius:18px;z-index:10001;display:flex;align-items:center;gap:14px;box-shadow:0 16px 50px rgba(0,0,0,0.5),0 0 30px rgba(236,72,153,0.2);font-family:sans-serif;animation:lunaFadeIn .25s ease-out;min-width:280px;';
    toast.innerHTML =
      '<div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#ec4899,#9333ea);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🌙</div>' +
      '<div><div style="font-weight:800;font-size:.92rem;color:#fff;">Redirecting to Official LUNA Site!</div>' +
      '<div style="font-size:.75rem;color:#f472b6;margin-top:2px;">You are download #' + count + ' • Thank you! 💕</div></div>';
    document.body.appendChild(toast);
    setTimeout(function () { if (toast.parentNode) toast.remove(); }, 4500);
  }

  /* ────────────────────────────────────
     PRE-LAUNCH MODAL
  ──────────────────────────────────── */
  window.handleLunaPreLaunchClick = function (e) {
    if (window.getLunaLaunchState() === 'PRE_LAUNCH') {
      if (e && e.preventDefault) e.preventDefault();
      showLunaPreLaunchModal();
      return false;
    }
    // LIVE — let the click proceed OR trigger download
    return true;
  };

  function showLunaPreLaunchModal() {
    var existing = document.getElementById('lunaPreLaunchModal');
    if (existing) { existing.style.display = 'flex'; return; }

    // Build live mini-countdown inside modal
    var modal = document.createElement('div');
    modal.id = 'lunaPreLaunchModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(5,2,15,0.88);backdrop-filter:blur(14px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;animation:lunaFadeIn .25s ease-out;';

    modal.innerHTML =
      '<div style="background:linear-gradient(145deg,#130926,#1d0c38);border:1.5px solid rgba(236,72,153,0.35);border-radius:24px;padding:36px 28px;max-width:480px;width:100%;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.6),0 0 40px rgba(236,72,153,0.2);position:relative;color:#fff;">' +
        '<button onclick="document.getElementById(\'lunaPreLaunchModal\').style.display=\'none\'" style="position:absolute;top:14px;right:16px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;line-height:1;">&times;</button>' +
        '<div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#ec4899,#9333ea);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;box-shadow:0 8px 25px rgba(236,72,153,0.4);">🌙</div>' +
        '<div style="font-size:0.72rem;font-weight:800;color:#f472b6;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">OFFICIAL PRODUCT LAUNCH</div>' +
        '<h3 style="font-size:1.4rem;font-weight:800;color:#fff;margin:0 0 10px;font-family:sans-serif;">LUNA Launches 1 Sept • 11:11 AM IST</h3>' +
        '<p style="font-size:0.88rem;color:#cbd5e1;line-height:1.6;margin:0 0 18px;">The official release and direct download will go live right here at <strong>11:11 AM IST on 1 September 2026</strong>. Come back then!</p>' +

        // Mini live countdown inside modal
        '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:18px;" id="modalCdRow">' +
          '<div style="background:rgba(236,72,153,0.12);border:1px solid rgba(236,72,153,0.3);border-radius:10px;padding:8px 12px;min-width:52px;text-align:center;"><div id="modal-cd-days" style="font-size:1.3rem;font-weight:900;color:#fff;line-height:1;">--</div><div style="font-size:0.58rem;font-weight:800;color:#f472b6;text-transform:uppercase;letter-spacing:1px;margin-top:3px;">DAYS</div></div>' +
          '<div style="background:rgba(236,72,153,0.12);border:1px solid rgba(236,72,153,0.3);border-radius:10px;padding:8px 12px;min-width:52px;text-align:center;"><div id="modal-cd-hours" style="font-size:1.3rem;font-weight:900;color:#fff;line-height:1;">--</div><div style="font-size:0.58rem;font-weight:800;color:#f472b6;text-transform:uppercase;letter-spacing:1px;margin-top:3px;">HRS</div></div>' +
          '<div style="background:rgba(236,72,153,0.12);border:1px solid rgba(236,72,153,0.3);border-radius:10px;padding:8px 12px;min-width:52px;text-align:center;"><div id="modal-cd-mins" style="font-size:1.3rem;font-weight:900;color:#fff;line-height:1;">--</div><div style="font-size:0.58rem;font-weight:800;color:#f472b6;text-transform:uppercase;letter-spacing:1px;margin-top:3px;">MIN</div></div>' +
          '<div style="background:rgba(236,72,153,0.12);border:1px solid rgba(236,72,153,0.3);border-radius:10px;padding:8px 12px;min-width:52px;text-align:center;"><div id="modal-cd-secs" style="font-size:1.3rem;font-weight:900;color:#fff;line-height:1;">--</div><div style="font-size:0.58rem;font-weight:800;color:#f472b6;text-transform:uppercase;letter-spacing:1px;margin-top:3px;">SEC</div></div>' +
        '</div>' +

        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">' +
          '<a href="luna.html" onclick="document.getElementById(\'lunaPreLaunchModal\').style.display=\'none\'" style="flex:1;min-width:130px;background:rgba(255,255,255,0.1);color:#fff;padding:11px 16px;border-radius:12px;font-size:0.84rem;font-weight:700;text-decoration:none;border:1px solid rgba(255,255,255,0.2);">Explore Features</a>' +
          '<a href="https://wa.me/919079368240?text=Hi%20Tarun!%20Notify%20me%20when%20LUNA%20launches%20on%201%20Sept%2011:11%20AM." target="_blank" style="flex:1;min-width:130px;background:linear-gradient(135deg,#ec4899,#9333ea);color:#fff;padding:11px 16px;border-radius:12px;font-size:0.84rem;font-weight:700;text-decoration:none;box-shadow:0 4px 15px rgba(236,72,153,0.35);">WhatsApp Reminder</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function (e) { if (e.target === modal) modal.style.display = 'none'; };

    // Tick the mini-countdown inside modal
    function tickModalCd() {
      var diff = LUNA_CONFIG.launchTargetTime - Date.now();
      if (diff <= 0) { modal.style.display = 'none'; return; }
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      var el;
      el = document.getElementById('modal-cd-days');  if (el) el.textContent = pad(Math.floor(diff / 86400000));
      el = document.getElementById('modal-cd-hours'); if (el) el.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      el = document.getElementById('modal-cd-mins');  if (el) el.textContent = pad(Math.floor((diff % 3600000) / 60000));
      el = document.getElementById('modal-cd-secs');  if (el) el.textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tickModalCd();
    var modalTick = setInterval(tickModalCd, 1000);
    // Clean up interval when modal is closed
    var closeBtn = modal.querySelector('button');
    if (closeBtn) {
      var origClose = closeBtn.onclick;
      closeBtn.onclick = function () { clearInterval(modalTick); if (origClose) origClose(); };
    }
    modal.onclick = function (e) {
      if (e.target === modal) { clearInterval(modalTick); modal.style.display = 'none'; }
    };
  }

  /* ────────────────────────────────────
     COUNTDOWN ENGINE
  ──────────────────────────────────── */
  var _lastState = null;
  var _timerInterval = null;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function updateLunaEngine(overrideNow) {
    var now = overrideNow !== undefined ? overrideNow : Date.now();
    var diff = LUNA_CONFIG.launchTargetTime - now;
    var state = diff <= 0 ? 'LIVE' : 'PRE_LAUNCH';

    var days    = Math.max(0, Math.floor(diff / 86400000));
    var hours   = Math.max(0, Math.floor((diff % 86400000) / 3600000));
    var minutes = Math.max(0, Math.floor((diff % 3600000) / 60000));
    var seconds = Math.max(0, Math.floor((diff % 60000) / 1000));

    document.querySelectorAll('.luna-cd-days').forEach(function (el)    { el.textContent = pad(days); });
    document.querySelectorAll('.luna-cd-hours').forEach(function (el)   { el.textContent = pad(hours); });
    document.querySelectorAll('.luna-cd-minutes').forEach(function (el) { el.textContent = pad(minutes); });
    document.querySelectorAll('.luna-cd-seconds').forEach(function (el) { el.textContent = pad(seconds); });

    if (_lastState !== state) {
      _lastState = state;
      applyStateToUI(state);
    }
  }

  function applyStateToUI(state) {
    if (state === 'LIVE') {
      /* ══════════════ LIVE STATE ══════════════ */

      // 1. Hide ALL pre-launch countdown blocks (they disappear completely)
      document.querySelectorAll('.luna-prelaunch-block').forEach(function (el) {
        el.style.transition = 'opacity .6s ease, max-height .6s ease';
        el.style.opacity = '0';
        setTimeout(function () { el.style.display = 'none'; }, 620);
      });

      // 2. Show all live blocks
      document.querySelectorAll('.luna-live-block').forEach(function (el) {
        el.style.display = 'block';
        el.style.animation = 'lunaFadeIn .5s ease-out';
      });

      // 3. Update status badges → Green
      document.querySelectorAll('.luna-status-badge').forEach(function (el) {
        el.innerHTML = '<span style="width:9px;height:9px;background:#22c55e;border-radius:50%;display:inline-block;box-shadow:0 0 12px #22c55e;margin-right:7px;animation:lunaPulse 1.5s infinite;"></span> LUNA IS NOW LIVE • FOR YOU. WITH YOU. ALWAYS.';
        el.style.background = 'rgba(34,197,94,0.15)';
        el.style.borderColor = 'rgba(34,197,94,0.4)';
        el.style.color = '#4ade80';
      });

      // 4. Activate PRIMARY CTAs → Official Download button
      document.querySelectorAll('.luna-primary-cta').forEach(function (el) {
        el.href = LUNA_CONFIG.officialUrl;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.onclick = function (e) {
          e.preventDefault();
          window.triggerLunaDownload();
        };
        el.innerHTML = '<i class="fas fa-download"></i> ✨ GET LUNA — Free Download';
        el.style.background = 'linear-gradient(135deg, #ec4899, #9333ea)';
        el.style.boxShadow = '0 8px 28px rgba(236,72,153,0.5)';
        el.style.animation = 'lunaPulse 2.5s infinite';
      });

      // 5. Activate CARD CTAs
      document.querySelectorAll('.luna-card-cta').forEach(function (el) {
        el.href = LUNA_CONFIG.officialUrl;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.onclick = function (e) {
          e.preventDefault();
          window.triggerLunaDownload();
        };
        el.innerHTML = '<i class="fas fa-download"></i> Get LUNA (Official • Free)';
        el.style.background = 'linear-gradient(135deg,#ec4899,#9333ea)';
        el.style.boxShadow = '0 4px 18px rgba(236,72,153,0.4)';
      });

      // 6. Update countdown titles
      document.querySelectorAll('.luna-countdown-title').forEach(function (el) {
        el.textContent = '● LUNA IS NOW LIVE';
        el.style.color = '#4ade80';
      });

      // 7. Update download counters
      updateAllDownloadCounters();

    } else {
      /* ══════════════ PRE-LAUNCH STATE ══════════════ */
      document.querySelectorAll('.luna-prelaunch-block').forEach(function (el) { el.style.display = 'block'; });
      document.querySelectorAll('.luna-live-block').forEach(function (el) { el.style.display = 'none'; });

      document.querySelectorAll('.luna-status-badge').forEach(function (el) {
        el.innerHTML = '<span style="width:8px;height:8px;background:#ec4899;border-radius:50%;display:inline-block;box-shadow:0 0 8px #ec4899;margin-right:6px;animation:lunaPulse 1.5s infinite;"></span> OFFICIAL LAUNCH • 1 SEPT 2026, 11:11 AM IST';
        el.style.background = 'rgba(236,72,153,0.15)';
        el.style.borderColor = 'rgba(236,72,153,0.4)';
        el.style.color = '#f472b6';
      });

      document.querySelectorAll('.luna-primary-cta').forEach(function (el) {
        el.href = '#luna-launch';
        el.target = '';
        el.onclick = window.handleLunaPreLaunchClick;
        el.innerHTML = '<i class="fas fa-bell"></i> Launching Soon';
        el.style.boxShadow = '';
        el.style.animation = '';
      });

      document.querySelectorAll('.luna-card-cta').forEach(function (el) {
        el.href = '#luna-launch';
        el.target = '';
        el.onclick = window.handleLunaPreLaunchClick;
        el.innerHTML = '<i class="fas fa-clock"></i> Launching 1 Sept 11:11 AM';
        el.style.boxShadow = '';
      });
    }
  }

  /* ────────────────────────────────────
     ENGINE START
  ──────────────────────────────────── */
  function startLunaEngine() {
    updateLunaEngine();
    updateAllDownloadCounters();
    if (_timerInterval) clearInterval(_timerInterval);
    _timerInterval = setInterval(function () { updateLunaEngine(); }, 1000);
  }

  /* ────────────────────────────────────
     TEST / QA SIMULATOR
     Usage in console: window.__simulateLunaTime('2026-09-01T11:11:01+05:30')
  ──────────────────────────────────── */
  window.__simulateLunaTime = function (isoOrMs) {
    if (_timerInterval) clearInterval(_timerInterval);
    var t = typeof isoOrMs === 'string' ? new Date(isoOrMs).getTime() : isoOrMs;
    _lastState = null; // force UI re-render
    updateLunaEngine(t);
    return window.getLunaLaunchState(t);
  };

  /* ────────────────────────────────────
     KEYFRAMES
  ──────────────────────────────────── */
  if (!document.getElementById('lunaAnimationStyles')) {
    var st = document.createElement('style');
    st.id = 'lunaAnimationStyles';
    st.textContent =
      '@keyframes lunaPulse { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(.85);opacity:.5;} }' +
      '@keyframes lunaFadeIn { from{opacity:0;transform:scale(.96);}to{opacity:1;transform:scale(1);} }';
    document.head.appendChild(st);
  }

  /* ────────────────────────────────────
     INIT
  ──────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLunaEngine);
  } else {
    startLunaEngine();
  }

})(window, document);
