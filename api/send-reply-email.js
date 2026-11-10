// api/send-reply-email.js - Vercel Serverless Function to Send Automated Form Reply Emails
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable SMTP transporter
function createTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || 'poojasri.aram@gmail.com';
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || 'India@2050';
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);

  // If using Gmail host or standard user
  if (host.includes('gmail.com') || user.includes('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 7000
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 7000
  });
}

/**
 * Generates custom subject line based on the form filled
 */
function getEmailSubject(formType, leadNumber) {
  const ref = leadNumber ? ` [Ref: ${leadNumber}]` : '';
  const type = String(formType || '').toLowerCase();

  if (type.includes('career') || type.includes('job')) {
    return `Job Application Received - ISI Security Careers${ref}`;
  }
  if (type.includes('academy') || type.includes('course') || type.includes('training')) {
    return `Academy Training Inquiry Received - ISI Academy${ref}`;
  }
  if (type.includes('sales') || type.includes('enterprise') || type.includes('facility')) {
    return `Enterprise Consultation Request Received - ISI Security${ref}`;
  }
  if (type.includes('consultation') || type.includes('school') || type.includes('campus')) {
    return `Campus Safety Consultation Request Received - ISI Security${ref}`;
  }
  if (type.includes('partner')) {
    return `Channel Partner Network Application Received - ISI Security${ref}`;
  }
  if (type.includes('tender') || type.includes('rfq')) {
    return `Tender RFQ Submission Received - ISI Security Bid Management${ref}`;
  }
  if (type.includes('chat')) {
    return `Thank You for Contacting ISI Security${ref}`;
  }
  return `Inquiry Received - ISI Security${ref}`;
}

// Team alert notification recipient lists
const EVERYONE_TEAM_RECIPIENTS = [
  'v.varshith@isisecurity.in',
  'v.vishal@isisecurity.in',
  'bv@trustflow.in',
  'poojasri.aram@gmail.com'
];

const CAREER_ALONE_RECIPIENTS = [
  'poojasri.aram@gmail.com'
];

/**
 * Builds high-conversion, professional HTML confirmation email for the applicant / prospect
 */
function buildHtmlBody({ name, formType, service, message, leadNumber }) {
  const safeName = (name || 'Valued Client').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const type = String(formType || '').toLowerCase();
  const year = new Date().getFullYear();

  let introText = '';
  let nextStepsHtml = '';

  if (type.includes('career') || type.includes('job')) {
    introText = `Thank you for applying for a career opportunity with <strong>ISI Security</strong>. Our Talent Acquisition &amp; Human Resources Team has received your application and credentials.`;
    nextStepsHtml = `
      <div style="background: #f8fafc; border-radius: 8px; padding: 18px 20px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700;">What Happens Next?</h4>
        <ol style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.6;">
          <li><strong>Profile Review:</strong> Our recruiters are screening your profile against our current operational requirements.</li>
          <li><strong>Shortlisting:</strong> If shortlisted, our HR team will contact you for an initial interview and verification.</li>
          <li><strong>Status Update:</strong> You will receive email/SMS notifications on the status of your application.</li>
        </ol>
      </div>
    `;
  } else if (type.includes('academy') || type.includes('course') || type.includes('training')) {
    introText = `Thank you for your inquiry regarding <strong>ISI Security Academy</strong>. Our Academic Director and Counseling Team have received your training request.`;
    nextStepsHtml = `
      <div style="background: #f8fafc; border-radius: 8px; padding: 18px 20px; margin: 20px 0; border-left: 4px solid #d97706;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700;">What to Expect Next:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.6;">
          <li>An Academic Counselor will contact you within 24 hours to explain the syllabus, batch timings, and certification paths.</li>
          <li>We will share the full CDAC-MEPZ and institutional program prospectus directly to your email.</li>
        </ul>
      </div>
    `;
  } else if (type.includes('partner')) {
    introText = `Thank you for applying to join the <strong>ISI Channel Partner Network</strong>. Our Strategic Alliances and Growth Division has received your application.`;
    nextStepsHtml = `
      <div style="background: #f8fafc; border-radius: 8px; padding: 18px 20px; margin: 20px 0; border-left: 4px solid #7c3aed;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700;">Next Steps:</h4>
        <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.6;">Our Partner Onboarding Team will evaluate your agency profile and reach out within 2 business days to schedule an introductory alliance discussion.</p>
      </div>
    `;
  } else {
    introText = `Thank you for reaching out to <strong>ISI Security</strong>. We have successfully registered your inquiry in our secure enterprise management system.`;
    nextStepsHtml = `
      <div style="background: #f8fafc; border-radius: 8px; padding: 18px 20px; margin: 20px 0; border-left: 4px solid #003380;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700;">Next Steps for Your Inquiry:</h4>
        <ol style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.6;">
          <li><strong>Requirement Evaluation:</strong> Our Solutions Engineering team is reviewing your requirements.</li>
          <li><strong>Consultant Connect:</strong> A Senior Security Consultant will reach out to you within 24 business hours.</li>
          <li><strong>Custom Assessment:</strong> We will provide a tailored risk analysis and service proposal.</li>
        </ol>
      </div>
    `;
  }

  const refBadge = leadNumber ? `
    <div style="margin: 15px 0; padding: 10px 16px; background: #eff6ff; border-radius: 6px; display: inline-block; font-size: 13px; color: #1e40af; font-weight: 600;">
      Reference ID: ${leadNumber}
    </div>
  ` : '';

  const serviceRow = service ? `
    <p style="margin: 6px 0; font-size: 13px; color: #64748b;"><strong>Subject / Service:</strong> ${service}</p>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ISI Security Confirmation</title>
</head>
<body style="margin: 0; padding: 25px 15px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #002255 0%, #003380 100%); padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">ISI SECURITY</h1>
      <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">Industrial Security &amp; Intelligence (India) Pvt. Ltd.</p>
    </div>

    <!-- BODY CONTENT -->
    <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
      <h2 style="font-size: 18px; color: #003380; font-weight: 700; margin: 0 0 14px 0;">Hello ${safeName},</h2>
      <p style="font-size: 14px; color: #334155; margin: 0 0 14px 0;">
        ${introText}
      </p>

      ${refBadge}
      ${serviceRow}
      ${nextStepsHtml}

      <!-- VALUE PILLARS -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Why Enterprises Trust ISI:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #64748b; line-height: 1.7;">
          <li>25+ Years of Proven Operational Security Excellence</li>
          <li>PSARA-Certified Manned Guarding &amp; Tactical Patrols</li>
          <li>AI-Driven Command Center &amp; Electronic Surveillance Fusion</li>
          <li>Integrated Hard &amp; Soft Facility Management Services</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="https://www.isisecurity.in/" style="display: inline-block; padding: 12px 28px; background: #003380; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; letter-spacing: 0.02em;">Visit ISI Security Official Website</a>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.6;">
      &copy; ${year} Industrial Security &amp; Intelligence (India) Pvt. Ltd. All rights reserved.<br>
      <strong>24/7 Operations Command Helpline:</strong> +91 40 2320 0000 &bull; <strong>Email:</strong> info@isisecurity.in<br>
      <span style="font-size: 11px; color: #94a3b8;">This is an automated confirmation of your website submission.</span>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Builds high-visibility HTML notification email for the internal team
 */
function buildTeamAlertHtml({ name, email, phone, company, formType, service, message, leadNumber, isCalendar, isCareer }) {
  const safeName = (name || 'Applicant / Prospect').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const title = isCalendar 
    ? '🗓️ New Academic Counseling & Calendar Session Booking'
    : (isCareer ? '📄 New Career / Job Application' : '💼 New Website Business Lead');

  const badgeColor = isCalendar ? '#d97706' : (isCareer ? '#10b981' : '#003380');
  const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: ${badgeColor}; color: #ffffff; padding: 22px 26px;">
        <span style="background: rgba(255,255,255,0.2); font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 9px; border-radius: 4px; letter-spacing: 0.05em;">Live Notification</span>
        <h2 style="margin: 8px 0 0 0; font-size: 18px; color: #ffffff;">${title}</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.85);">
          Ref: <strong>${leadNumber || 'ISI-Lead'}</strong> &bull; Received at ${nowIST} IST
        </p>
      </div>

      <div style="padding: 24px 26px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 35%;">Contact Name</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${safeName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email Address</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7; font-weight: 600; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Phone Number</td>
            <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #0284c7; font-weight: 600; text-decoration: none;">${phone || 'N/A'}</a></td>
          </tr>
          ${company ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Organization / Institution</td>
            <td style="padding: 10px 0; color: #0f172a;">${company}</td>
          </tr>` : ''}
          ${service ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Program / Subject</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${service}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Form Source</td>
            <td style="padding: 10px 0; color: #0f172a;">${formType || 'Website'}</td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 14px 0 6px 0; color: #64748b; font-weight: 600;" colspan="2">Booking Notes &amp; Session Preferences:</td>
          </tr>
          <tr>
            <td colspan="2" style="background: #f8fafc; border-radius: 8px; padding: 14px 16px; color: #334155; font-size: 13px; line-height: 1.6; border: 1px solid #e2e8f0;">
              ${message.replace(/\n/g, '<br/>')}
            </td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px;">
          <a href="mailto:${email}" style="display: inline-block; background: #003380; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">Reply to Prospect</a>
          ${phone ? `<a href="tel:${phone}" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">Call ${phone}</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Default API Request Handler
 */
export default async function handler(req, res) {
  // Allow POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { name, email, formType, service, message, leadNumber, phone, company } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email address is required' });
  }

  const cleanEmail = email.trim();
  const userSubject = getEmailSubject(formType, leadNumber);
  const userHtml = buildHtmlBody({ name, formType, service, message, leadNumber, phone, company });

  // Determine whether this is Career application or Calendar booking / General lead
  const isCareer = String(formType || '').toLowerCase().includes('career') || 
                   String(formType || '').toLowerCase().includes('job');

  const isCalendar = String(formType || '').toLowerCase().includes('academy') || 
                     String(message || '').includes('Preferred Date') ||
                     String(message || '').includes('Counseling Mode') ||
                     String(service || '').includes('Counseling');

  // Recipient routing:
  // For Career Applications: poojasri.aram@gmail.com ALONE
  // For Calendar Booking, Academy, Contact, Sales: EVERYONE
  const teamRecipients = isCareer ? CAREER_ALONE_RECIPIENTS : EVERYONE_TEAM_RECIPIENTS;

  const teamSubject = isCalendar
    ? `🗓️ [CALENDAR BOOKING] ${name || 'Prospect'} - ${service || 'Academic Counseling'}${leadNumber ? ` [Ref: ${leadNumber}]` : ''}`
    : (isCareer
        ? `📄 [CAREER APPLICATION] ${name || 'Applicant'} - ${service || 'Open Position'}`
        : `💼 [NEW LEAD] ${name || 'Lead'} - ${formType || 'Website'}${leadNumber ? ` [Ref: ${leadNumber}]` : ''}`);

  const teamHtml = buildTeamAlertHtml({ 
    name, 
    email: cleanEmail, 
    phone, 
    company, 
    formType, 
    service, 
    message, 
    leadNumber, 
    isCalendar, 
    isCareer 
  });

  try {
    const transporter = createTransporter();

    // 1. Send confirmation to applicant / prospect
    const userInfo = await transporter.sendMail({
      from: `"ISI Security" <${process.env.EMAIL_USER || 'poojasri.aram@gmail.com'}>`,
      to: cleanEmail,
      replyTo: 'info@isisecurity.in',
      subject: userSubject,
      html: userHtml
    });

    console.log(`✅ [User Confirmation Sent] To: ${cleanEmail} | MessageID: ${userInfo.messageId}`);

    // 2. Send notification alert to the team (Everyone for Calendar/Leads, poojasri.aram@gmail.com alone for Career)
    let teamInfo = null;
    try {
      teamInfo = await transporter.sendMail({
        from: `"ISI Alerts" <${process.env.EMAIL_USER || 'poojasri.aram@gmail.com'}>`,
        to: teamRecipients.join(','),
        replyTo: cleanEmail,
        subject: teamSubject,
        html: teamHtml
      });
      console.log(`✅ [Team Alert Sent] To: ${teamRecipients.join(', ')} | MessageID: ${teamInfo.messageId}`);
    } catch (teamMailErr) {
      console.error('⚠️ [Team Alert Failed]:', teamMailErr.message || teamMailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Confirmation auto-reply and team alert dispatched',
      userMessageId: userInfo.messageId,
      teamMessageId: teamInfo ? teamInfo.messageId : null,
      teamRecipients: teamRecipients
    });
  } catch (err) {
    console.error('❌ [Auto-Reply Error]:', err.message || err);
    // Return graceful 200 with error detail so frontend form submission is never blocked
    return res.status(200).json({
      success: false,
      warning: 'Auto-reply email dispatch could not complete',
      error: err.message
    });
  }
}
