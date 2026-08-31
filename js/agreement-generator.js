/**
 * ============================================================
 * TK WEB SOLUTIONS — CLIENT SERVICE AGREEMENT & CONTRACT SYSTEM
 * ============================================================
 * Generates official, legal, A4 printable service agreements
 * with dual signature stamps, payment terms, scope of work,
 * WhatsApp dispatch, email sender, and local storage ledger.
 */

(function(window, document) {
  'use strict';

  var STORAGE_KEY = 'tk_agreements_ledger';

  function ensureStylesInjected() {
    if (document.getElementById('tk-agreement-styles')) return;
    var style = document.createElement('style');
    style.id = 'tk-agreement-styles';
    style.innerHTML = `
      .tk-agr-overlay {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(3, 7, 18, 0.88) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 20px !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;
        animation: tkFadeIn 0.25s ease-out;
      }
      .tk-agr-card {
        background: #090e1f !important;
        border: 1.5px solid rgba(0, 229, 255, 0.35) !important;
        border-radius: 24px !important;
        max-width: 900px !important;
        width: 100% !important;
        max-height: 94vh !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 229, 255, 0.15) !important;
        overflow: hidden !important;
      }
      .tk-agr-topbar {
        background: linear-gradient(135deg, #0e1a3a, #142452) !important;
        padding: 16px 24px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        border-bottom: 1px solid rgba(0, 229, 255, 0.2) !important;
        flex-shrink: 0 !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
      }
      .tk-agr-top-title {
        font-family: 'Syne', sans-serif !important;
        font-weight: 800 !important;
        font-size: 1.05rem !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .tk-agr-btns {
        display: flex !important;
        gap: 10px !important;
        align-items: center !important;
        flex-wrap: wrap !important;
      }
      .tk-agr-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 8px 16px !important;
        border-radius: 10px !important;
        font-size: 0.82rem !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        border: none !important;
        font-family: 'DM Sans', sans-serif !important;
        transition: all 0.2s !important;
        text-decoration: none !important;
      }
      .tk-agr-btn:hover { transform: translateY(-2px); }
      .tk-agr-btn-print { background: linear-gradient(135deg, #0052ff, #00d4ff) !important; color: #fff !important; }
      .tk-agr-btn-wa { background: #25d366 !important; color: #fff !important; }
      .tk-agr-btn-email { background: linear-gradient(135deg, #9333ea, #ec4899) !important; color: #fff !important; }
      .tk-agr-btn-close { background: rgba(255,255,255,0.1) !important; color: #94a3b8 !important; font-size: 1.2rem !important; width: 34px !important; height: 34px !important; justify-content: center !important; padding: 0 !important; }
      .tk-agr-body {
        padding: 24px !important;
        overflow-y: auto !important;
        background: #f1f5f9 !important;
        color: #0f172a !important;
      }
    `;
    document.head.appendChild(style);
  }

  var TK_AGREEMENT = {
    _currentAgreementData: null,

    getISTDateTime: function() {
      var d = new Date();
      var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      var ist = new Date(utc + (3600000 * 5.5));
      var day = String(ist.getDate()).padStart(2, '0');
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var month = months[ist.getMonth()];
      var year = ist.getFullYear();
      var hours = ist.getHours();
      var mins = String(ist.getMinutes()).padStart(2, '0');
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return day + ' ' + month + ' ' + year + ', ' + String(hours).padStart(2, '0') + ':' + mins + ' ' + ampm + ' IST';
    },

    getISTDate: function() {
      var d = new Date();
      var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      var ist = new Date(utc + (3600000 * 5.5));
      var day = String(ist.getDate()).padStart(2, '0');
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return day + ' ' + months[ist.getMonth()] + ' ' + ist.getFullYear();
    },

    generateAgreementId: function() {
      var d = new Date();
      var year = d.getFullYear();
      var rand = Math.floor(1000 + Math.random() * 9000);
      return 'TK-AGR-' + year + '-' + rand;
    },

    // Build the complete, vector-crisp A4 Agreement Document
    buildAgreementHTML: function(data) {
      var cfg = (window.TK_CONFIG && window.TK_CONFIG.business) || {
        name: "TK Web Solutions",
        tagline: "From Dreams.... to Digital Reality",
        founder: "Tarun Singh",
        founderTitle: "Founder & Lead Architect",
        address: "Bharatpur, Rajasthan, 321001, India",
        phone: "+91 90793 68240",
        email: "tkwebsolution1301@gmail.com",
        website: "https://tkwebsolutions.in",
        logoPath: "logo.png",
        signaturePath: "assets/tarun-singh-signature.png"
      };

      var agrId = data.agreementId || this.generateAgreementId();
      var agrDate = data.date || this.getISTDate();
      var clientName = data.clientName || 'Valued Client';
      var businessName = data.businessName || '';
      var phone = data.phone || '';
      var email = data.email || '';
      var address = data.address || 'Bharatpur, Rajasthan';
      var serviceName = data.serviceName || 'Custom Website Development';
      var totalCost = parseInt(data.totalCost || 0);
      var advancePaid = parseInt(data.advancePaid || 0);
      var balanceDue = parseInt(data.balanceDue !== undefined ? data.balanceDue : (totalCost - advancePaid));
      var timeline = data.timeline || '5–7 Working Days';
      var supportPeriod = data.supportPeriod || '30 Days Free Technical Support';
      var deliverables = data.deliverables || [
        '100% Mobile Responsive Clean Design (Desktops, Tablets & Mobile Phones)',
        'SEO-Optimized Semantic Code Structure + Google Search Indexing Setup',
        'Direct WhatsApp & Instant Call Integration Buttons',
        'Contact & Lead Capture Forms with Direct Email Alerts',
        '30 Days Free Post-Delivery Warranty & Maintenance by Founder'
      ];
      if (typeof deliverables === 'string') {
        deliverables = deliverables.split('\n').filter(function(s) { return s.trim().length > 0; });
      }

      var customClauses = data.customClauses || '';

      var formattedTotal = '₹' + totalCost.toLocaleString('en-IN');
      var formattedAdvance = '₹' + advancePaid.toLocaleString('en-IN');
      var formattedBalance = '₹' + balanceDue.toLocaleString('en-IN');

      var deliverablesList = deliverables.map(function(item) {
        return '<li style="margin-bottom:5px;">' + item.replace(/^[•\-\*]\s*/, '') + '</li>';
      }).join('');

      return '<div class="tk-agr-sheet" id="tkAgreementPrintArea" style="background:#fff;border-radius:12px;padding:34px;max-width:800px;margin:0 auto;color:#0f172a;font-family:\'DM Sans\',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,0.06);border:1px solid #e2e8f0;line-height:1.6;">' +
        
        // Header
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #0052ff;padding-bottom:18px;margin-bottom:20px;">' +
          '<div style="display:flex;align-items:center;gap:14px;">' +
            '<img src="' + cfg.logoPath + '" alt="' + cfg.name + '" style="width:54px;height:54px;object-fit:contain;" onerror="this.src=\'logo.png\'">' +
            '<div>' +
              '<h1 style="font-family:\'Syne\',sans-serif;font-size:22px;font-weight:800;color:#0b1736;margin:0 0 2px;">' + cfg.name + '</h1>' +
              '<p style="font-size:11px;font-style:italic;color:#0052ff;margin:0 0 3px;">"' + cfg.tagline + '"</p>' +
              '<p style="font-size:10.5px;color:#64748b;margin:0;line-height:1.4;">' + cfg.address + '<br>Phone: ' + cfg.phone + ' | Email: ' + cfg.email + '</p>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<div style="display:inline-block;background:linear-gradient(135deg,#0052ff,#00d4ff);color:#fff;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:6px;">CLIENT SERVICE AGREEMENT</div>' +
            '<div style="font-family:monospace;font-size:13px;font-weight:800;color:#0f172a;">Agreement #: ' + agrId + '</div>' +
            '<div style="font-size:11px;color:#64748b;margin-top:2px;">Date: ' + agrDate + '</div>' +
          '</div>' +
        '</div>' +

        // Parties Overview
        '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">' +
          '<div>' +
            '<h4 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0052ff;margin:0 0 6px;">SERVICE PROVIDER (FIRST PARTY):</h4>' +
            '<div style="font-size:13px;font-weight:800;color:#0f172a;">' + cfg.name + '</div>' +
            '<div style="font-size:11px;color:#475569;">Lead: ' + cfg.founder + ' (' + cfg.founderTitle + ')</div>' +
            '<div style="font-size:11px;color:#475569;">Contact: ' + cfg.phone + '</div>' +
            '<div style="font-size:11px;color:#475569;">Location: ' + cfg.address + '</div>' +
          '</div>' +
          '<div>' +
            '<h4 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0052ff;margin:0 0 6px;">CLIENT / CLIENT REPRESENTATIVE (SECOND PARTY):</h4>' +
            '<div style="font-size:13px;font-weight:800;color:#0f172a;">' + clientName + (businessName ? ' <span style="font-size:11px;color:#64748b;">(' + businessName + ')</span>' : '') + '</div>' +
            (phone ? '<div style="font-size:11px;color:#475569;">Phone: ' + phone + '</div>' : '') +
            (email ? '<div style="font-size:11px;color:#475569;">Email: ' + email + '</div>' : '') +
            '<div style="font-size:11px;color:#475569;">Address: ' + address + '</div>' +
          '</div>' +
        '</div>' +

        // Project Scope & Deliverables
        '<div style="margin-bottom:18px;">' +
          '<h3 style="font-family:\'Syne\',sans-serif;font-size:13px;font-weight:800;color:#0b1736;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1.5px solid #e2e8f0;padding-bottom:5px;margin-bottom:10px;">1. Scope of Work &amp; Deliverables</h3>' +
          '<div style="font-size:12px;font-weight:700;color:#0052ff;margin-bottom:6px;">Target Service: ' + serviceName + '</div>' +
          '<ul style="font-size:11px;color:#334155;padding-left:18px;margin:0 0 10px;line-height:1.55;">' +
            deliverablesList +
          '</ul>' +
          (customClauses ? '<div style="background:#eff6ff;border-left:3px solid #0052ff;padding:8px 12px;font-size:11px;color:#1e3a8a;margin-top:6px;border-radius:0 6px 6px 0;"><strong>Special Project Specifications:</strong> ' + customClauses + '</div>' : '') +
        '</div>' +

        // Payment & Milestones Table
        '<div style="margin-bottom:18px;">' +
          '<h3 style="font-family:\'Syne\',sans-serif;font-size:13px;font-weight:800;color:#0b1736;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1.5px solid #e2e8f0;padding-bottom:5px;margin-bottom:10px;">2. Payment Schedule &amp; Financial Terms</h3>' +
          '<table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:11.5px;">' +
            '<thead>' +
              '<tr style="background:#f1f5f9;border-top:1px solid #cbd5e1;border-bottom:1px solid #cbd5e1;">' +
                '<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:#475569;">Milestone Stage</th>' +
                '<th style="text-align:center;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:#475569;">Status / Due</th>' +
                '<th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:#475569;">Amount (INR)</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              '<tr>' +
                '<td style="padding:9px 10px;border-bottom:1px solid #f1f5f9;"><strong>Advance Commitment Deposit</strong> (Work Kickoff)</td>' +
                '<td style="text-align:center;padding:9px 10px;border-bottom:1px solid #f1f5f9;"><span style="color:#16a34a;font-weight:700;">RECEIVED / AGREED ✓</span></td>' +
                '<td style="text-align:right;padding:9px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#16a34a;">' + formattedAdvance + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td style="padding:9px 10px;border-bottom:1px solid #f1f5f9;"><strong>Final Balance (Pay Later)</strong> — Upon preview approval &amp; live deployment</td>' +
                '<td style="text-align:center;padding:9px 10px;border-bottom:1px solid #f1f5f9;"><span style="color:#d97706;font-weight:700;">DUE ON COMPLETION</span></td>' +
                '<td style="text-align:right;padding:9px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#d97706;">' + formattedBalance + '</td>' +
              '</tr>' +
              '<tr style="background:#f8fafc;border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;">' +
                '<td colspan="2" style="padding:10px 10px;font-weight:800;font-size:12px;">TOTAL AGREED PROJECT VALUE:</td>' +
                '<td style="text-align:right;padding:10px 10px;font-weight:800;font-size:14px;color:#0052ff;">' + formattedTotal + '</td>' +
              '</tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +

        // Key Legal & Warranty Clauses
        '<div style="margin-bottom:20px;">' +
          '<h3 style="font-family:\'Syne\',sans-serif;font-size:13px;font-weight:800;color:#0b1736;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1.5px solid #e2e8f0;padding-bottom:5px;margin-bottom:10px;">3. General Terms, Delivery &amp; Warranty</h3>' +
          '<ol style="font-size:10.5px;color:#475569;padding-left:18px;margin:0;line-height:1.55;">' +
            '<li><strong>Delivery Timeline:</strong> Project will be completed within <strong>' + timeline + '</strong> after receiving necessary content/assets from the client.</li>' +
            '<li><strong>30-Day Technical Warranty:</strong> Includes <strong>' + supportPeriod + '</strong> covering any bug fixes, responsive adjustments, and direct guidance.</li>' +
            '<li><strong>Intellectual Property:</strong> 100% full ownership of source code and design assets is transferred to the Client upon settlement of the final balance.</li>' +
            '<li><strong>Content Responsibility:</strong> Client guarantees they possess proper rights/permissions for all images, logos, and copy provided for publication.</li>' +
            '<li><strong>Jurisdiction:</strong> This agreement is governed by the laws of India, subject to the jurisdiction of courts in <strong>Bharatpur, Rajasthan</strong>.</li>' +
          '</ol>' +
        '</div>' +

        // Signatures Block
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;border-top:2px solid #e2e8f0;padding-top:16px;margin-top:16px;">' +
          // Provider Signature
          '<div style="border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;text-align:center;">' +
            '<img src="' + cfg.signaturePath + '" alt="Tarun Singh Signature" style="max-width:140px;max-height:42px;object-fit:contain;margin:0 auto 4px;display:block;" onerror="this.src=\'assets/tarun-singh-signature.png\'">' +
            '<div style="width:100%;height:1px;background:#94a3b8;margin:4px 0 6px;"></div>' +
            '<div style="font-size:12px;font-weight:800;color:#0f172a;">' + cfg.founder + '</div>' +
            '<div style="font-size:10px;color:#64748b;">Authorized Signatory • ' + cfg.founderTitle + '</div>' +
            '<div style="font-size:10px;font-weight:700;color:#0052ff;">' + cfg.name + '</div>' +
          '</div>' +
          // Client Acceptance
          '<div style="border:1px dashed #cbd5e1;border-radius:10px;padding:12px;background:#fafafa;text-align:center;display:flex;flex-direction:column;justify-content:flex-end;">' +
            '<div style="font-size:10.5px;color:#16a34a;font-weight:700;margin-bottom:18px;">[ Electronically Accepted &amp; Verified ]</div>' +
            '<div style="width:100%;height:1px;background:#94a3b8;margin:4px 0 6px;"></div>' +
            '<div style="font-size:12px;font-weight:800;color:#0f172a;">' + clientName + '</div>' +
            '<div style="font-size:10px;color:#64748b;">Client Signature / Authorized Signatory</div>' +
            '<div style="font-size:10px;font-weight:700;color:#334155;">' + (businessName || clientName) + '</div>' +
          '</div>' +
        '</div>' +

        // Bottom tagline
        '<div style="margin-top:16px;text-align:center;border-top:1px dashed #e2e8f0;padding-top:10px;font-size:10px;color:#94a3b8;">' +
          'Official Document issued by TK Web Solutions • Bharatpur, Rajasthan • Web: https://tkwebsolutions.in • Helpline: +91 90793 68240' +
        '</div>' +

      '</div>';
    },

    // Display Popup Modal with Print, WhatsApp, and Email triggers
    showAgreementModal: function(data) {
      ensureStylesInjected();

      var existing = document.getElementById('tk-agreement-modal');
      if (existing) existing.remove();

      this._currentAgreementData = data;
      var agreementHTML = this.buildAgreementHTML(data);

      var modal = document.createElement('div');
      modal.id = 'tk-agreement-modal';
      modal.className = 'tk-agr-overlay';
      modal.innerHTML = 
        '<div class="tk-agr-card">' +
          '<div class="tk-agr-topbar">' +
            '<div class="tk-agr-top-title"><i class="fas fa-file-contract"></i> Official Client Service Agreement</div>' +
            '<div class="tk-agr-btns">' +
              '<button onclick="window.TK_AGREEMENT.printAgreement()" class="tk-agr-btn tk-agr-btn-print"><i class="fas fa-print"></i> Download / Print PDF</button>' +
              '<button onclick="window.TK_AGREEMENT.shareWhatsApp()" class="tk-agr-btn tk-agr-btn-wa"><i class="fab fa-whatsapp"></i> Share WhatsApp</button>' +
              '<button onclick="window.TK_AGREEMENT.emailAgreement()" class="tk-agr-btn tk-agr-btn-email"><i class="fas fa-envelope"></i> Send via Email</button>' +
              '<button onclick="document.getElementById(\'tk-agreement-modal\').remove()" class="tk-agr-btn tk-agr-btn-close" aria-label="Close">&times;</button>' +
            '</div>' +
          '</div>' +
          '<div class="tk-agr-body">' +
            agreementHTML +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);

      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
      });
    },

    // Print & PDF generation
    printAgreement: function() {
      var printArea = document.getElementById('tkAgreementPrintArea');
      if (!printArea) return;

      var printWin = window.open('', '_blank', 'width=940,height=1050');
      if (!printWin) {
        window.print();
        return;
      }

      printWin.document.write('<!DOCTYPE html><html><head><title>Agreement — ' + (this._currentAgreementData ? (this._currentAgreementData.agreementId || 'TK-AGR') : 'TK-AGR') + '</title>');
      printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">');
      printWin.document.write('<style>');
      printWin.document.write(`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0d1635; background: #fff; padding: 24px; }
        .tk-agr-sheet { width: 100%; max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; }
        @media print {
          body { padding: 0; background: #fff; }
          .tk-agr-sheet { border: none !important; padding: 0 !important; box-shadow: none !important; }
        }
      `);
      printWin.document.write('</style></head><body>');
      printWin.document.write(printArea.outerHTML);
      printWin.document.write('</body></html>');
      printWin.document.close();

      setTimeout(function() {
        printWin.focus();
        printWin.print();
      }, 350);
    },

    // Share contract on WhatsApp
    shareWhatsApp: function() {
      if (!this._currentAgreementData) return;
      var d = this._currentAgreementData;
      var total = parseInt(d.totalCost || 0);
      var advance = parseInt(d.advancePaid || 0);
      var balance = parseInt(d.balanceDue !== undefined ? d.balanceDue : (total - advance));

      var msg = '📜 *TK Web Solutions — Official Client Service Agreement*\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '📋 *Agreement ID:* ' + (d.agreementId || 'TK-AGR-2026') + '\n' +
        '👤 *Client:* ' + d.clientName + (d.businessName ? ' (' + d.businessName + ')' : '') + '\n' +
        '🌐 *Service:* ' + (d.serviceName || 'Website Development') + '\n' +
        '⏱️ *Timeline:* ' + (d.timeline || '5–7 Working Days') + '\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '💰 *Financial Breakdown:*\n' +
        '• Total Project Value: ₹' + total.toLocaleString('en-IN') + '\n' +
        '• Advance Paid: ₹' + advance.toLocaleString('en-IN') + ' (Received ✓)\n' +
        '• Balance (Pay Later): ₹' + balance.toLocaleString('en-IN') + ' (Due on Delivery)\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '🛡️ *Included Warranty:* 30 Days Free Technical Support\n' +
        '✍️ *Authorized Signatory:* Tarun Singh (Founder & Lead Developer)\n\n' +
        '🙏 Thank you for choosing TK Web Solutions!\n' +
        '🌐 https://tkwebsolutions.in | 📞 +91 90793 68240\n' +
        '"From Dreams.... to Digital Reality"';

      var waUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank');
    },

    // Email dispatch popup
    emailAgreement: function() {
      if (!this._currentAgreementData) return;
      var d = this._currentAgreementData;
      var existingEmail = (d.email && d.email.indexOf('@') !== -1) ? d.email : '';

      var oldPop = document.getElementById('tk-agr-email-overlay');
      if (oldPop) oldPop.remove();

      var pop = document.createElement('div');
      pop.id = 'tk-agr-email-overlay';
      pop.style.cssText = 'position:fixed;inset:0;background:rgba(3,7,18,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;animation:tkFadeIn 0.2s ease-out;';
      pop.innerHTML = `
        <div style="max-width:440px;width:100%;background:#090e1f;color:#fff;padding:28px;border-radius:20px;border:1.5px solid rgba(0,229,255,0.35);box-shadow:0 30px 80px rgba(0,0,0,0.85);position:relative;font-family:'DM Sans',sans-serif;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h3 style="font-family:'Syne',sans-serif;font-size:1.1rem;color:#fff;margin:0;display:flex;align-items:center;gap:8px;"><i class="fas fa-envelope" style="color:#00e5ff;"></i> Send Agreement via Email</h3>
            <button id="tkAgrEmailClose" style="background:rgba(255,255,255,0.1);border:none;color:#94a3b8;font-size:1.3rem;cursor:pointer;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;line-height:1;">&times;</button>
          </div>
          <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin-bottom:18px;">Your official TK Web Solutions Service Agreement summary will be delivered to this email address.</p>
          <div style="margin-bottom:18px;">
            <label style="font-size:0.75rem;color:#cbd5e1;display:block;margin-bottom:6px;font-weight:600;">Client Email Address *</label>
            <input type="email" id="tkAgrEmailInput" value="${existingEmail}" placeholder="client@example.com" style="width:100%;background:rgba(255,255,255,0.06);border:1.5px solid rgba(0,229,255,0.3);border-radius:10px;padding:12px 14px;color:#fff;font-size:0.9rem;outline:none;box-sizing:border-box;font-family:'DM Sans',sans-serif;">
          </div>
          <div style="display:flex;gap:10px;">
            <button id="tkAgrEmailCancel" style="flex:1;background:rgba(255,255,255,0.08);color:#cbd5e1;padding:12px;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;font-family:'DM Sans',sans-serif;">Cancel</button>
            <button id="tkAgrEmailSubmit" style="flex:2;background:linear-gradient(135deg,#9333ea,#ec4899);color:#fff;padding:12px;border:none;border-radius:10px;font-weight:800;font-size:0.92rem;cursor:pointer;font-family:'Syne',sans-serif;box-shadow:0 4px 14px rgba(236,72,153,0.35);">Send Agreement</button>
          </div>
          <div id="tkAgrEmailMsg" style="margin-top:14px;font-size:0.82rem;text-align:center;display:none;"></div>
        </div>
      `;

      document.body.appendChild(pop);

      var self = this;
      document.getElementById('tkAgrEmailClose').onclick = function() { pop.remove(); };
      document.getElementById('tkAgrEmailCancel').onclick = function() { pop.remove(); };
      document.getElementById('tkAgrEmailSubmit').onclick = function() {
        var emailVal = document.getElementById('tkAgrEmailInput').value.trim();
        if (!emailVal || emailVal.indexOf('@') === -1) {
          alert('Please enter a valid email address.');
          return;
        }
        self.dispatchAgreementEmail(d, emailVal, pop);
      };
    },

    // Dispatch via mailto / backend ping
    dispatchAgreementEmail: function(data, targetEmail, modalEl) {
      var total = parseInt(data.totalCost || 0);
      var advance = parseInt(data.advancePaid || 0);
      var balance = parseInt(data.balanceDue !== undefined ? data.balanceDue : (total - advance));

      var subject = 'Official Service Agreement — ' + (data.agreementId || 'TK-AGR') + ' [' + (data.serviceName || 'Website Project') + ']';
      var body = 'Dear ' + data.clientName + ',\n\n' +
        'Thank you for partnering with TK Web Solutions! Please find your official project service agreement details below:\n\n' +
        '========================================\n' +
        'CLIENT SERVICE AGREEMENT DETAILS\n' +
        '========================================\n' +
        'Agreement ID: ' + (data.agreementId || 'TK-AGR') + '\n' +
        'Client Name: ' + data.clientName + (data.businessName ? ' (' + data.businessName + ')' : '') + '\n' +
        'Phone: ' + (data.phone || 'N/A') + '\n' +
        'Address: ' + (data.address || 'N/A') + '\n' +
        'Service: ' + (data.serviceName || 'Website Development') + '\n' +
        'Delivery Timeline: ' + (data.timeline || '5–7 Working Days') + '\n\n' +
        'PAYMENT SCHEDULE:\n' +
        '• Total Project Cost: INR ' + total.toLocaleString('en-IN') + '\n' +
        '• Advance Paid: INR ' + advance.toLocaleString('en-IN') + ' (Received ✓)\n' +
        '• Balance (Pay Later): INR ' + balance.toLocaleString('en-IN') + ' (Payable on completion)\n\n' +
        'INCLUDED WARRANTY & SUPPORT:\n' +
        '• 30 Days Free Technical Support & Maintenance\n' +
        '• 100% Full Source Code & Asset Handover upon balance settlement\n' +
        '• Direct Helpline with Founder Tarun Singh (+91 90793 68240)\n\n' +
        '========================================\n' +
        'Authorized Signatory: Tarun Singh (Founder & Lead Architect)\n' +
        'TK Web Solutions — Bharatpur, Rajasthan, India\n' +
        'Website: https://tkwebsolutions.in\n' +
        '"From Dreams.... to Digital Reality"';

      // Open mailto fallback client
      var mailtoLink = 'mailto:' + encodeURIComponent(targetEmail) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailtoLink;

      var msgEl = document.getElementById('tkAgrEmailMsg');
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.color = '#4ade80';
        msgEl.innerHTML = '<i class="fas fa-check-circle"></i> Opening email client with pre-filled contract summary!';
      }
      setTimeout(function() {
        if (modalEl && modalEl.parentNode) modalEl.remove();
      }, 2500);
    },

    // Save to local storage ledger
    saveAgreement: function(data) {
      var list = this.getAgreements();
      var idx = list.findIndex(function(item) {
        return item.agreementId === data.agreementId;
      });
      if (idx !== -1) {
        list[idx] = data;
      } else {
        list.unshift(data);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch(e) {}
      return list;
    },

    getAgreements: function() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch(e) {
        return [];
      }
    }
  };

  window.TK_AGREEMENT = TK_AGREEMENT;

})(window, document);
