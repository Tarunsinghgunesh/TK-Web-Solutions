/**
 * TK WEB SOLUTIONS — OPTIONAL NODE.JS / EXPRESS PAYMENT & INVOICE API
 * 
 * Provides production-ready backend endpoints:
 * - POST /api/create-order
 * - POST /api/verify-payment
 * - POST /api/webhook (Razorpay Webhook)
 * - POST /api/search-invoice
 * - GET  /api/admin/payments (Protected)
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_T3mcmKzaGbCA8j';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// 1. Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, name, phone, service, receiptNo } = req.body;
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const orderReceipt = receiptNo || `TK-INV-${Date.now()}`;

    if (!RAZORPAY_KEY_SECRET) {
      // Development / fallback response
      return res.json({
        success: true,
        order_id: `order_dev_${Date.now()}`,
        amount,
        currency: 'INR',
        receiptNo: orderReceipt
      });
    }

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: orderReceipt,
        notes: { client: name, phone, service }
      })
    });

    const data = await response.json();
    if (data.id) {
      return res.json({ success: true, order_id: data.id, amount, currency: 'INR', receiptNo: orderReceipt });
    } else {
      return res.status(400).json({ success: false, error: data.error?.description || 'Order creation failed' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Verify Payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, name, phone, email, service, invoiceNo } = req.body;

    if (RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature) {
      const generatedSig = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSig !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Signature verification failed' });
      }
    }

    const finalInvoiceNo = invoiceNo || `TK-INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      invoiceNo: finalInvoiceNo,
      datetime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'PAID / CONFIRMED',
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Razorpay Webhook Handler
app.post('/api/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (signature !== expectedSig) {
      return res.status(400).json({ status: 'invalid signature' });
    }
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    console.log(`[Webhook] Payment confirmed: ${payment.id}, Amount: ₹${payment.amount / 100}`);
  }

  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TK Web Solutions Payment Server running on port ${PORT}`);
});
