// services/emailService.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: null
    }
});

// Verify transporter on startup
transporter.verify((error) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('Email service ready to send messages');
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const { token } = await oAuth2Client.getAccessToken();

        const mailOptions = {
            from: `"Zimimart.online" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text: text || '',
            html: html || ''
        };

        transporter.set('oauth2_provision_cb', (user, renew, callback) => {
            return callback(null, token);
        });

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendOrderConfirmation: async (order, buyerEmail) => {
        const html = `
      <h1>Thank you for your order!</h1>
      <p>Here are your order details:</p>
      <ul>
        <li><strong>Product:</strong> ${order.productName}</li>
        <li><strong>Quantity:</strong> ${order.quantity}</li>
        <li><strong>Shipping Address:</strong> ${order.address}</li>
      </ul>
      <p>We'll process your order shortly. Thank you for shopping with us!</p>
    `;

        return sendEmail({
            to: buyerEmail,
            subject: 'Your Order Confirmation',
            html
        });
    },
    sendNewOrderNotification: async (order, sellerEmail) => {
        const html = `
      <h1>New Order Received</h1>
      <p>Order details:</p>
      <ul>
        <li><strong>Product:</strong> ${order.productName}</li>
        <li><strong>Quantity:</strong> ${order.quantity}</li>
        <li><strong>Customer Email:</strong> ${order.email}</li>
        <li><strong>Shipping Address:</strong> ${order.address}</li>
        <li><strong>Contact Number:</strong> ${order.number}</li>
      </ul>
      <p>Please process this order as soon as possible.</p>
    `;

        return sendEmail({
            to: sellerEmail,
            subject: 'New Order Notification',
            html
        });
    }
};