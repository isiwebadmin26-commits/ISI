import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/jira.js';
import analyticsHandler from './api/analytics.js';
import { isCorporateEmail, CORPORATE_EMAIL_ERROR_MESSAGE } from './api/corporateEmail.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ISI Advanced Website Intelligence & Analytics endpoint
app.all('/api/analytics*', (req, res) => {
  return analyticsHandler(req, res);
});

// Jira Lead Webhook endpoint
app.all('/api/jira', (req, res) => {
  return handler(req, res);
});

// Chatbot Leads endpoint with corporate email validation
app.post('/api/chatbot-leads', (req, res) => {
  const email = (req.body && req.body.email) || '';
  if (!isCorporateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: CORPORATE_EMAIL_ERROR_MESSAGE,
      message: CORPORATE_EMAIL_ERROR_MESSAGE,
      rejected: true
    });
  }
  res.json({ success: true, message: 'Chatbot lead received' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Return HTTP 410 Gone for removed spam route
app.use(['/need-protection-money-properties-vip-escort-services', '/need-protection-money-properties-vip-escort-services/*'], (req, res) => {
  res.status(410).set('X-Robots-Tag', 'noindex, nofollow').send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>410 Gone | ISI Security</title></head><body><h1>410 Gone</h1><p>This resource has been permanently removed.</p><p><a href="https://www.isisecurity.in/">Return to ISI Security</a></p></body></html>');
});

app.listen(PORT, () => {
  console.log(`🚀 Jira Integration Server running on http://localhost:${PORT}`);
});
