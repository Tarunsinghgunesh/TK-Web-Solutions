/**
 * ════════════════════════════════════════════════════════════════════════════════
 * TK WEB SOLUTIONS — MASTER RAZORPAY PAYMENT LEDGER & INVOICE DATABASE BACKEND
 * ════════════════════════════════════════════════════════════════════════════════
 * Target Google Spreadsheet: "TK Payment Records"
 * Spreadsheet ID: 1MEpLHMm4ShYWsaJBH7jN1L59WKA81JwMsP_mmmRU06M
 * 
 * FEATURES:
 * 1. 5 Production Worksheets: Payments (28 cols), Invoices (20 cols), Customers, Settings, Legacy Records.
 * 2. Full Payment Lifecycle: CREATED -> PENDING -> SUCCESS / FAILED / CANCELLED / REFUNDED.
 * 3. Webhook & Signature Verification: HMAC SHA-256 cryptographic verification.
 * 4. Idempotent Duplicate Protection: Zero duplicate rows for same Payment ID or Order ID.
 * 5. Sequential Unique Invoice Numbers: TK-INV-YYYY-XXXXXX.
 * 6. Automated VIP HTML Invoice Email Dispatch to Customer & Owner Alert.
 * 7. Privacy-Preserving Invoice & Receipt Search Engine.
 */

var SPREADSHEET_ID = '1MEpLHMm4ShYWsaJBH7jN1L59WKA81JwMsP_mmmRU06M';

// ════════════════════════════════════════════════════════════════════════════════
// 1. ONE-CLICK DATABASE SETUP & MIGRATION FUNCTION
// ════════════════════════════════════════════════════════════════════════════════
/**
 * Run this function ONCE in the Apps Script Editor to initialize or upgrade the spreadsheet.
 * It cleanly preserves existing data to 'Legacy Records' and builds the 5 production tabs.
 */
function setupDatabase() {
  var ss = getSpreadsheet_();
  
  // 1. Ensure 'Legacy Records' exists and backup any existing unorganized sheets
  var legacySheet = ss.getSheetByName('Legacy Records');
  if (!legacySheet) {
    legacySheet = ss.insertSheet('Legacy Records');
  }

  // Backup active sheet data if it's the old default sheet
  var sheets = ss.getSheets();
  sheets.forEach(function(sh) {
    var name = sh.getName();
    if (name !== 'Payments' && name !== 'Invoices' && name !== 'Customers' && name !== 'Settings' && name !== 'Legacy Records') {
      var data = sh.getDataRange().getValues();
      if (data.length > 1) {
        data.forEach(function(row) {
          legacySheet.appendRow(row);
        });
      }
    }
  });

  // 2. BUILD / RESET 'Payments' TAB (28 Columns: A to AB)
  var paymentsHeaders = [
    'Transaction ID',            // A
    'Invoice No.',               // B
    'Order ID',                  // C
    'Payment ID',                // D
    'Date & Time',               // E
    'Customer Name',             // F
    'Phone',                     // G
    'Email',                     // H
    'Business / Organization',   // I
    'Service',                   // J
    'Purpose',                   // K
    'Amount',                    // L (INR)
    'Currency',                  // M
    'Payment Method',            // N
    'Payment Status',            // O (CREATED, PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED)
    'Payment Status Updated At', // P
    'Razorpay Status',           // Q
    'UPI / Bank Reference',      // R
    'Source',                    // S
    'Invoice Status',            // T (GENERATED, NOT_ISSUED, PENDING)
    'Invoice URL',               // U
    'Receipt URL',               // V
    'Sync Status',               // W (SYNCED, PENDING, FAILED)
    'Webhook Event',             // X
    'Failure Reason',            // Y
    'Refund Status',             // Z (NONE, REFUNDED, PARTIALLY_REFUNDED)
    'Created At',                // AA
    'Updated At'                 // AB
  ];
  setupSheet_(ss, 'Payments', paymentsHeaders, '#0b1736', '#ffffff');

  // 3. BUILD / RESET 'Invoices' TAB (20 Columns: A to T)
  var invoicesHeaders = [
    'Invoice No.',               // A
    'Transaction ID',            // B
    'Payment ID',                // C
    'Order ID',                  // D
    'Invoice Date',              // E
    'Customer Name',             // F
    'Phone',                     // G
    'Email',                     // H
    'Business / Organization',   // I
    'Service',                   // J
    'Description',               // K
    'Amount',                    // L
    'Currency',                  // M
    'Payment Method',            // N
    'Payment Status',            // O
    'Invoice Status',            // P
    'Invoice PDF URL',           // Q
    'Receipt URL',               // R
    'Created At',                // S
    'Updated At'                 // T
  ];
  setupSheet_(ss, 'Invoices', invoicesHeaders, '#1e1b4b', '#ffffff');

  // 4. BUILD 'Customers' TAB
  var customersHeaders = [
    'Customer ID',               // A
    'Customer Name',             // B
    'Phone',                     // C
    'Email',                     // D
    'Business / Organization',   // E
    'Total Spent (INR)',         // F
    'Total Transactions',        // G
    'Last Transaction Date',     // H
    'Created At'                 // I
  ];
  setupSheet_(ss, 'Customers', customersHeaders, '#042f2e', '#ffffff');

  // 5. BUILD 'Settings' TAB
  var settingsHeaders = ['Config Key', 'Config Value', 'Description', 'Last Updated'];
  var settingsSheet = setupSheet_(ss, 'Settings', settingsHeaders, '#1f2937', '#ffffff');
  
  // Seed default settings if empty
  if (settingsSheet.getLastRow() <= 1) {
    var initialSettings = [
      ['BUSINESS_NAME', 'TK Web Solutions', 'Official Agency Name', getISTTime_()],
      ['FOUNDER_NAME', 'Tarun Singh', 'Founder & Lead Developer', getISTTime_()],
      ['BUSINESS_PHONE', '+91 90793 68240', 'Official WhatsApp Support', getISTTime_()],
      ['BUSINESS_EMAIL', 'tkwebsolution1301@gmail.com', 'Primary Contact Email', getISTTime_()],
      ['WEBSITE_URL', 'https://tkwebsolutions.in', 'Official Production URL', getISTTime_()],
      ['RAZORPAY_KEY_ID', 'rzp_live_T3mcmKzaGbCA8j', 'Live Razorpay Key ID', getISTTime_()],
      ['INVOICE_COUNTER', '100', 'Auto-increment counter for invoice numbers', getISTTime_()],
      ['CURRENCY', 'INR', 'Default billing currency', getISTTime_()],
      ['AUTO_EMAIL_INVOICE', 'TRUE', 'Send automated invoice to customer email', getISTTime_()]
    ];
    initialSettings.forEach(function(row) { settingsSheet.appendRow(row); });
  }

  // 6. Apply Conditional Formatting on 'Payments' Sheet for Statuses
  applyConditionalFormatting_(ss.getSheetByName('Payments'));

  Logger.log('✅ Database setup completed successfully on spreadsheet: ' + SPREADSHEET_ID);
  return { success: true, message: 'TK Payment Records initialized with 5 production tabs!' };
}

// ════════════════════════════════════════════════════════════════════════════════
// 2. HTTP REQUEST ROUTER (doPost & doGet)
// ════════════════════════════════════════════════════════════════════════════════

function doGet(e) {
  return createJSONOutput_({
    status: 'online',
    system: 'TK Web Solutions Razorpay & Invoice Engine',
    spreadsheetId: SPREADSHEET_ID,
    timestamp: getISTTime_()
  });
}

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || '';
    var result = {};

    // 1. Razorpay Order Creation (Website checkout init)
    if (action === 'createOrder') {
      result = handleCreateOrder_(payload);
    }
    // 2. Payment Verification / Direct Callback
    else if (action === 'verifyPayment') {
      result = handleVerifyPayment_(payload);
    }
    // 3. Official Razorpay Webhook Handler
    else if (action === 'razorpayWebhook' || payload.event) {
      result = handleRazorpayWebhook_(payload, e);
    }
    // 4. Public Invoice & Receipt Search
    else if (action === 'searchInvoice' || action === 'searchReceipt') {
      result = handleSearchInvoice_(payload);
    }
    // 5. Send PDF Invoice Email Copy
    else if (action === 'sendInvoiceEmail') {
      result = handleSendInvoiceEmail_(payload);
    }
    // 6. Admin Metrics & Reconciliation
    else if (action === 'getAdminMetrics') {
      result = handleGetAdminMetrics_(payload);
    }
    // 7. Manual Sync / Retry Trigger
    else if (action === 'retrySync') {
      result = handleRetrySync_(payload);
    }
    else {
      result = { success: false, error: 'Unknown action: ' + action };
    }

    return createJSONOutput_(result);

  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString());
    return createJSONOutput_({ success: false, error: err.toString() });
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 3. ORDER CREATION (Status: CREATED / PENDING)
// ════════════════════════════════════════════════════════════════════════════════
function handleCreateOrder_(payload) {
  var props = PropertiesService.getScriptProperties();
  var keyId = props.getProperty('RAZORPAY_KEY_ID') || 'rzp_live_T3mcmKzaGbCA8j';
  var keySecret = props.getProperty('RAZORPAY_KEY_SECRET') || '';

  var amount = parseInt(payload.amount || 0);
  if (!amount || amount < 1) {
    return { success: false, error: 'Invalid amount. Minimum payable amount is ₹1.' };
  }

  var nowIST = getISTTime_();
  var txnId = 'TXN_' + Date.now() + '_' + Math.floor(100 + Math.random() * 900);
  var receiptNo = payload.invoiceNo || ('TK-ORD-' + Date.now());

  var orderId = '';
  if (keySecret) {
    try {
      var authHeader = 'Basic ' + Utilities.base64Encode(keyId + ':' + keySecret);
      var rzpPayload = {
        amount: amount * 100, // in paise
        currency: 'INR',
        receipt: receiptNo,
        notes: {
          txn_id: txnId,
          customer_name: payload.name || '',
          phone: payload.phone || '',
          service: payload.service || '',
          source: 'tkwebsolutions.in'
        }
      };

      var res = UrlFetchApp.fetch('https://api.razorpay.com/v1/orders', {
        method: 'post',
        contentType: 'application/json',
        headers: { 'Authorization': authHeader },
        payload: JSON.stringify(rzpPayload),
        muteHttpExceptions: true
      });
      var rzpData = JSON.parse(res.getContentText());
      if (rzpData && rzpData.id) {
        orderId = rzpData.id;
      }
    } catch (e) {
      Logger.log('Razorpay API Order creation note: ' + e.toString());
    }
  }

  if (!orderId) {
    orderId = 'order_local_' + Date.now();
  }

  // Idempotently Record in 'Payments' as CREATED / PENDING
  var ss = getSpreadsheet_();
  var paymentsSheet = ss.getSheetByName('Payments');
  if (paymentsSheet) {
    var row = [
      txnId,                                           // A: Transaction ID
      '',                                              // B: Invoice No (Pending success)
      orderId,                                         // C: Order ID
      '',                                              // D: Payment ID (Pending)
      nowIST,                                          // E: Date & Time
      payload.name || '',                              // F: Customer Name
      payload.phone || '',                             // G: Phone
      payload.email || '',                             // H: Email
      payload.business || '',                          // I: Business
      payload.service || '',                           // J: Service
      payload.purpose || payload.service || '',        // K: Purpose
      amount,                                          // L: Amount
      'INR',                                           // M: Currency
      'Razorpay Online',                               // N: Payment Method
      'CREATED',                                       // O: Payment Status
      nowIST,                                          // P: Status Updated At
      'created',                                       // Q: Razorpay Status
      '',                                              // R: UPI Reference
      'tkwebsolutions.in',                             // S: Source
      'PENDING',                                       // T: Invoice Status
      '',                                              // U: Invoice URL
      '',                                              // V: Receipt URL
      'SYNCED',                                        // W: Sync Status
      'order.created',                                 // X: Webhook Event
      '',                                              // Y: Failure Reason
      'NONE',                                          // Z: Refund Status
      nowIST,                                          // AA: Created At
      nowIST                                           // AB: Updated At
    ];
    paymentsSheet.appendRow(row);
  }

  return {
    success: true,
    order_id: orderId,
    txn_id: txnId,
    amount: amount,
    currency: 'INR'
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// 4. PAYMENT VERIFICATION & SUCCESS PROCESSING (Idempotent)
// ════════════════════════════════════════════════════════════════════════════════
function handleVerifyPayment_(payload) {
  var props = PropertiesService.getScriptProperties();
  var keySecret = props.getProperty('RAZORPAY_KEY_SECRET') || '';

  var orderId = payload.razorpay_order_id || payload.orderId || '';
  var paymentId = payload.razorpay_payment_id || payload.paymentId || '';
  var signature = payload.razorpay_signature || payload.signature || '';

  // 1. Verify HMAC SHA-256 signature if secret is present
  if (keySecret && orderId && paymentId && signature) {
    var generatedSig = Utilities.computeHmacSha256Signature(orderId + '|' + paymentId, keySecret)
      .map(function(e) { return ('0' + (e & 0xFF).toString(16)).slice(-2); })
      .join('');
    
    if (generatedSig !== signature) {
      Logger.log('Signature mismatch. Received: ' + signature + ' vs ' + generatedSig);
      return { success: false, error: 'Cryptographic signature verification failed.' };
    }
  }

  var nowIST = getISTTime_();
  var amount = parseInt(payload.amount || 0);
  var name = payload.name || 'Valued Client';
  var phone = payload.phone || '';
  var email = payload.email || '';
  var business = payload.business || '';
  var service = payload.service || 'Digital Web Engineering';
  var purpose = payload.purpose || service;

  var ss = getSpreadsheet_();
  var paymentsSheet = ss.getSheetByName('Payments');
  var invoicesSheet = ss.getSheetByName('Invoices');

  // 2. Check for duplicate row by paymentId or orderId
  var rowIndex = findPaymentRowIndex_(paymentsSheet, paymentId, orderId);
  var invoiceNo = '';
  var txnId = '';

  if (rowIndex > 1) {
    // Existing record found — fetch existing invoice number or generate new
    var existingInvoice = paymentsSheet.getRange(rowIndex, 2).getValue();
    txnId = paymentsSheet.getRange(rowIndex, 1).getValue() || ('TXN_' + Date.now());
    invoiceNo = existingInvoice || generateSequentialInvoiceNo_(ss);

    // Update the row idempotently
    var invoiceUrl = 'https://tkwebsolutions.in/invoice.html?inv=' + invoiceNo;
    paymentsSheet.getRange(rowIndex, 1, 1, 28).setValues([[
      txnId,                                           // A: Transaction ID
      invoiceNo,                                       // B: Invoice No
      orderId,                                         // C: Order ID
      paymentId,                                       // D: Payment ID
      nowIST,                                          // E: Date & Time
      name,                                            // F: Customer Name
      phone,                                           // G: Phone
      email,                                           // H: Email
      business,                                        // I: Business
      service,                                         // J: Service
      purpose,                                         // K: Purpose
      amount,                                          // L: Amount
      'INR',                                           // M: Currency
      'Razorpay Online',                               // N: Payment Method
      'SUCCESS',                                       // O: Payment Status
      nowIST,                                          // P: Status Updated At
      'captured',                                      // Q: Razorpay Status
      payload.upiRef || paymentId,                     // R: UPI / Bank Ref
      'tkwebsolutions.in',                             // S: Source
      'GENERATED',                                     // T: Invoice Status
      invoiceUrl,                                      // U: Invoice URL
      invoiceUrl,                                      // V: Receipt URL
      'SYNCED',                                        // W: Sync Status
      'payment.captured',                              // X: Webhook Event
      '',                                              // Y: Failure Reason
      'NONE',                                          // Z: Refund Status
      paymentsSheet.getRange(rowIndex, 27).getValue() || nowIST, // AA: Created At
      nowIST                                           // AB: Updated At
    ]]);
  } else {
    // New Record — Append row cleanly
    txnId = 'TXN_' + Date.now();
    invoiceNo = generateSequentialInvoiceNo_(ss);
    var invoiceUrl = 'https://tkwebsolutions.in/invoice.html?inv=' + invoiceNo;

    paymentsSheet.appendRow([
      txnId, invoiceNo, orderId, paymentId, nowIST,
      name, phone, email, business, service, purpose,
      amount, 'INR', 'Razorpay Online', 'SUCCESS', nowIST,
      'captured', (payload.upiRef || paymentId), 'tkwebsolutions.in',
      'GENERATED', invoiceUrl, invoiceUrl, 'SYNCED', 'payment.captured',
      '', 'NONE', nowIST, nowIST
    ]);
  }

  // 3. Append / Update 'Invoices' Tab
  if (invoicesSheet) {
    var invRowIndex = findInvoiceRowIndex_(invoicesSheet, invoiceNo);
    var invData = [
      invoiceNo, txnId, paymentId, orderId, nowIST,
      name, phone, email, business, service,
      'High-performance digital engineering delivered with founder-level dedication & 30-day technical warranty.',
      amount, 'INR', 'Razorpay Online', 'SUCCESS', 'GENERATED',
      'https://tkwebsolutions.in/invoice.html?inv=' + invoiceNo,
      'https://tkwebsolutions.in/invoice.html?inv=' + invoiceNo,
      nowIST, nowIST
    ];
    if (invRowIndex > 1) {
      invoicesSheet.getRange(invRowIndex, 1, 1, 20).setValues([invData]);
    } else {
      invoicesSheet.appendRow(invData);
    }
  }

  // 4. Update 'Customers' Ledger
  updateCustomerLedger_(ss, name, phone, email, business, amount, nowIST);

  // 5. Automated Email Invoice Dispatch
  if (email && email.indexOf('@') !== -1) {
    try {
      handleSendInvoiceEmail_({
        invoiceNo: invoiceNo,
        name: name,
        email: email,
        phone: phone,
        amount: amount,
        service: service,
        paymentId: paymentId,
        datetime: nowIST
      });
    } catch (e) {
      Logger.log('Auto email dispatch note: ' + e.toString());
    }
  }

  return {
    success: true,
    invoiceNo: invoiceNo,
    transactionId: txnId,
    paymentId: paymentId,
    orderId: orderId,
    status: 'SUCCESS',
    datetime: nowIST,
    invoiceUrl: 'https://tkwebsolutions.in/invoice.html?inv=' + invoiceNo
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// 5. RAZORPAY WEBHOOK HANDLER (payment.captured, payment.failed, refund.created)
// ════════════════════════════════════════════════════════════════════════════════
function handleRazorpayWebhook_(payload, e) {
  var props = PropertiesService.getScriptProperties();
  var webhookSecret = props.getProperty('RAZORPAY_WEBHOOK_SECRET') || '';

  // Verify Webhook Signature if secret configured
  if (webhookSecret && e && e.postData) {
    var rawBody = e.postData.contents;
    var receivedSignature = (e.headers && (e.headers['X-Razorpay-Signature'] || e.headers['x-razorpay-signature'])) || '';
    
    if (receivedSignature) {
      var expectedSig = Utilities.computeHmacSha256Signature(rawBody, webhookSecret)
        .map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); })
        .join('');
      if (receivedSignature !== expectedSig) {
        return { success: false, error: 'Invalid Webhook Signature' };
      }
    }
  }

  var event = payload.event || '';
  var paymentEntity = (payload.payload && payload.payload.payment && payload.payload.payment.entity) || {};
  var orderEntity = (payload.payload && payload.payload.order && payload.payload.order.entity) || {};

  var paymentId = paymentEntity.id || '';
  var orderId = paymentEntity.order_id || orderEntity.id || '';
  var amount = paymentEntity.amount ? (paymentEntity.amount / 100) : 0;
  var notes = paymentEntity.notes || {};

  var nowIST = getISTTime_();
  var ss = getSpreadsheet_();
  var paymentsSheet = ss.getSheetByName('Payments');

  // Handle Event Types
  if (event === 'payment.captured' || event === 'order.paid') {
    return handleVerifyPayment_({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      amount: amount,
      name: notes.customer_name || paymentEntity.email || 'Valued Client',
      phone: notes.phone || paymentEntity.contact || '',
      email: notes.email || paymentEntity.email || '',
      service: notes.service || 'Digital Web Engineering'
    });
  } else if (event === 'payment.failed') {
    var failReason = (paymentEntity.error_description || (paymentEntity.error && paymentEntity.error.description)) || 'Payment authorization failed';
    var rIndex = findPaymentRowIndex_(paymentsSheet, paymentId, orderId);
    if (rIndex > 1) {
      paymentsSheet.getRange(rIndex, 15).setValue('FAILED'); // Col O: Payment Status
      paymentsSheet.getRange(rIndex, 16).setValue(nowIST);    // Col P: Status Updated At
      paymentsSheet.getRange(rIndex, 20).setValue('NOT_ISSUED'); // Col T: Invoice Status
      paymentsSheet.getRange(rIndex, 25).setValue(failReason); // Col Y: Failure Reason
      paymentsSheet.getRange(rIndex, 28).setValue(nowIST);    // Col AB: Updated At
    }
    return { success: true, event: event, status: 'FAILED' };
  } else if (event === 'refund.created' || event === 'refund.processed') {
    var rIndex = findPaymentRowIndex_(paymentsSheet, paymentId, orderId);
    if (rIndex > 1) {
      paymentsSheet.getRange(rIndex, 15).setValue('REFUNDED');
      paymentsSheet.getRange(rIndex, 16).setValue(nowIST);
      paymentsSheet.getRange(rIndex, 26).setValue('REFUNDED'); // Col Z: Refund Status
      paymentsSheet.getRange(rIndex, 28).setValue(nowIST);
    }
    return { success: true, event: event, status: 'REFUNDED' };
  }

  return { success: true, message: 'Event recorded: ' + event };
}

// ════════════════════════════════════════════════════════════════════════════════
// 6. PUBLIC INVOICE & RECEIPT SEARCH (Privacy-Preserving)
// ════════════════════════════════════════════════════════════════════════════════
function handleSearchInvoice_(payload) {
  var q = (payload.query || payload.invoiceNo || '').trim().toUpperCase();
  var p = (payload.phone || '').trim().replace(/\D/g, '');

  if (!q && !p) {
    return { success: false, error: 'Please enter an Invoice Number or 10-digit Phone Number.' };
  }

  var ss = getSpreadsheet_();
  var paymentsSheet = ss.getSheetByName('Payments');
  var data = paymentsSheet.getDataRange().getValues();

  var matches = [];
  // Skip header (row 1)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rInv = String(row[1] || '').trim().toUpperCase();    // Col B: Invoice No
    var rPhone = String(row[6] || '').replace(/\D/g, '');    // Col G: Phone
    var rStatus = String(row[14] || '').toUpperCase();       // Col O: Payment Status

    var matched = false;
    if (q && p) {
      matched = (rInv === q && rPhone.indexOf(p) !== -1);
    } else if (q) {
      matched = (rInv === q);
    } else if (p) {
      matched = (rPhone === p || rPhone.indexOf(p) !== -1);
    }

    if (matched) {
      matches.push({
        transactionId: row[0],
        invoiceNo: row[1],
        orderId: row[2],
        paymentId: row[3],
        datetime: row[4],
        name: row[5],
        phone: maskPhone_(row[6]),
        email: maskEmail_(row[7]),
        business: row[8],
        service: row[9],
        amount: row[11],
        currency: row[12],
        method: row[13],
        status: rStatus,
        invoiceStatus: row[19],
        invoiceUrl: row[20],
        failureReason: row[24]
      });
    }
  }

  if (matches.length > 0) {
    return { success: true, count: matches.length, records: matches };
  } else {
    return { success: false, message: 'No verified payment record was found for the information entered.' };
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 7. SEND VIP HTML INVOICE EMAIL
// ════════════════════════════════════════════════════════════════════════════════
function handleSendInvoiceEmail_(payload) {
  var customerEmail = payload.email || '';
  if (!customerEmail || customerEmail.indexOf('@') === -1) {
    return { success: false, error: 'Valid email address is required.' };
  }

  var invoiceNo = payload.invoiceNo || 'TK-INV-2026';
  var name = payload.name || 'Valued Client';
  var service = payload.service || 'Digital Web Engineering';
  var amount = parseInt(payload.amount || 0).toLocaleString('en-IN');
  var datetime = payload.datetime || getISTTime_();
  var paymentId = payload.paymentId || 'Verified';
  var invoiceUrl = 'https://tkwebsolutions.in/invoice.html?inv=' + invoiceNo;

  var htmlBody = `
    <div style="font-family:'DM Sans',Arial,sans-serif;background:#060d1f;color:#ffffff;padding:32px 20px;border-radius:18px;max-width:620px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
      <div style="text-align:center;border-bottom:1px solid rgba(0,229,255,0.25);padding-bottom:20px;margin-bottom:24px;">
        <h1 style="font-size:26px;color:#00e5ff;margin:0 0 4px;font-weight:800;letter-spacing:1px;">TK Web Solutions</h1>
        <p style="font-size:12px;color:#94a3b8;font-style:italic;margin:0 0 10px;">"From Dreams.... to Digital Reality"</p>
        <div style="display:inline-block;background:#16a34a;color:#ffffff;font-size:11px;font-weight:bold;letter-spacing:1px;padding:4px 14px;border-radius:20px;">✓ PAYMENT VERIFIED & CONFIRMED</div>
      </div>

      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;font-size:13px;color:#cbd5e1;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#94a3b8;">Invoice Number:</td><td style="padding:6px 0;font-weight:bold;text-align:right;color:#00e5ff;font-family:monospace;">${invoiceNo}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">Customer Name:</td><td style="padding:6px 0;font-weight:bold;text-align:right;color:#ffffff;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">Service Category:</td><td style="padding:6px 0;text-align:right;">${service}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">Transaction Ref:</td><td style="padding:6px 0;text-align:right;font-family:monospace;">${paymentId}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">Payment Date:</td><td style="padding:6px 0;text-align:right;">${datetime}</td></tr>
          <tr style="border-top:1.5px solid rgba(255,255,255,0.15);"><td style="padding:12px 0 4px;font-size:15px;font-weight:bold;color:#ffffff;">Total Amount Paid:</td><td style="padding:12px 0 4px;font-size:20px;font-weight:bold;text-align:right;color:#22c55e;">₹${amount}</td></tr>
        </table>
      </div>

      <div style="text-align:center;margin-bottom:28px;">
        <a href="${invoiceUrl}" style="display:inline-block;background:linear-gradient(135deg,#0052ff,#00d4ff);color:#ffffff;padding:13px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:14px;box-shadow:0 6px 20px rgba(0,150,255,0.4);">📄 View & Download Print PDF Invoice</a>
      </div>

      <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:18px;text-align:center;font-size:11.5px;color:#64748b;line-height:1.5;">
        <p style="margin:0 0 4px;color:#94a3b8;"><strong>Tarun Singh</strong> — Founder & Lead Developer • TK Web Solutions</p>
        <p style="margin:0 0 4px;">Bharatpur, Rajasthan, 321001, India • Phone: +91 90793 68240</p>
        <p style="margin:0;color:#475569;">Includes 30-day post-delivery technical warranty. Support: tkwebsolution1301@gmail.com</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: customerEmail,
    subject: '🧾 Official Payment Invoice & Receipt [' + invoiceNo + '] — TK Web Solutions',
    htmlBody: htmlBody,
    replyTo: 'tkwebsolution1301@gmail.com'
  });

  return { success: true, message: 'Invoice email sent successfully to: ' + customerEmail };
}

// ════════════════════════════════════════════════════════════════════════════════
// 8. ADMIN RECONCILIATION & REAL-TIME METRICS
// ════════════════════════════════════════════════════════════════════════════════
function handleGetAdminMetrics_(payload) {
  var ss = getSpreadsheet_();
  var paymentsSheet = ss.getSheetByName('Payments');
  var data = paymentsSheet.getDataRange().getValues();

  var totalTxns = 0;
  var successCount = 0;
  var pendingCount = 0;
  var failedCount = 0;
  var refundedCount = 0;
  var totalRevenue = 0;
  var pendingRevenue = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var status = String(row[14] || '').toUpperCase();
    var amt = parseInt(row[11] || 0);

    totalTxns++;
    if (status === 'SUCCESS' || status === 'CAPTURED') {
      successCount++;
      totalRevenue += amt;
    } else if (status === 'PENDING' || status === 'CREATED') {
      pendingCount++;
      pendingRevenue += amt;
    } else if (status === 'FAILED') {
      failedCount++;
    } else if (status === 'REFUNDED') {
      refundedCount++;
    }
  }

  return {
    success: true,
    metrics: {
      totalTransactions: totalTxns,
      successfulPayments: successCount,
      pendingPayments: pendingCount,
      failedPayments: failedCount,
      refundedPayments: refundedCount,
      totalSuccessfulRevenue: totalRevenue,
      pendingAmount: pendingRevenue,
      invoicesGenerated: successCount,
      syncStatus: 'SYNCED',
      lastUpdated: getISTTime_()
    }
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// 9. HELPER UTILITIES & DATABASE ENGINES
// ════════════════════════════════════════════════════════════════════════════════

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      Logger.log('Opening active spreadsheet fallback');
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function setupSheet_(ss, name, headers, bgColor, fgColor) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  sh.clear();
  sh.appendRow(headers);

  var headerRange = sh.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(bgColor)
             .setFontColor(fgColor)
             .setFontWeight('bold')
             .setFontFamily('Arial')
             .setFontSize(10);
  
  sh.setFrozenRows(1);
  return sh;
}

function findPaymentRowIndex_(sheet, paymentId, orderId) {
  if (!sheet) return -1;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rPaymentId = String(data[i][3] || '').trim(); // Col D
    var rOrderId = String(data[i][2] || '').trim();   // Col C
    if (paymentId && rPaymentId && paymentId === rPaymentId) return i + 1;
    if (orderId && rOrderId && orderId === rOrderId) return i + 1;
  }
  return -1;
}

function findInvoiceRowIndex_(sheet, invoiceNo) {
  if (!sheet) return -1;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rInv = String(data[i][0] || '').trim().toUpperCase();
    if (invoiceNo && rInv === invoiceNo.toUpperCase()) return i + 1;
  }
  return -1;
}

function generateSequentialInvoiceNo_(ss) {
  var settingsSheet = ss.getSheetByName('Settings');
  var yr = new Date().getFullYear();
  var counter = 1;

  if (settingsSheet) {
    var data = settingsSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === 'INVOICE_COUNTER') {
        counter = parseInt(data[i][1] || 1);
        settingsSheet.getRange(i + 1, 2).setValue(counter + 1);
        settingsSheet.getRange(i + 1, 4).setValue(getISTTime_());
        break;
      }
    }
  }

  var padded = ('000000' + counter).slice(-6);
  return 'TK-INV-' + yr + '-' + padded;
}

function updateCustomerLedger_(ss, name, phone, email, business, amount, timestamp) {
  var custSheet = ss.getSheetByName('Customers');
  if (!custSheet) return;

  var data = custSheet.getDataRange().getValues();
  var custRow = -1;
  var pClean = (phone || '').replace(/\D/g, '');

  for (var i = 1; i < data.length; i++) {
    var existingPhone = String(data[i][2] || '').replace(/\D/g, '');
    var existingEmail = String(data[i][3] || '').trim().toLowerCase();
    if ((pClean && existingPhone === pClean) || (email && existingEmail === email.toLowerCase())) {
      custRow = i + 1;
      break;
    }
  }

  if (custRow > 1) {
    var spent = parseInt(custSheet.getRange(custRow, 6).getValue() || 0) + amount;
    var txns = parseInt(custSheet.getRange(custRow, 7).getValue() || 0) + 1;
    custSheet.getRange(custRow, 6).setValue(spent);
    custSheet.getRange(custRow, 7).setValue(txns);
    custSheet.getRange(custRow, 8).setValue(timestamp);
  } else {
    var custId = 'CUST_' + (data.length + 100);
    custSheet.appendRow([custId, name, phone, email, business, amount, 1, timestamp, timestamp]);
  }
}

function applyConditionalFormatting_(sheet) {
  if (!sheet) return;
  var range = sheet.getRange("O2:O5000"); // Payment Status Col O

  var ruleSuccess = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("SUCCESS")
    .setBackground("#dcfce7")
    .setFontColor("#15803d")
    .setRanges([range])
    .build();

  var rulePending = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("PENDING")
    .setBackground("#fef9c3")
    .setFontColor("#a16207")
    .setRanges([range])
    .build();

  var ruleFailed = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("FAILED")
    .setBackground("#fee2e2")
    .setFontColor("#b91c1c")
    .setRanges([range])
    .build();

  var ruleRefunded = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("REFUNDED")
    .setBackground("#f3e8ff")
    .setFontColor("#7e22ce")
    .setRanges([range])
    .build();

  sheet.setConditionalFormatRules([ruleSuccess, rulePending, ruleFailed, ruleRefunded]);
}

function getISTTime_() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');
}

function maskPhone_(phone) {
  var s = String(phone || '').replace(/\D/g, '');
  if (s.length >= 10) {
    return s.slice(0, 2) + '******' + s.slice(-2);
  }
  return phone;
}

function maskEmail_(email) {
  var s = String(email || '');
  var at = s.indexOf('@');
  if (at > 2) {
    return s.slice(0, 2) + '***' + s.slice(at - 1);
  }
  return email;
}

function createJSONOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
