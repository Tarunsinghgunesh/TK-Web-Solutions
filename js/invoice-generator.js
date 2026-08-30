/**
 * TK Web Solutions — Professional Invoice & Receipt Generator
 * Generates verified, print-ready A4 invoices and receipts with real business details,
 * official logo, itemized billing, and founder digital signature.
 */

(function(window) {
  'use strict';

  var InvoiceSystem = {
    // Generate unique invoice number: TK-INV-2026-XXXXXX
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

    // Save payment record to local ledger for instant offline lookup and user history
    savePaymentRecord: function(record) {
      try {
        var key = 'tk_payments_ledger';
        var list = JSON.parse(localStorage.getItem(key) || '[]');
        // Check for duplicates by invoiceNo or paymentId
        var exists = list.some(function(item) {
          return item.invoiceNo === record.invoiceNo || (record.paymentId && item.paymentId === record.paymentId);
        });
        if (!exists) {
          list.unshift(record);
          localStorage.setItem(key, JSON.stringify(list));
        }
      } catch (e) {
        console.warn('Local ledger storage not available:', e);
      }
    },

    // Retrieve local payment records
    getLocalPayments: function() {
      try {
        return JSON.parse(localStorage.getItem('tk_payments_ledger') || '[]');
      } catch (e) {
        return [];
      }
    },

    // Search payment by invoiceNo + phone, or phone
    searchRecord: function(query, phone) {
      var records = this.getLocalPayments();
      var q = (query || '').trim().toUpperCase();
      var p = (phone || '').trim().replace(/\D/g, '');

      return records.filter(function(r) {
        var matchInv = q && (r.invoiceNo || '').toUpperCase() === q;
        var rPhone = (r.phone || '').replace(/\D/g, '');
        var matchPhone = p && rPhone.indexOf(p) !== -1;

        if (q && p) {
          return matchInv && matchPhone;
        } else if (q) {
          return matchInv;
        } else if (p) {
          return matchPhone;
        }
        return false;
      });
    },

    // Build the HTML structure for a standard professional A4 Invoice / Receipt
    buildInvoiceHTML: function(data, isFullPage) {
      var cfg = (window.TK_CONFIG && window.TK_CONFIG.business) || {
        name: "TK Web Solutions",
        founder: "Tarun Singh",
        address: "Bharatpur, Rajasthan, India",
        phone: "+91 90793 68240",
        email: "tkwebsolution1301@gmail.com",
        website: "https://tkwebsolutions.in",
        logoPath: "logo.png",
        signaturePath: "assets/tarun-singh-signature.svg"
      };

      var invoiceNo = data.invoiceNo || data.receiptNo || 'TK-INV-2026-000000';
      var datetime = data.datetime || data.date || this.getISTDateTime();
      var customerName = data.name || data.customerName || 'Valued Client';
      var businessName = data.business || data.businessName || '';
      var phone = data.phone || '';
      var email = data.email || '';
      var serviceName = data.service || data.purpose || 'Digital Web Service';
      var amount = parseInt(data.amount || 0);
      var paymentId = data.paymentId || data.upiRef || data.razorpay_payment_id || 'RZP_DIRECT';
      var method = data.method || 'Online Payment (Razorpay)';
      var status = data.status || 'PAID / CONFIRMED';

      var formattedAmt = '₹' + amount.toLocaleString('en-IN');

      return '<div class="tk-inv-doc" id="tkInvoicePrintArea">' +
        // Invoice Header
        '<div class="tk-inv-header">' +
          '<div class="tk-inv-brand">' +
            '<img src="' + cfg.logoPath + '" alt="' + cfg.name + '" class="tk-inv-logo" onerror="this.style.display=\'none\'">' +
            '<div>' +
              '<h1 class="tk-inv-title">' + cfg.name + '</h1>' +
              '<p class="tk-inv-tagline">"From Dreams.... to Digital Reality"</p>' +
              '<p class="tk-inv-meta">' + cfg.address + '<br>Phone: ' + cfg.phone + ' | Email: ' + cfg.email + '<br>Web: tkwebsolutions.in</p>' +
            '</div>' +
          '</div>' +
          '<div class="tk-inv-type-box">' +
            '<div class="tk-inv-badge">' + (data.isCare ? 'CARE SUBSCRIPTION' : 'PAYMENT RECEIPT') + '</div>' +
            '<div class="tk-inv-num"><strong>Invoice No:</strong> ' + invoiceNo + '</div>' +
            '<div class="tk-inv-date"><strong>Date & Time:</strong> ' + datetime + '</div>' +
            '<div class="tk-inv-status tk-status-paid">● ' + status + '</div>' +
          '</div>' +
        '</div>' +

        '<hr class="tk-inv-divider">' +

        // Bill To & Transaction Info
        '<div class="tk-inv-details-grid">' +
          '<div class="tk-inv-col">' +
            '<h3 class="tk-inv-sec-h">Billed To (Customer Details):</h3>' +
            '<p class="tk-inv-client-name"><strong>' + customerName + '</strong></p>' +
            (businessName ? '<p class="tk-inv-client-biz">' + businessName + '</p>' : '') +
            (phone ? '<p class="tk-inv-client-detail"><i class="fas fa-phone-alt"></i> ' + phone + '</p>' : '') +
            (email ? '<p class="tk-inv-client-detail"><i class="fas fa-envelope"></i> ' + email + '</p>' : '') +
          '</div>' +
          '<div class="tk-inv-col tk-inv-col-right">' +
            '<h3 class="tk-inv-sec-h">Payment Information:</h3>' +
            '<p><strong>Payment Method:</strong> ' + method + '</p>' +
            '<p><strong>Transaction Ref / ID:</strong> ' + paymentId + '</p>' +
            '<p><strong>Currency:</strong> INR (₹)</p>' +
            '<p><strong>Verification:</strong> Instant Online Auto-Verified</p>' +
          '</div>' +
        '</div>' +

        // Itemized Table
        '<table class="tk-inv-table">' +
          '<thead>' +
            '<tr>' +
              '<th style="width:50px;">#</th>' +
              '<th>Service Description</th>' +
              '<th style="width:80px;text-align:center;">Qty</th>' +
              '<th style="width:120px;text-align:right;">Rate</th>' +
              '<th style="width:130px;text-align:right;">Amount (INR)</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr>' +
              '<td style="text-align:center;">1</td>' +
              '<td>' +
                '<strong>' + serviceName + '</strong>' +
                '<div class="tk-inv-item-desc">High-performance digital solution delivered with founder-level dedication & 30 days post-launch support.</div>' +
              '</td>' +
              '<td style="text-align:center;">1</td>' +
              '<td style="text-align:right;">' + formattedAmt + '</td>' +
              '<td style="text-align:right;"><strong>' + formattedAmt + '</strong></td>' +
            '</tr>' +
          '</tbody>' +
          '<tfoot>' +
            '<tr>' +
              '<td colspan="3" class="tk-inv-blank"></td>' +
              '<td style="text-align:right;"><strong>Subtotal:</strong></td>' +
              '<td style="text-align:right;">' + formattedAmt + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td colspan="3" class="tk-inv-blank"></td>' +
              '<td style="text-align:right;"><strong>Taxes / GST:</strong></td>' +
              '<td style="text-align:right;">₹0.00 (Exempt/N.A.)</td>' +
            '</tr>' +
            '<tr class="tk-inv-total-row">' +
              '<td colspan="3" class="tk-inv-blank"></td>' +
              '<td style="text-align:right;"><strong>TOTAL PAID:</strong></td>' +
              '<td style="text-align:right;"><span class="tk-inv-grand-total">' + formattedAmt + '</span></td>' +
            '</tr>' +
          '</tfoot>' +
        '</table>' +

        // Signatory & Notes Block
        '<div class="tk-inv-footer-block">' +
          '<div class="tk-inv-terms">' +
            '<h4>Terms & Information:</h4>' +
            '<ul>' +
              '<li>This document serves as an official computer-generated payment confirmation.</li>' +
              '<li>All projects include 30-day post-delivery technical warranty.</li>' +
              '<li>For assistance or queries, message directly at <strong>+91 90793 68240</strong>.</li>' +
            '</ul>' +
          '</div>' +
          '<div class="tk-inv-signatory">' +
            '<div class="tk-sig-wrap">' +
              '<img src="' + cfg.signaturePath + '" alt="Tarun Singh Signature" class="tk-sig-img" onerror="this.outerHTML=\'<div style=\\\'font-family:cursive;font-size:22px;color:#0033aa;margin:10px 0;\\\'>Tarun Singh</div>\'">' +
            '</div>' +
            '<div class="tk-sig-line"></div>' +
            '<div class="tk-sig-name"><strong>' + cfg.founder + '</strong></div>' +
            '<div class="tk-sig-role">Authorized Signatory • ' + cfg.founderTitle + '</div>' +
            '<div class="tk-sig-biz">' + cfg.name + '</div>' +
          '</div>' +
        '</div>' +

        // Clean Footer
        '<div class="tk-inv-bottom-note">' +
          '<p>Thank you for partnering with TK Web Solutions! Your digital growth begins here.</p>' +
          '<p class="tk-inv-subtext">Official Digital Portal: https://tkwebsolutions.in | Support: tkwebsolution1301@gmail.com</p>' +
        '</div>' +
      '</div>';
    },

    // Display professional interactive invoice preview modal
    showInvoiceModal: function(data) {
      var self = this;
      var existing = document.getElementById('tk-invoice-modal');
      if (existing) existing.remove();

      var invoiceHTML = this.buildInvoiceHTML(data, false);
      var modal = document.createElement('div');
      modal.id = 'tk-invoice-modal';
      modal.className = 'tk-modal-overlay';
      modal.innerHTML = 
        '<div class="tk-modal-card">' +
          '<div class="tk-modal-topbar">' +
            '<div class="tk-modal-top-title"><i class="fas fa-file-invoice-dollar"></i> Official Payment Invoice & Receipt</div>' +
            '<div class="tk-modal-btns">' +
              '<button onclick="window.TK_INVOICE.printInvoice()" class="tk-m-btn tk-m-btn-print"><i class="fas fa-print"></i> Print / Download PDF</button>' +
              '<button onclick="window.TK_INVOICE.shareWhatsApp()" class="tk-m-btn tk-m-btn-wa"><i class="fab fa-whatsapp"></i> Share on WhatsApp</button>' +
              '<button onclick="document.getElementById(\'tk-invoice-modal\').remove()" class="tk-m-btn tk-m-btn-close" aria-label="Close">&times;</button>' +
            '</div>' +
          '</div>' +
          '<div class="tk-modal-body" id="tkModalBody">' +
            invoiceHTML +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);
      this._currentInvoiceData = data;

      // Close on backdrop click
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
      });
    },

    // Print & PDF generation helper
    printInvoice: function() {
      var printArea = document.getElementById('tkInvoicePrintArea');
      if (!printArea) return;

      var printWin = window.open('', '_blank', 'width=900,height=1000');
      if (!printWin) {
        window.print();
        return;
      }

      printWin.document.write('<!DOCTYPE html><html><head><title>Invoice — ' + (this._currentInvoiceData ? this._currentInvoiceData.invoiceNo : 'TK-INV') + '</title>');
      printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">');
      printWin.document.write('<style>' + this.getPrintStyles() + '</style>');
      printWin.document.write('</head><body style="margin:0;padding:20px;background:#fff;">');
      printWin.document.write(printArea.outerHTML);
      printWin.document.write('</body></html>');
      printWin.document.close();

      setTimeout(function() {
        printWin.focus();
        printWin.print();
      }, 400);
    },

    // Share via WhatsApp helper
    shareWhatsApp: function() {
      if (!this._currentInvoiceData) return;
      var d = this._currentInvoiceData;
      var msg = '🧾 *TK Web Solutions — Payment Confirmation*\n\n' +
        '*Invoice No:* ' + (d.invoiceNo || d.receiptNo) + '\n' +
        '*Customer:* ' + d.name + '\n' +
        '*Service:* ' + d.service + '\n' +
        '*Amount:* ₹' + parseInt(d.amount).toLocaleString('en-IN') + '\n' +
        '*Status:* Confirmed (PAID) ✓\n' +
        '*Date:* ' + (d.datetime || d.date) + '\n\n' +
        'Verify anytime online at: https://tkwebsolutions.in/invoice.html?inv=' + (d.invoiceNo || d.receiptNo);
      
      var url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');
    },

    getPrintStyles: function() {
      return `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #0d1635; line-height: 1.5; font-size: 13px; }
        .tk-inv-doc { max-width: 800px; margin: 0 auto; background: #fff; padding: 36px 40px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .tk-inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .tk-inv-brand { display: flex; align-items: center; gap: 16px; }
        .tk-inv-logo { width: 56px; height: 56px; object-fit: contain; }
        .tk-inv-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #0b1736; margin-bottom: 2px; }
        .tk-inv-tagline { font-size: 11px; font-style: italic; color: #4338ca; margin-bottom: 6px; }
        .tk-inv-meta { font-size: 11px; color: #64748b; line-height: 1.5; }
        .tk-inv-type-box { text-align: right; }
        .tk-inv-badge { display: inline-block; background: #1a56ff; color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 8px; }
        .tk-inv-num { font-size: 13px; color: #0f172a; margin-bottom: 3px; }
        .tk-inv-date { font-size: 11px; color: #64748b; margin-bottom: 4px; }
        .tk-status-paid { font-weight: 800; color: #16a34a; font-size: 12px; }
        .tk-inv-divider { border: none; border-top: 2px solid #e2e8f0; margin: 20px 0; }
        .tk-inv-details-grid { display: flex; justify-content: space-between; margin-bottom: 28px; gap: 24px; }
        .tk-inv-col { flex: 1; }
        .tk-inv-sec-h { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; font-weight: 700; }
        .tk-inv-client-name { font-size: 15px; color: #0f172a; margin-bottom: 2px; }
        .tk-inv-client-biz { font-size: 12px; color: #475569; margin-bottom: 4px; }
        .tk-inv-client-detail { font-size: 11px; color: #64748b; margin-bottom: 2px; }
        .tk-inv-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
        .tk-inv-table th { background: #f8fafc; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; text-align: left; }
        .tk-inv-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #1e293b; vertical-align: top; }
        .tk-inv-item-desc { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.4; }
        .tk-inv-table tfoot td { padding: 8px 12px; font-size: 12px; }
        .tk-inv-table tfoot tr.tk-inv-total-row td { border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 12px; font-size: 14px; }
        .tk-inv-grand-total { font-size: 18px; font-weight: 800; color: #1a56ff; }
        .tk-inv-footer-block { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .tk-inv-terms { max-width: 420px; font-size: 10.5px; color: #64748b; }
        .tk-inv-terms h4 { font-size: 11px; color: #334155; margin-bottom: 4px; }
        .tk-inv-terms ul { padding-left: 16px; line-height: 1.5; }
        .tk-inv-signatory { text-align: center; width: 220px; }
        .tk-sig-wrap { min-height: 50px; display: flex; align-items: center; justify-content: center; }
        .tk-sig-img { max-width: 180px; max-height: 48px; object-fit: contain; }
        .tk-sig-line { width: 100%; height: 1px; background: #94a3b8; margin: 4px auto 6px; }
        .tk-sig-name { font-size: 12px; color: #0f172a; }
        .tk-sig-role { font-size: 10px; color: #64748b; }
        .tk-sig-biz { font-size: 10px; font-weight: 700; color: #1a56ff; }
        .tk-inv-bottom-note { margin-top: 28px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 14px; font-size: 11px; color: #64748b; }
        .tk-inv-subtext { font-size: 10px; color: #94a3b8; margin-top: 2px; }
        @media print {
          body { background: #fff; padding: 0; }
          .tk-inv-doc { border: none; padding: 0; width: 100%; max-width: 100%; }
        }
      `;
    }
  };

  window.TK_INVOICE = InvoiceSystem;
})(window);
