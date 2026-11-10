/**
 * =========================================================================================
 * ISI SECURITY — GOOGLE APPS SCRIPT WEBHOOK & AUTOMATED EMAIL RESPONSE ENGINE
 * =========================================================================================
 * 
 * PURPOSE:
 * 1. Receives form submissions from the ISI Security website (https://www.isisecurity.in).
 * 2. AUTOMATICALLY sends a personalized, professional HTML confirmation reply email to
 *    WHOMEVER fills out ANY form on the website.
 * 3. Sends an internal lead alert with resume attachments to the ISI team.
 * 4. Logs all submission details into the target Google Sheet tab.
 * 
 * DEPLOYMENT INSTRUCTIONS (HOW TO USE):
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1vHFp5FfF_kHCKNtGpigcDLbS2gm3ETy1xdYuuJAru60
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any existing code in the editor (or add a new script file) and paste this entire file.
 * 4. Click the "Save" icon (Floppy disk).
 * 5. Click the blue "Deploy" button (top-right) > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: "ISI Webhook & Auto-Reply Email Engine"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (CRITICAL for receiving website submissions).
 * 8. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * =========================================================================================
 */

// ── 1. CONFIGURATION ─────────────────────────────────────────────────────────────────────
const CONFIG = {
  // Master Google Sheet ID (Analytics & Forms)
  SPREADSHEET_ID: "1vHFp5FfF_kHCKNtGpigcDLbS2gm3ETy1xdYuuJAru60",

  // Dedicated Ad Campaign Sheet ID (Optional)
  AD_CAMPAIGN_SPREADSHEET_ID: "15OaMm3wf1esko6IZfpO74lnAZior8RGMwO2FiV_iz74",

  // Google Drive folder name to store career resumes
  CAREER_RESUMES_FOLDER: "ISI_Career_Resumes",

  // Company Brand Information
  COMPANY_NAME: "ISI Security",
  LEGAL_NAME: "Industrial Security & Intelligence (India) Pvt. Ltd.",
  WEBSITE_URL: "https://www.isisecurity.in",
  REPLY_TO_EMAIL: "info@isisecurity.in",
  HELPLINE_PHONE: "+91 40 2320 0000",

  // Internal Alert Notification Recipients
  RECIPIENTS: {
    sales: [
      "v.varshith@isisecurity.in",
      "v.vishal@isisecurity.in",
      "bv@trustflow.in",
      "poojasri.aram@gmail.com"
    ],
    career: [
      "poojasri.aram@gmail.com"
    ],
    academy: [
      "v.varshith@isisecurity.in",
      "v.vishal@isisecurity.in",
      "bv@trustflow.in",
      "poojasri.aram@gmail.com"
    ]
  }
};

// ── 2. WEBHOOK ENTRY POINTS ──────────────────────────────────────────────────────────────

/**
 * Handles HTTP GET requests (Health check)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "ISI Security Automated Form & Email Reply Webhook",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles HTTP POST requests (Form Submissions from website)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST body received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Parse JSON payload
    let data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Invalid JSON payload"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheetName = data.sheetName || data.formType || "Contact_Form";

    // ── STEP 1: SEND AUTOMATED CONFIRMATION EMAIL TO SUBMITTER ──
    const userEmail = (data.email || data.Email || data.workEmail || data.WorkEmail || data["Work Email"] || data.user_email || data.emailAddress || "").toString().trim();
    const userName  = (data.name || data.Name || data["Full Name"] || data.fullName || data.contactPerson || "Valued Client").toString().trim();

    let emailSentToUser = false;
    let userEmailError = "";

    if (userEmail && userEmail.indexOf("@") !== -1) {
      try {
        emailSentToUser = sendUserConfirmationEmail(userName, userEmail, sheetName, data);
      } catch (userMailErr) {
        userEmailError = userMailErr.toString();
        console.error("User confirmation email error:", userMailErr);
      }
    } else {
      console.warn("No valid user email found in payload to send auto-reply.");
    }

    // ── STEP 2: ARCHIVE RESUME (IF CAREER APPLICATION) ──
    let resumeDriveLink = "";
    let resumeBlob = null;
    if (data.resumeBlob) {
      try {
        const driveMeta = archiveResumeFile(data, userName);
        resumeDriveLink = driveMeta.driveLink;
        resumeBlob = driveMeta.blob;
        data.resumeDriveLink = resumeDriveLink;
      } catch (driveErr) {
        console.warn("Drive archive error:", driveErr);
      }
    }

    // ── STEP 3: SEND INTERNAL ALERT TO ISI TEAM ──
    try {
      sendInternalAlertEmail(userName, userEmail, sheetName, data, resumeBlob);
    } catch (teamMailErr) {
      console.error("Team alert email error:", teamMailErr);
    }

    // ── STEP 4: LOG TO GOOGLE SHEETS ──
    let sheetSaved = false;
    try {
      sheetSaved = logToGoogleSheet(sheetName, data);
    } catch (sheetErr) {
      console.error("Sheet append error:", sheetErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      emailSentToUser: emailSentToUser,
      sheetSaved: sheetSaved,
      leadNumber: data.leadNumber || data.applicationNumber || null,
      message: "Lead processed and confirmation email dispatched"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (globalErr) {
    console.error("Fatal doPost Error:", globalErr);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: globalErr.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ── 3. AUTOMATED USER CONFIRMATION EMAIL SENDER ──────────────────────────────────────────

/**
 * Sends a personalized, beautifully branded HTML reply email to whoever filled out the form
 */
function sendUserConfirmationEmail(userName, userEmail, sheetName, data) {
  const meta = getCategoryMetadata(sheetName, data);
  const subject = meta.userSubject + (data.leadNumber ? " [Ref: " + data.leadNumber + "]" : "");
  const htmlBody = buildHtmlEmailTemplate(userName, meta.userHeadline, meta.userMessage, meta.accentColor, data);

  const mailOptions = {
    to: userEmail,
    subject: subject,
    htmlBody: htmlBody,
    name: CONFIG.COMPANY_NAME,
    replyTo: CONFIG.REPLY_TO_EMAIL
  };

  try {
    GmailApp.sendEmail(userEmail, subject, htmlToPlainText(htmlBody), mailOptions);
    console.log("✅ Auto-reply email sent via GmailApp to: " + userEmail);
    return true;
  } catch (gmailErr) {
    try {
      MailApp.sendEmail(mailOptions);
      console.log("✅ Auto-reply email sent via MailApp to: " + userEmail);
      return true;
    } catch (mailErr) {
      console.error("❌ Failed to send user confirmation email: " + mailErr.toString());
      return false;
    }
  }
}

/**
 * Sends internal team alert notification
 * NOTE: For Career Applications, this alert is sent to poojasri.aram@gmail.com ALONE (all others removed).
 */
function sendInternalAlertEmail(userName, userEmail, sheetName, data, resumeBlob) {
  const meta = getCategoryMetadata(sheetName, data);
  const targetEmails = meta.teamRecipients || CONFIG.RECIPIENTS.sales;

  if (!targetEmails || targetEmails.length === 0) return;

  const subject = "[NEW LEAD] " + meta.categoryName + " — " + userName + (data.company ? " (" + data.company + ")" : "");
  
  const htmlRows = Object.keys(data)
    .filter(k => k !== 'resumeBlob' && k !== 'fileBlob' && typeof data[k] !== 'object')
    .map(k => `<tr><td style="padding:6px 12px; font-weight:bold; color:#475569; border-bottom:1px solid #e2e8f0; width:35%;">${escapeHtml(k)}</td><td style="padding:6px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;">${escapeHtml(String(data[k]))}</td></tr>`)
    .join('');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width:650px; margin:0 auto; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
      <div style="background:#003380; color:#fff; padding:18px 24px;">
        <h2 style="margin:0; font-size:18px;">New Lead Submission: ${escapeHtml(meta.categoryName)}</h2>
        <p style="margin:4px 0 0; font-size:13px; color:#93c5fd;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          ${htmlRows}
        </table>
        ${data.resumeDriveLink ? `<p style="margin-top:18px; font-size:13px;"><strong>Google Drive Resume Copy:</strong> <a href="${data.resumeDriveLink}">View in Drive</a></p>` : ''}
      </div>
    </div>
  `;

  const mailOptions = {
    to: targetEmails.join(','),
    subject: subject,
    htmlBody: htmlBody,
    name: "ISI Lead Engine • " + meta.categoryName,
    replyTo: userEmail || CONFIG.REPLY_TO_EMAIL
  };

  if (resumeBlob) {
    mailOptions.attachments = [resumeBlob];
  }

  try {
    GmailApp.sendEmail(mailOptions.to, subject, htmlToPlainText(htmlBody), mailOptions);
  } catch (e) {
    MailApp.sendEmail(mailOptions);
  }
}

// ── 4. CATEGORY METADATA & CONTENT BUILDER ───────────────────────────────────────────────

function getCategoryMetadata(sheetName, data) {
  const norm = String(sheetName || '').toLowerCase().replace(/[\s\-_]/g, '');

  if (norm.includes('career') || norm.includes('job')) {
    return {
      categoryName: "Job Application",
      accentColor: "#10b981",
      userSubject: "Job Application Received - ISI Security Careers",
      userHeadline: "Thank you for applying to ISI Security",
      userMessage: "Our Talent Acquisition & HR Team has received your job application and resume. We will review your credentials against our open roles and connect with you if your qualifications match.",
      teamRecipients: CONFIG.RECIPIENTS.career
    };
  }

  if (norm.includes('academy') || norm.includes('course') || norm.includes('training')) {
    return {
      categoryName: "Academy Inquiry",
      accentColor: "#d97706",
      userSubject: "Academy Training Inquiry Received - ISI Academy",
      userHeadline: "Thank you for inquiring about ISI Academy",
      userMessage: "Our Academic Counselor has received your training inquiry. We will reach out within 24 hours with curriculum details, batch timings, and certification paths.",
      teamRecipients: CONFIG.RECIPIENTS.academy
    };
  }

  if (norm.includes('sales') || norm.includes('enterprise') || norm.includes('facility')) {
    return {
      categoryName: "Enterprise Sales Inquiry",
      accentColor: "#003380",
      userSubject: "Enterprise Consultation Request Received - ISI Security",
      userHeadline: "We have received your enterprise requirements",
      userMessage: "Our Solutions Engineering team is reviewing your requirements and preparing a customized operational security plan. A Senior Consultant will contact you within 24 business hours.",
      teamRecipients: CONFIG.RECIPIENTS.sales
    };
  }

  if (norm.includes('consultation') || norm.includes('school') || norm.includes('campus')) {
    return {
      categoryName: "Institutional Safety Consultation",
      accentColor: "#ea580c",
      userSubject: "Campus Safety Consultation Request Received - ISI Security",
      userHeadline: "Thank you for requesting an Institutional Safety Audit",
      userMessage: "We have received your campus safety consultation request. Our Institutional Risk Specialist will contact you to coordinate an on-site security assessment.",
      teamRecipients: CONFIG.RECIPIENTS.sales
    };
  }

  if (norm.includes('partner')) {
    return {
      categoryName: "Partner Application",
      accentColor: "#7c3aed",
      userSubject: "Partner Network Application Received - ISI Security",
      userHeadline: "Thank you for applying to the ISI Partner Network",
      userMessage: "Our Strategic Alliances team has received your application and will evaluate your agency profile for partner onboarding.",
      teamRecipients: CONFIG.RECIPIENTS.sales
    };
  }

  // Default: Direct Contact & General Inquiries
  return {
    categoryName: "Website Inquiry",
    accentColor: "#003380",
    userSubject: "Inquiry Received - ISI Security",
    userHeadline: "Thank you for contacting ISI Security",
    userMessage: "We have successfully registered your inquiry in our enterprise system. Our operations team will get in touch with you shortly.",
    teamRecipients: CONFIG.RECIPIENTS.sales
  };
}

// ── 5. PROFESSIONAL HTML CONFIRMATION EMAIL TEMPLATE ─────────────────────────────────────

function buildHtmlEmailTemplate(userName, headline, messageText, accentColor, data) {
  const refText = data.leadNumber || data.applicationNumber || "";
  const service = data.service || data.Service || data.serviceRequested || data["Program / Course"] || data.jobTitle || "";
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 25px 15px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #002255 0%, #003380 100%); padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">ISI SECURITY</h1>
      <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">Industrial Security &amp; Intelligence (India) Pvt. Ltd.</p>
    </div>

    <!-- BODY -->
    <div style="padding: 32px 28px; color: #1e293b; line-height: 1.6;">
      <h2 style="font-size: 19px; color: #003380; font-weight: 700; margin: 0 0 14px 0;">Hello ${escapeHtml(userName)},</h2>
      
      <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
        ${escapeHtml(messageText)}
      </p>

      ${refText ? `
      <div style="margin: 14px 0; padding: 10px 16px; background: #eff6ff; border-radius: 6px; display: inline-block; font-size: 13px; color: #1e40af; font-weight: 600;">
        Reference ID: ${escapeHtml(refText)}
      </div>` : ''}

      ${service ? `<p style="margin: 8px 0; font-size: 13px; color: #64748b;"><strong>Subject / Requirement:</strong> ${escapeHtml(service)}</p>` : ''}

      <!-- NEXT STEPS -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 18px 20px; margin: 22px 0; border-left: 4px solid ${accentColor};">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">What Happens Next?</h4>
        <ul style="margin: 0; padding-left: 18px; color: #475569; font-size: 13px; line-height: 1.6;">
          <li>Our domain experts are reviewing the information you submitted.</li>
          <li>A designated specialist will contact you via email or phone within 24 business hours.</li>
          <li>If you require immediate assistance, you can reach our 24/7 Operations Desk anytime.</li>
        </ul>
      </div>

      <!-- VALUE PILLARS -->
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 22px 0;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Why Organizations Rely on ISI:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #64748b; line-height: 1.7;">
          <li><strong>25+ Years of Trust:</strong> Proven operational physical &amp; cyber security across 18+ Indian states.</li>
          <li><strong>PSARA Certified:</strong> Rigorously trained personnel and verified operational compliance.</li>
          <li><strong>AI Surveillance Fusion:</strong> 24/7 C4i Central Command Center monitoring.</li>
          <li><strong>Integrated FM:</strong> End-to-end Hard &amp; Soft Facility Management.</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 26px;">
        <a href="${CONFIG.WEBSITE_URL}" style="display: inline-block; padding: 12px 28px; background: #003380; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px;">Visit ISI Security Official Website</a>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.6;">
      &copy; ${year} ${CONFIG.LEGAL_NAME}. All rights reserved.<br>
      <strong>24/7 Command Helpline:</strong> ${CONFIG.HELPLINE_PHONE} &bull; <strong>Email:</strong> ${CONFIG.REPLY_TO_EMAIL}<br>
      <span style="font-size: 11px; color: #94a3b8;">This is an automated confirmation of your website form submission.</span>
    </div>

  </div>
</body>
</html>
  `;
}

// ── 6. RESUME ARCHIVE & SHEETS LOGGING ────────────────────────────────────────────────────

function archiveResumeFile(data, userName) {
  const base64Data = data.resumeBlob;
  const fileName = (data.resumeFileName || userName + "_Resume.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
  const mimeType = data.resumeMimeType || "application/pdf";

  const bytes = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(bytes, mimeType, fileName);

  let folder;
  const folders = DriveApp.getFoldersByName(CONFIG.CAREER_RESUMES_FOLDER);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(CONFIG.CAREER_RESUMES_FOLDER);
  }

  const file = folder.createFile(blob);
  file.setDescription("Uploaded by " + userName + " (" + (data.email || "No Email") + ") on " + new Date().toISOString());

  return {
    driveLink: file.getUrl(),
    driveFileId: file.getId(),
    blob: blob
  };
}

function logToGoogleSheet(sheetName, data) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Ensure header row exists
  if (sheet.getLastRow() === 0) {
    const headers = ["Timestamp", "Lead Number", "Name", "Email", "Phone", "Company", "Service / Role", "Message", "Resume Link", "Status"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#003380").setFontColor("#ffffff");
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const row = [
    timestamp,
    data.leadNumber || data.applicationNumber || "N/A",
    data.name || data.Name || data["Full Name"] || "N/A",
    data.email || data.Email || data.workEmail || "N/A",
    data.phone || data.Phone || "N/A",
    data.company || data.Company || "N/A",
    data.service || data.serviceRequested || data["Program / Course"] || data.jobTitle || "General",
    data.message || data.Message || data.requirements || "N/A",
    data.resumeDriveLink || "N/A",
    "New Lead (Auto-Reply Sent)"
  ];

  sheet.appendRow(row);
  return true;
}

// ── 7. UTILITY HELPERS ───────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlToPlainText(html) {
  if (!html) return "";
  return html
    .replace(/<style([\s\S]*?)<\/style>/gi, "")
    .replace(/<script([\s\S]*?)<\/script>/gi, "")
    .replace(/<\/div>/ig, "\n")
    .replace(/<\/li>/ig, "\n")
    .replace(/<li>/ig, "  * ")
    .replace(/<ul([\s\S]*?)<\/ul>/gi, "$1\n")
    .replace(/<\/p>/ig, "\n\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]+>/ig, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

