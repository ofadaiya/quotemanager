  require('dotenv').config();
const transporter = require('../utils/mailer');

class MailService {

  static async sendMail({ to, subject, html }) {
    return await transporter.sendMail({
      from: `"Bi-Courtney Cargo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  }

  static orderPaidTemplate(order) {
    return `
    <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 0; margin: 0;">
      <div style="max-width: 650px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e2e2;">

        <div style="padding: 20px 30px; border-bottom: 1px solid #e2e2e2; display: flex; justify-content: space-between; align-items: center;">
          <img src="https://bicourtneycargo.ng/assets/logo-BQ6FTqb8.svg" style="height: 40px;">
          <span style="font-size: 20px; font-weight: bold; color: #444;">Order Confirmation</span>
        </div>

        <div style="padding: 25px 30px;">
          <p style="font-size: 18px; margin: 0;">Hello, <strong>${order.sender_name}</strong></p>
          <p style="font-size: 14px; margin-top: 10px; line-height: 1.6;">
            Your payment was successful and your cargo order has been confirmed.
          </p>
        </div>

        <div style="padding: 0 30px;">
          <h3 style="color: #ff9900; font-size: 20px; margin-bottom: 5px;">Order Details</h3>

          <div style="border: 1px solid #e2e2e2; padding: 20px; border-radius: 5px;">
            <table width="100%">
              <tr>
                <td style="vertical-align: top; width: 50%;">
                  <p style="margin: 0; font-size: 14px; color: #444;">Order Code:</p>
                  <p style="font-size: 16px; font-weight: bold;">${order.orderCode}</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">From:</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.from}</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">To:</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.to}</p>
                </td>

                <td style="vertical-align: top; width: 50%;">
                  <p style="margin: 0; font-size: 14px; color: #444;">Amount:</p>
                  <p style="font-size: 18px; font-weight: bold; color: #111;">₦${order.amount.toLocaleString()}</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">Weight:</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.weight}kg</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">Dimensions:</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.length} x ${order.width} x ${order.height}</p>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="padding: 0 30px;">
          <h3 style="color: #ff9900; font-size: 20px; margin-bottom: 5px;">Contact Details</h3>

          <div style="border: 1px solid #e2e2e2; padding: 20px; border-radius: 5px;">
            <table width="100%">
              <tr>
                <td style="vertical-align: top; width: 50%;">
                  <p style="margin: 0; font-size: 14px; color: #444;">Receiver Name:</p>
                  <p style="font-size: 16px; font-weight: bold;">${order.receiver_name}</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">Receiver Email</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.receiver_email}</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">Phone:</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.receiver_phone}, ${order.receiver_alt_phone} </p>
                </td>

                <td style="vertical-align: top; width: 50%;">
                  <p style="margin: 0; font-size: 14px; color: #444;">Alt. Phone</p>
                  <p style="font-size: 15px; font-weight: bold; color: #111;">${order.receiver_alt_phone} </p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">Zip:</p>
                  <p style="font-size: 15px; font-weight: bold;">${order.zip_code}kg</p>

                  <p style="margin-top: 10px; font-size: 14px; color: #444;">Address:</p>
                  <p style="font-size: 15px; font-weight: bold;"> - </p>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="padding: 20px 30px;">
          <h3 style="font-size: 18px; margin-bottom: 10px;">Item Summary</h3>
          <ul style="font-size: 14px; line-height: 1.7; padding-left: 18px;">
            <li><strong>Item:</strong> ${order.description}</li>
            <li><strong>Quantity:</strong> ${order.quantity}</li>
          </ul>

          <h3 style="font-size: 18px; margin-bottom: 10px;">Tracking Details</h3>
         <ul style="font-size: 14px; line-height: 1.7; padding-left: 18px;">
            <li><strong>Reference ID</strong> ${order.reference}</li>
          </ul>

          <p style="margin-top: 15px; font-size: 14px; font-weight: bold;">
            🎉 You have received a commission for this order.
          </p>
        </div>

        <div style="padding: 20px 30px; border-top: 1px solid #e2e2e2; text-align: center;">
          <p style="font-size: 12px; color: #777;">
            Thank you for choosing Bi-Courtney Cargo.
          </p>
        </div>

      </div>
    </div>
    `;
  }


  // Public wrapper
  static async orderPaidEmail(order) {
    const html = this.orderPaidTemplate(order);

    return await this.sendMail({
      to: order.sender_email,
      subject: `Order Paid - ${order.orderCode}`,
      html
    });
  }
}

module.exports = MailService;
