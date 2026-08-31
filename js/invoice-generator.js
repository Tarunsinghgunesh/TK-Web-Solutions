/**
 * TK Web Solutions — Ultra-Luxury VIP A4 Invoice & Receipt System
 * Engineered for 100% reliability, instant glassmorphism popup modal,
 * high-res digital signature stamp, printable vector A4 bills, and automated dispatch.
 */

(function(window) {
  'use strict';

  // Inject Self-Contained Modal & VIP Invoice Styles if not present
  function ensureStylesInjected() {
    if (document.getElementById('tk-invoice-vip-styles')) return;

    var style = document.createElement('style');
    style.id = 'tk-invoice-vip-styles';
    style.innerHTML = `
      /* ═══════════════════════════════════════════════════════════
         TK WEB SOLUTIONS — VIP INVOICE MODAL & DOCUMENT STYLES
      ═══════════════════════════════════════════════════════════ */
      .tk-modal-overlay {
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

      @keyframes tkFadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }

      .tk-modal-card {
        background: #090e1f !important;
        border: 1.5px solid rgba(0, 229, 255, 0.35) !important;
        border-radius: 24px !important;
        max-width: 860px !important;
        width: 100% !important;
        max-height: 92vh !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 229, 255, 0.15) !important;
        overflow: hidden !important;
        position: relative !important;
      }

      .tk-modal-topbar {
        background: linear-gradient(135deg, #0e1a3a, #142452) !important;
        padding: 16px 24px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        border-bottom: 1px solid rgba(0, 229, 255, 0.2) !important;
        flex-shrink: 0 !important;
      }

      .tk-modal-top-title {
        font-family: 'Syne', sans-serif !important;
        font-weight: 800 !important;
        font-size: 1.05rem !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .tk-modal-top-title i { color: #00e5ff !important; }

      .tk-modal-btns {
        display: flex !important;
        gap: 10px !important;
        align-items: center !important;
      }

      .tk-m-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 8px 16px !important;
        border-radius: 10px !important;
        font-size: 0.8rem !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        border: none !important;
        font-family: 'DM Sans', sans-serif !important;
        transition: all 0.2s !important;
      }
      .tk-m-btn:hover { transform: translateY(-2px); }

      .tk-m-btn-print {
        background: linear-gradient(135deg, #0052ff, #00d4ff) !important;
        color: #fff !important;
        box-shadow: 0 4px 14px rgba(0, 150, 255, 0.35) !important;
      }
      .tk-m-btn-wa {
        background: #25d366 !important;
        color: #fff !important;
      }
      .tk-m-btn-email {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
      }
      .tk-m-btn-close {
        background: rgba(255, 255, 255, 0.08) !important;
        color: rgba(255, 255, 255, 0.7) !important;
        font-size: 1.2rem !important;
        padding: 6px 12px !important;
        border-radius: 8px !important;
      }
      .tk-m-btn-close:hover { color: #fff !important; background: rgba(239, 68, 68, 0.5) !important; }

      .tk-modal-body {
        padding: 24px !important;
        overflow-y: auto !important;
        background: #080d1e !important;
        display: flex !important;
        justify-content: center !important;
      }

      /* ══ VIP A4 INVOICE SHEET (Light / Paper Container inside Modal) ══ */
      .tk-inv-sheet {
        background: #ffffff !important;
        color: #0d1635 !important;
        max-width: 780px !important;
        width: 100% !important;
        padding: 36px 42px !important;
        border-radius: 16px !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4) !important;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        position: relative !important;
        box-sizing: border-box !important;
      }

      .tk-inv-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        border-bottom: 2px solid #e2e8f0 !important;
        padding-bottom: 20px !important;
        margin-bottom: 22px !important;
      }

      .tk-inv-brand-box {
        display: flex !important;
        align-items: center !important;
        gap: 16px !important;
      }
      .tk-inv-brand-logo {
        width: 58px !important;
        height: 58px !important;
        object-fit: contain !important;
        border-radius: 12px !important;
      }
      .tk-inv-company-title {
        font-family: 'Syne', sans-serif !important;
        font-size: 22px !important;
        font-weight: 800 !important;
        color: #0b1736 !important;
        margin: 0 0 2px !important;
      }
      .tk-inv-company-tagline {
        font-size: 11.5px !important;
        font-style: italic !important;
        color: #4338ca !important;
        margin: 0 0 6px !important;
      }
      .tk-inv-company-meta {
        font-size: 11px !important;
        color: #64748b !important;
        line-height: 1.4 !important;
        margin: 0 !important;
      }

      .tk-inv-meta-right {
        text-align: right !important;
      }
      .tk-inv-badge-pill {
        display: inline-block !important;
        background: linear-gradient(135deg, #0052ff, #00d4ff) !important;
        color: #ffffff !important;
        font-size: 10px !important;
        font-weight: 800 !important;
        letter-spacing: 1.5px !important;
        text-transform: uppercase !important;
        padding: 5px 14px !important;
        border-radius: 20px !important;
        margin-bottom: 8px !important;
      }
      .tk-inv-id-text {
        font-family: monospace !important;
        font-size: 14px !important;
        font-weight: 700 !important;
        color: #0f172a !important;
        margin-bottom: 3px !important;
      }
      .tk-inv-date-text {
        font-size: 11.5px !important;
        color: #64748b !important;
        margin-bottom: 4px !important;
      }
      .tk-inv-status-tag {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        font-size: 11.5px !important;
        font-weight: 800 !important;
        color: #16a34a !important;
      }
      .tk-inv-status-tag::before {
        content: '';
        width: 7px;
        height: 7px;
        background: #16a34a;
        border-radius: 50%;
      }

      /* Details Grid */
      .tk-inv-grid {
        display: grid !important;
        grid-template-columns: 1.2fr 1fr !important;
        gap: 20px !important;
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        padding: 16px 20px !important;
        margin-bottom: 24px !important;
      }
      .tk-inv-grid-col h4 {
        font-size: 10.5px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        color: #64748b !important;
        margin: 0 0 8px !important;
      }
      .tk-inv-client-name {
        font-size: 15px !important;
        font-weight: 800 !important;
        color: #0f172a !important;
        margin-bottom: 2px !important;
      }
      .tk-inv-info-row {
        font-size: 11.5px !important;
        color: #475569 !important;
        margin-bottom: 2px !important;
      }

      /* Itemized Table */
      .tk-inv-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-bottom: 24px !important;
      }
      .tk-inv-table th {
        background: #f1f5f9 !important;
        border-top: 1.5px solid #cbd5e1 !important;
        border-bottom: 1.5px solid #cbd5e1 !important;
        padding: 10px 14px !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        color: #475569 !important;
        text-align: left !important;
      }
      .tk-inv-table td {
        padding: 12px 14px !important;
        border-bottom: 1px solid #f1f5f9 !important;
        font-size: 13px !important;
        color: #1e293b !important;
        vertical-align: top !important;
      }
      .tk-inv-item-desc {
        font-size: 11px !important;
        color: #64748b !important;
        margin-top: 3px !important;
        line-height: 1.4 !important;
      }
      .tk-inv-table tfoot td {
        padding: 8px 14px !important;
        font-size: 12px !important;
      }
      .tk-inv-total-row td {
        border-top: 2px solid #0f172a !important;
        border-bottom: 2px solid #0f172a !important;
        padding: 12px 14px !important;
        font-size: 14px !important;
      }
      .tk-inv-grand-total {
        font-size: 20px !important;
        font-weight: 900 !important;
        color: #0052ff !important;
      }

      /* Signatory & Terms */
      .tk-inv-footer-wrap {
        display: grid !important;
        grid-template-columns: 1.4fr 1fr !important;
        gap: 24px !important;
        align-items: flex-end !important;
        border-top: 1.5px solid #e2e8f0 !important;
        padding-top: 18px !important;
        margin-top: 20px !important;
      }
      .tk-inv-terms-box {
        font-size: 11px !important;
        color: #64748b !important;
      }
      .tk-inv-terms-box h4 {
        font-size: 11px !important;
        font-weight: 800 !important;
        color: #334155 !important;
        margin: 0 0 6px !important;
      }
      .tk-inv-terms-box ul {
        padding-left: 16px !important;
        margin: 0 !important;
        line-height: 1.55 !important;
      }

      .tk-inv-signatory-box {
        text-align: center !important;
        border: 1px dashed #cbd5e1 !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        background: #fafafa !important;
      }
      .tk-inv-sig-img {
        max-width: 200px !important;
        max-height: 64px !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto 4px !important;
      }
      .tk-inv-sig-line {
        width: 100% !important;
        height: 1px !important;
        background: #94a3b8 !important;
        margin: 4px 0 6px !important;
      }
      .tk-inv-sig-name {
        font-size: 12px !important;
        font-weight: 800 !important;
        color: #0f172a !important;
      }
      .tk-inv-sig-role {
        font-size: 10.5px !important;
        color: #64748b !important;
      }
      .tk-inv-sig-biz {
        font-size: 10.5px !important;
        font-weight: 700 !important;
        color: #0052ff !important;
      }

      .tk-inv-bottom-tagline {
        margin-top: 20px !important;
        text-align: center !important;
        border-top: 1px dashed #e2e8f0 !important;
        padding-top: 12px !important;
        font-size: 11px !important;
        color: #94a3b8 !important;
      }

      @media (max-width: 650px) {
        .tk-inv-header { flex-direction: column; gap: 14px; }
        .tk-inv-meta-right { text-align: left; }
        .tk-inv-grid { grid-template-columns: 1fr; }
        .tk-inv-footer-wrap { grid-template-columns: 1fr; }
        .tk-modal-topbar { flex-direction: column; gap: 12px; align-items: stretch; }
        .tk-modal-btns { justify-content: center; }
      }
    `;
    document.head.appendChild(style);
  }

  var InvoiceSystem = {
    // Generate standardized invoice number: TK-INV-2026-XXXXXX
    generateInvoiceNo: function() {
      var now = new Date();
      var ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      var yr = ist.getFullYear();
      var day = String(ist.getDate()).padStart(2, '0');
      var mo = String(ist.getMonth() + 1).padStart(2, '0');
      var rand = Math.floor(1000 + Math.random() * 9000);
      return 'TK-INV-' + yr + '-' + day + mo + rand;
    },

    getISTDateTime: function() {
      return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },

    savePaymentRecord: function(record) {
      try {
        var key = 'tk_payments_ledger';
        var list = JSON.parse(localStorage.getItem(key) || '[]');
        var exists = list.some(function(item) {
          return item.invoiceNo === record.invoiceNo || (record.paymentId && item.paymentId === record.paymentId);
        });
        if (!exists) {
          list.unshift(record);
          localStorage.setItem(key, JSON.stringify(list));
        }
      } catch (e) {
        console.warn('Local ledger storage error:', e);
      }
    },

    getLocalPayments: function() {
      try {
        return JSON.parse(localStorage.getItem('tk_payments_ledger') || '[]');
      } catch (e) {
        return [];
      }
    },

    searchRecord: function(query, phone) {
      var records = this.getLocalPayments();
      var q = (query || '').trim().toUpperCase();
      var p = (phone || '').trim().replace(/\D/g, '');

      return records.filter(function(r) {
        var matchInv = q && (r.invoiceNo || '').toUpperCase() === q;
        var rPhone = (r.phone || '').replace(/\D/g, '');
        var matchPhone = p && rPhone.indexOf(p) !== -1;

        if (q && p) return matchInv && matchPhone;
        if (q) return matchInv;
        if (p) return matchPhone;
        return false;
      });
    },

    // Build the clean HTML structure of the VIP A4 Invoice Document
    buildInvoiceHTML: function(data) {
      var cfg = (window.TK_CONFIG && window.TK_CONFIG.business) || {
        name: "TK Web Solutions",
        tagline: "From Dreams.... to Digital Reality",
        founder: "Tarun Singh",
        founderTitle: "Founder & Lead Developer",
        address: "Bharatpur, Rajasthan, 321001, India",
        phone: "+91 90793 68240",
        email: "tkwebsolution1301@gmail.com",
        website: "https://tkwebsolutions.in",
        logoPath: "logo.png",
        signaturePath: "assets/tarun-singh-signature.png"
      };

      var invoiceNo = data.invoiceNo || data.receiptNo || 'TK-INV-2026-000000';
      var datetime = data.datetime || data.date || this.getISTDateTime();
      var customerName = data.name || data.customerName || 'Valued Client';
      var businessName = data.business || data.businessName || '';
      var phone = data.phone || '';
      var email = data.email || '';
      var serviceName = data.service || data.purpose || 'Digital Web Engineering';
      var amount = parseInt(data.amount || 0);
      var paymentId = data.paymentId || data.upiRef || data.razorpay_payment_id || 'RZP_DIRECT';
      var method = data.method || 'Online Payment (Razorpay)';
      var formattedAmt = '₹' + amount.toLocaleString('en-IN');

      return '<div class="tk-inv-sheet" id="tkInvoicePrintArea">' +
        // Header
        '<div class="tk-inv-header">' +
          '<div class="tk-inv-brand-box">' +
            '<img src="' + cfg.logoPath + '" alt="' + cfg.name + '" class="tk-inv-brand-logo" onerror="this.src=\'https://tkwebsolutions.in/logo.png\'">' +
            '<div>' +
              '<h1 class="tk-inv-company-title">' + cfg.name + '</h1>' +
              '<p class="tk-inv-company-tagline">"' + cfg.tagline + '"</p>' +
              '<p class="tk-inv-company-meta">' + cfg.address + '<br>Phone: ' + cfg.phone + ' | Email: ' + cfg.email + '<br>Web: tkwebsolutions.in</p>' +
            '</div>' +
          '</div>' +
          '<div class="tk-inv-meta-right">' +
            '<div class="tk-inv-badge-pill">Tax Invoice / Receipt</div>' +
            '<div class="tk-inv-id-text">Invoice #: ' + invoiceNo + '</div>' +
            '<div class="tk-inv-date-text">Date: ' + datetime + '</div>' +
            '<div class="tk-inv-status-tag">PAID &amp; CONFIRMED</div>' +
          '</div>' +
        '</div>' +

        // Details Grid
        '<div class="tk-inv-grid">' +
          '<div class="tk-inv-grid-col">' +
            '<h4>Billed To (Customer Details):</h4>' +
            '<div class="tk-inv-client-name">' + customerName + '</div>' +
            (businessName ? '<div class="tk-inv-info-row"><strong>Business:</strong> ' + businessName + '</div>' : '') +
            (phone ? '<div class="tk-inv-info-row"><strong>Phone:</strong> ' + phone + '</div>' : '') +
            (email ? '<div class="tk-inv-info-row"><strong>Email:</strong> ' + email + '</div>' : '') +
          '</div>' +
          '<div class="tk-inv-grid-col">' +
            '<h4>Payment Verification:</h4>' +
            '<div class="tk-inv-info-row"><strong>Method:</strong> ' + method + '</div>' +
            '<div class="tk-inv-info-row"><strong>Transaction ID:</strong> <span style="font-family:monospace;font-weight:700;">' + paymentId + '</span></div>' +
            '<div class="tk-inv-info-row"><strong>Currency:</strong> INR (₹)</div>' +
            '<div class="tk-inv-info-row"><strong>Verification:</strong> Instant Live Auto-Verified</div>' +
          '</div>' +
        '</div>' +

        // Itemized Table
        '<table class="tk-inv-table">' +
          '<thead>' +
            '<tr>' +
              '<th style="width:40px;">#</th>' +
              '<th>Service Description</th>' +
              '<th style="width:60px;text-align:center;">Qty</th>' +
              '<th style="width:100px;text-align:right;">Rate</th>' +
              '<th style="width:110px;text-align:right;">Amount (INR)</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr>' +
              '<td>1</td>' +
              '<td>' +
                '<strong>' + serviceName + '</strong>' +
                '<div class="tk-inv-item-desc">High-performance digital engineering delivered with founder-level dedication &amp; 30-day technical warranty.</div>' +
              '</td>' +
              '<td style="text-align:center;">1</td>' +
              '<td style="text-align:right;">' + formattedAmt + '</td>' +
              '<td style="text-align:right;"><strong>' + formattedAmt + '</strong></td>' +
            '</tr>' +
          '</tbody>' +
          '<tfoot>' +
            '<tr>' +
              '<td colspan="3"></td>' +
              '<td style="text-align:right;color:#64748b;">Subtotal:</td>' +
              '<td style="text-align:right;color:#0f172a;font-weight:700;">' + formattedAmt + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td colspan="3"></td>' +
              '<td style="text-align:right;color:#64748b;">Taxes / GST:</td>' +
              '<td style="text-align:right;color:#16a34a;font-weight:700;">₹0.00 (Exempt/N.A.)</td>' +
            '</tr>' +
            '<tr class="tk-inv-total-row">' +
              '<td colspan="3"></td>' +
              '<td style="text-align:right;"><strong>TOTAL PAID:</strong></td>' +
              '<td style="text-align:right;"><span class="tk-inv-grand-total">' + formattedAmt + '</span></td>' +
            '</tr>' +
          '</tfoot>' +
        '</table>' +

        // Signatory & Terms
        '<div class="tk-inv-footer-wrap">' +
          '<div class="tk-inv-terms-box">' +
            '<h4>Terms &amp; Information:</h4>' +
            '<ul>' +
              '<li>This document is an official computer-generated digital tax receipt &amp; payment confirmation.</li>' +
              '<li>Includes 30-day post-delivery technical warranty &amp; founder assistance.</li>' +
              '<li>For questions or project milestone updates, message directly at <strong>+91 90793 68240</strong>.</li>' +
            '</ul>' +
          '</div>' +
          '<div class="tk-inv-signatory-box">' +
            '<img src="' + cfg.signaturePath + '" alt="Tarun Singh Signature" class="tk-inv-sig-img" onerror="this.src=\'assets/tarun-singh-signature.png\'">' +
            '<div class="tk-inv-sig-line"></div>' +
            '<div class="tk-inv-sig-name">' + cfg.founder + '</div>' +
            '<div class="tk-inv-sig-role">Authorized Signatory • ' + cfg.founderTitle + '</div>' +
            '<div class="tk-inv-sig-biz">' + cfg.name + '</div>' +
          '</div>' +
        '</div>' +

        // Bottom Note
        '<div class="tk-inv-bottom-tagline">' +
          'Thank you for partnering with TK Web Solutions! • Official Portal: https://tkwebsolutions.in • Support: tkwebsolution1301@gmail.com' +
        '</div>' +
      '</div>';
    },

    // Display high-end Centered Glassmorphism Popup Modal
    showInvoiceModal: function(data) {
      ensureStylesInjected();

      var existing = document.getElementById('tk-invoice-modal');
      if (existing) existing.remove();

      this._currentInvoiceData = data;
      var invoiceHTML = this.buildInvoiceHTML(data);

      var modal = document.createElement('div');
      modal.id = 'tk-invoice-modal';
      modal.className = 'tk-modal-overlay';
      modal.innerHTML = 
        '<div class="tk-modal-card">' +
          '<div class="tk-modal-topbar">' +
            '<div class="tk-modal-top-title"><i class="fas fa-file-invoice-dollar"></i> Official Payment Invoice &amp; Receipt</div>' +
            '<div class="tk-modal-btns">' +
              '<button onclick="window.TK_INVOICE.printInvoice()" class="tk-m-btn tk-m-btn-print"><i class="fas fa-print"></i> Download / Print PDF</button>' +
              '<button onclick="window.TK_INVOICE.shareWhatsApp()" class="tk-m-btn tk-m-btn-wa"><i class="fab fa-whatsapp"></i> Share WhatsApp</button>' +
              '<button onclick="window.TK_INVOICE.emailInvoiceCopy()" class="tk-m-btn tk-m-btn-email"><i class="fas fa-envelope"></i> Send to Email</button>' +
              '<button onclick="document.getElementById(\'tk-invoice-modal\').remove()" class="tk-m-btn tk-m-btn-close" aria-label="Close">&times;</button>' +
            '</div>' +
          '</div>' +
          '<div class="tk-modal-body">' +
            invoiceHTML +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);

      // Close when clicking outside modal card
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
      });

      // Auto-trigger email dispatch if email is available
      if (data.email && data.email.indexOf('@') !== -1) {
        this.dispatchInvoiceEmail(data);
      }
    },

    // Print & PDF generation with vector crisp styles
    printInvoice: function() {
      var printArea = document.getElementById('tkInvoicePrintArea');
      if (!printArea) return;

      var printWin = window.open('', '_blank', 'width=920,height=1000');
      if (!printWin) {
        window.print();
        return;
      }

      printWin.document.write('<!DOCTYPE html><html><head><title>Invoice — ' + (this._currentInvoiceData ? (this._currentInvoiceData.invoiceNo || 'TK-INV') : 'TK-INV') + '</title>');
      printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">');
      printWin.document.write('<style>');
      printWin.document.write(`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0d1635; background: #fff; padding: 24px; }
        .tk-inv-sheet { width: 100%; max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .tk-inv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 20px; }
        .tk-inv-brand-box { display: flex; align-items: center; gap: 14px; }
        .tk-inv-brand-logo { width: 56px; height: 56px; object-fit: contain; }
        .tk-inv-company-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0b1736; margin-bottom: 2px; }
        .tk-inv-company-tagline { font-size: 11px; font-style: italic; color: #4338ca; margin-bottom: 4px; }
        .tk-inv-company-meta { font-size: 11px; color: #64748b; line-height: 1.4; }
        .tk-inv-meta-right { text-align: right; }
        .tk-inv-badge-pill { display: inline-block; background: #0052ff; color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 6px; }
        .tk-inv-id-text { font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .tk-inv-date-text { font-size: 11px; color: #64748b; margin-bottom: 3px; }
        .tk-inv-status-tag { font-size: 11px; font-weight: 800; color: #16a34a; }
        .tk-inv-grid { display: flex; justify-content: space-between; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; }
        .tk-inv-grid-col h4 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 6px; }
        .tk-inv-client-name { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .tk-inv-info-row { font-size: 11px; color: #475569; margin-bottom: 2px; }
        .tk-inv-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .tk-inv-table th { background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; padding: 9px 12px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; color: #475569; text-align: left; }
        .tk-inv-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #1e293b; }
        .tk-inv-item-desc { font-size: 10.5px; color: #64748b; margin-top: 2px; }
        .tk-inv-table tfoot td { padding: 6px 12px; font-size: 11.5px; }
        .tk-inv-total-row td { border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 10px 12px; font-size: 13px; }
        .tk-inv-grand-total { font-size: 18px; font-weight: 800; color: #0052ff; }
        .tk-inv-footer-wrap { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px; }
        .tk-inv-terms-box { font-size: 10.5px; color: #64748b; max-width: 440px; }
        .tk-inv-terms-box h4 { font-size: 10.5px; font-weight: 800; color: #334155; margin-bottom: 4px; }
        .tk-inv-terms-box ul { padding-left: 14px; line-height: 1.45; }
        .tk-inv-signatory-box { text-align: center; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 10px 14px; background: #fafafa; min-width: 180px; }
        .tk-inv-sig-img { max-width: 150px; max-height: 44px; object-fit: contain; margin: 0 auto 3px; display: block; }
        .tk-inv-sig-line { width: 100%; height: 1px; background: #94a3b8; margin: 3px 0 5px; }
        .tk-inv-sig-name { font-size: 11.5px; font-weight: 800; color: #0f172a; }
        .tk-inv-sig-role { font-size: 10px; color: #64748b; }
        .tk-inv-sig-biz { font-size: 10px; font-weight: 700; color: #0052ff; }
        .tk-inv-bottom-tagline { margin-top: 16px; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 10px; font-size: 10.5px; color: #94a3b8; }
        @media print {
          body { padding: 0; background: #fff; }
          .tk-inv-sheet { border: none; padding: 0; }
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

    shareWhatsApp: function() {
      if (!this._currentInvoiceData) return;
      var d = this._currentInvoiceData;
      var msg = '🧾 *TK Web Solutions — Official Payment Receipt*\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '📋 *Invoice Number:* ' + (d.invoiceNo || d.receiptNo) + '\n' +
        '👤 *Customer:* ' + d.name + (d.business ? ' (' + d.business + ')' : '') + '\n' +
        '🌐 *Service:* ' + d.service + '\n' +
        '💰 *Amount Paid:* ₹' + parseInt(d.amount).toLocaleString('en-IN') + '\n' +
        '🔖 *Payment ID:* ' + (d.paymentId || d.upiRef || 'N/A') + '\n' +
        '✅ *Status:* PAID & CONFIRMED ✓\n' +
        '📅 *Date & Time:* ' + (d.datetime || d.date) + '\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '🔗 *View & Download Official PDF Invoice:*\n' +
        'https://tkwebsolutions.in/invoice.html?inv=' + (d.invoiceNo || d.receiptNo) + '\n\n' +
        '🙏 Thank you for choosing TK Web Solutions!\n' +
        '🌐 tkwebsolutions.in | +91 90793 68240\n' +
        '"From Dreams.... to Digital Reality"';

      var waUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank');
    },

    emailInvoiceCopy: function() {
      if (!this._currentInvoiceData) return;
      var d = this._currentInvoiceData;
      var existingEmail = (d.email && d.email.indexOf('@') !== -1 && d.email.indexOf('***') === -1) ? d.email : '';
      
      // Remove any existing email popup
      var oldPop = document.getElementById('tk-email-prompt-overlay');
      if (oldPop) oldPop.remove();

      var pop = document.createElement('div');
      pop.id = 'tk-email-prompt-overlay';
      pop.style.cssText = 'position:fixed;inset:0;background:rgba(3,7,18,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;animation:tkFadeIn 0.2s ease-out;';
      pop.innerHTML = `
        <div style="max-width:440px;width:100%;background:#090e1f;color:#fff;padding:28px;border-radius:20px;border:1.5px solid rgba(0,229,255,0.35);box-shadow:0 30px 80px rgba(0,0,0,0.85);position:relative;font-family:'DM Sans',sans-serif;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h3 style="font-family:'Syne',sans-serif;font-size:1.1rem;color:#fff;margin:0;display:flex;align-items:center;gap:8px;"><i class="fas fa-envelope" style="color:#00e5ff;"></i> Send Invoice to Email</h3>
            <button id="tkEmailPromptClose" style="background:rgba(255,255,255,0.1);border:none;color:#94a3b8;font-size:1.3rem;cursor:pointer;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;line-height:1;">&times;</button>
          </div>
          <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin-bottom:18px;">Your official TK Web Solutions PDF invoice will be delivered to this email address.</p>
          <div style="margin-bottom:18px;">
            <label style="font-size:0.75rem;color:#cbd5e1;display:block;margin-bottom:6px;font-weight:600;">Email Address *</label>
            <input type="email" id="tkEmailPromptInput" value="${existingEmail}" placeholder="client@example.com" style="width:100%;background:rgba(255,255,255,0.06);border:1.5px solid rgba(0,229,255,0.3);border-radius:10px;padding:12px 14px;color:#fff;font-size:0.9rem;outline:none;box-sizing:border-box;font-family:'DM Sans',sans-serif;">
          </div>
          <div style="display:flex;gap:10px;">
            <button id="tkEmailPromptCancel" style="flex:1;background:rgba(255,255,255,0.08);color:#cbd5e1;padding:12px;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;font-family:'DM Sans',sans-serif;">Cancel</button>
            <button id="tkEmailPromptSubmit" style="flex:2;background:linear-gradient(135deg,#0052ff,#00d4ff);color:#fff;padding:12px;border:none;border-radius:10px;font-weight:800;font-size:0.92rem;cursor:pointer;font-family:'Syne',sans-serif;box-shadow:0 4px 14px rgba(0,150,255,0.35);">Send Invoice</button>
          </div>
          <div id="tkEmailPromptMsg" style="margin-top:14px;font-size:0.82rem;text-align:center;display:none;"></div>
        </div>
      `;

      document.body.appendChild(pop);

      var self = this;
      var closeBtn = document.getElementById('tkEmailPromptClose');
      var cancelBtn = document.getElementById('tkEmailPromptCancel');
      var submitBtn = document.getElementById('tkEmailPromptSubmit');
      var inputEl = document.getElementById('tkEmailPromptInput');
      var msgEl = document.getElementById('tkEmailPromptMsg');

      function closePop() {
        if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
      }

      closeBtn.onclick = closePop;
      cancelBtn.onclick = closePop;
      pop.onclick = function(e) { if (e.target === pop) closePop(); };

      submitBtn.onclick = function() {
        var email = inputEl.value.trim();
        if (!email || email.indexOf('@') === -1) {
          msgEl.style.display = 'block';
          msgEl.style.color = '#f87171';
          msgEl.textContent = 'Please enter a valid email address.';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Invoice...';
        msgEl.style.display = 'none';

        d.email = email;
        var url = (window.TK_CONFIG && window.TK_CONFIG.api && window.TK_CONFIG.api.appsScriptUrl) || 'https://script.google.com/macros/s/AKfycbyVscaGuEj3V9YkeYJ3TpACLHdwRXHivcHWjnk7vPWFEoW0gBxskIWi0WQTGTCPYK1I6A/exec';

        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'sendInvoiceEmail',
            invoiceNo: d.invoiceNo,
            name: d.name,
            email: email,
            phone: d.phone,
            amount: d.amount,
            service: d.service,
            paymentId: d.paymentId,
            datetime: d.datetime
          })
        })
        .then(function(r) { return r.json(); })
        .then(function(res) {
          submitBtn.textContent = 'Invoice Sent ✓';
          msgEl.style.display = 'block';
          msgEl.style.color = '#4ade80';
          msgEl.innerHTML = '✓ Official PDF Invoice sent successfully to <strong>' + email + '</strong>.';
          setTimeout(closePop, 2400);
        })
        .catch(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Invoice';
          msgEl.style.display = 'block';
          msgEl.style.color = '#f87171';
          msgEl.textContent = 'Unable to send right now. You can download the PDF directly using the Download button.';
        });
      };
    },

    dispatchInvoiceEmail: function(data, isManual) {
      this.emailInvoiceCopy();
    }
  };

  // Pre-inject styles when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureStylesInjected);
  } else {
    ensureStylesInjected();
  }

  window.TK_INVOICE = InvoiceSystem;
})(window);
