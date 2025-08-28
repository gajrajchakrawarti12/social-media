import nodemailer from "nodemailer";
import dotenv from "dotenv";
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.zoho.in",
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_SECURE === "true" || true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "admin@cyberrakshak.me",
    pass: process.env.EMAIL_PASS || "fuFSWgaFefc5",
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  logger: true, // Enable logging for debugging
  debug: true, // Show debug output
});
export const sendVerificationEmail = async (email, token, name) => {
  const verificationLink = `${process.env.CLIENT_URL || "https://cyberrakshak.me"}/api/verification/email?token=${token}`;
  const siteName = "Cyber Rakshak";
  const userName = name ? name : "User"; // Extract username from email

  const mailOptions = {
    from:
      process.env.EMAIL_FROM || '"Cyber Rakshak Admin" <admin@cyberrakshak.me>',
    to: email,
    subject: "Email Verification",
    html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }

        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }

        h1 {
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 24px;
        }

        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
            transition: background-color 0.2s;
        }

        .button:hover {
            background-color: #1d4ed8;
        }

        .link-fallback {
            margin-top: 20px;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 6px;
            font-size: 14px;
            color: #6b7280;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }

        .security-note {
            margin-top: 20px;
            padding: 15px;
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            border-radius: 4px;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo">${siteName}</div>
        </div>

        <h1>Verify Your Email Address</h1>

        <p>Hello ${userName},</p>

        <p>Thank you for signing up! To complete your registration and secure your account, please verify your email
            address by clicking the button below:</p>

        <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>

        <div class="link-fallback">
            <strong>Button not working?</strong> Copy and paste this link into your browser:
            <br>
            <a href="${verificationLink}" style="color: #2563eb; word-break: break-all;">${verificationLink}</a>
        </div>

        <div class="security-note">
            <strong>Security Note:</strong> This verification link will expire in 24 hours for your security. If you
            didn't request this verification, please ignore this email.
        </div>

        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};