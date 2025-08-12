import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  data?: Record<string, any>;
  html?: string;
  text?: string;
}

class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    try {
      this.transporter = nodemailer.createTransport(emailConfig);
      logger.info('Email transporter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@devboard.com',
        to: options.to,
        subject: options.subject,
        html: options.html || '<p>No content</p>',
        text: options.text || 'No content',
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async testEmail(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service test successful');
      return true;
    } catch (error) {
      logger.error('Email service test failed:', error);
      return false;
    }
  }
}

const emailService = new EmailService();
export default emailService;
export { EmailService, EmailOptions };
