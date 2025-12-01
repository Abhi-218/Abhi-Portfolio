import { Resend } from "resend";

const resend = new Resend("re_bVCYRtCd_HmTxL9zfewa8wcy9kvXPq9ap");
export default async function emailsender(
  to: string,
  code: string,
  path: string
) {
  const email = await resend.emails.send({
    from: `Abhishek's Portfolio <${process.env.EMAIL_SERVER_USER}>`,
    to: [to],
    subject: "Verification code",
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background:; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <tr style="background-color: #FFFFFF; color: #ffffff; text-align: center; width:full">
            <td style="padding: 20px;">
                <h1 style="margin: 0; font-size: 24px; background: linear-gradient(to right, #7c3aed, #3b82f6);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  color: transparent;">Welcome to AuthFlow </h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: left; color: #333333;">
                <p>Dear <strong>${to.split("@")}</strong>,</p>
                <p>${
                  path === "signup"
                    ? "Thank you for registering up on <strong>Abhishek portfolio</strong>! To complete your registration and verify your account,"
                    : "You want to reset your password of <strong>Abhishek protfolio</strong> ,"
                } please use the verification code below:</p>
                <p style="text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50;">${code}</p>
                <p style="color: #555555;"> Please enter it on the verification page to proceed.</p>
                <p>If you did not request this code, please ignore this email or contact our support team immediately at <a href="mailto:abhishekportfolio200@gmail.com" style="color: #4CAF50;">AuthFlow</a>.</p>
                <p>Thank you for choosing <strong style="background: linear-gradient(to right, #7c3aed, #3b82f6);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  color: transparent;">Abhishek Portfolio</strong>.</p>
            </td>
        </tr>
        <tr style="background-color: #f4f4f9; text-align: center; color: #777777; font-size: 12px;">
            <td style="padding: 10px;">
                <p>&copy; ${new Date().getFullYear()}  Abhishek Portfolio. All rights reserved.</p>
            </td>
        </tr>
    </table> </body>`,
  });

  if (email.error) {
    console.log("Error sending email:", email.error);
  } else if (email.data) {
    console.log("Error sending email:", email.data);
  }
}
