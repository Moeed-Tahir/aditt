const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user:  process.env.EMAIL_USER,
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

module.exports = {sendEmail,sendUserEmail};