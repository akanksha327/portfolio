import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    const isConfigured = emailUser && emailPass && !emailPass.includes('your_gmail_app_password_here');

    if (!isConfigured) {
      console.log('==================================================');
      console.log('📥 [MOCK MODE] NEW CONTACT FORM MESSAGE RECEIVED:');
      console.log(`👤 Name:    ${name}`);
      console.log(`✉️ Email:   ${email}`);
      console.log(`💬 Message: ${message}`);
      console.log('💡 Note: To receive actual emails, please configure EMAIL_USER and EMAIL_PASS (Gmail App Password) in your .env file.');
      console.log('==================================================');

      return NextResponse.json({ 
        success: true, 
        message: 'Message received (Mock Mode). Configure .env for actual email delivery.' 
      });
    }

    // Configure transporter for Gmail (or generic SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: 'akankshasahu327@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f97316; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('Nodemailer error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email.' },
      { status: 500 }
    );
  }
}
