import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class EmailService {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
    }

    async sendPurchaseConfirmation(userEmail, ticket, totalAmount) {
        try {
            await this.transport.sendMail({
                from: process.env.USER_GMAIL,
                to: userEmail,
                subject: 'Purchase Confirmation',
                html: `
                    <div>
                        <h1>Thank you for your purchase!</h1>
                        <p>Your purchase code is: ${ticket.code}</p>
                        <p>Total amount: $${totalAmount}</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: 'thanks-purchase.png',
                        path: 'images/thanks-purchase.png'
                    }
                ]
            });
        } catch (error) {
            throw new Error('Error sending email: ' + error.message);
        }
    }
}

export default new EmailService();
