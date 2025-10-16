const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 465,              
  secure: true,        
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASSWORD 
  }
});

const sendEmail = async ({ to, subject, template, context }) => {
  try {

    const templateDesigns = {
      'campaign-activated': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 20px;">${context.header}</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">${context.body}</p>
          ${context.cta ? `
            <div style="margin: 25px 0;">
              <a href="${context.cta.url}" 
                 style="display: inline-block; padding: 12px 24px; 
                        background-color: #4299e1; color: white; 
                        text-decoration: none; border-radius: 4px; 
                        font-weight: bold;">
                ${context.cta.text}
              </a>
            </div>
          ` : ''}
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">${context.footer}</p>
          <p style="font-size: 12px; color: #a0aec0; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            © ${context.currentYear} ${context.companyName}. All rights reserved.
          </p>
        </div>
      `,
      'campaign-rejected': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #e53e3e; font-size: 24px; margin-bottom: 20px;">${context.header}</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568; white-space: pre-line;">${context.body}</p>
          ${context.cta ? `
            <div style="margin: 25px 0;">
              <a href="${context.cta.url}" 
                 style="display: inline-block; padding: 12px 24px; 
                        background-color: #4299e1; color: white; 
                        text-decoration: none; border-radius: 4px; 
                        font-weight: bold;">
                ${context.cta.text}
              </a>
            </div>
          ` : ''}
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">${context.footer}</p>
          <p style="font-size: 14px; margin-top: 20px;">
            Need help? Contact <a href="mailto:${context.supportEmail}" style="color: #3182ce;">${context.supportEmail}</a>
          </p>
          <p style="font-size: 12px; color: #a0aec0; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            © ${context.currentYear} ${context.companyName}. All rights reserved.
          </p>
        </div>
      `,
      'campaign-paused': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #d69e2e; font-size: 24px; margin-bottom: 20px;">${context.header}</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">${context.body}</p>
          ${context.cta ? `
            <div style="margin: 25px 0;">
              <a href="${context.cta.url}" 
                 style="display: inline-block; padding: 12px 24px; 
                        background-color: #4299e1; color: white; 
                        text-decoration: none; border-radius: 4px; 
                        font-weight: bold;">
                ${context.cta.text}
              </a>
            </div>
          ` : ''}
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">${context.footer}</p>
          <p style="font-size: 12px; color: #a0aec0; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            © ${context.currentYear} ${context.companyName}. All rights reserved.
          </p>
        </div>
      `,
      'campaign-completed': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #38a169; font-size: 24px; margin-bottom: 20px;">${context.header}</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">${context.body}</p>
          ${context.cta ? `
            <div style="margin: 25px 0;">
              <a href="${context.cta.url}" 
                 style="display: inline-block; padding: 12px 24px; 
                        background-color: #4299e1; color: white; 
                        text-decoration: none; border-radius: 4px; 
                        font-weight: bold;">
                ${context.cta.text}
              </a>
            </div>
          ` : ''}
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">${context.footer}</p>
          <p style="font-size: 12px; color: #a0aec0; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            © ${context.currentYear} ${context.companyName}. All rights reserved.
          </p>
        </div>
      `
    };

    const html = templateDesigns[template]
      .replace(/\${companyName}/g, context.companyName || 'Aditt')
      .replace(/\${currentYear}/g, context.currentYear || new Date().getFullYear());

    const mailOptions = {
      from: `"${context.companyName || 'Aditt'}"`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendUserEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendApprovedIdentityEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'You\'re Verified — Welcome to Aditt!',
    html: `
            <p>Hi</p>
            <p>Great news — your identity has been verified successfully!</p>
            <p>You can now access all features of the Aditt app and start earning.</p>
            <p>Thanks for being part of the community.</p>
            <p>— The Aditt Team</p>
        `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approved identity email sent successfully');
  } catch (error) {
    console.error('Error sending approved identity email:', error);
  }
};

const sendRejectedIdentityEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Identity Verification Issue on Aditt',
    html: `
            <p>Hi</p>
            <p>After reviewing your submitted documents, we're unable to verify your identity at this time.</p>
            <p>Your account has been restricted for security reasons.</p>
            <p>If you believe this is a mistake, please reply to this email for further assistance.</p>
            <p>— The Aditt Team</p>
        `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Rejected identity email sent successfully');
  } catch (error) {
    console.error('Error sending rejected identity email:', error);
  }
};

const activeToPipelineEmail = async (to) => {
  try {
    const subject = "You're In — Welcome to Aditt 🚀";

    const html = `
      <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #1d72b8;">You're In — Welcome to <strong>Aditt</strong> 🚀</h2>
        <p>The wait is over — your Aditt account is now live!</p>
        <p>Start earning real money for watching ads and helping brands grow.</p>
        <p>Log in, complete your sign up, and explore your dashboard.</p>
        <p>Welcome aboard!<br>— <strong>The Aditt Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Aditt Team"`,
      to,
      subject,
      html,
    });

    console.log(`📧 Active-to-pipeline email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send activeToPipelineEmail:", error.message);
  }
};

module.exports = { activeToPipelineEmail,sendEmail, sendUserEmail, sendApprovedIdentityEmail, sendRejectedIdentityEmail };