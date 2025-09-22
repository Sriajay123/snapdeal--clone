import nodemailer from "nodemailer";
import twilio from "twilio";

//  function createTwilioClient() {
//   return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
// }

 function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

 async function sendOtp(user, otpCode) {
  const transporter = createTransporter();
  // const twilioClient = createTwilioClient();

  try {
    if (user.email) {
      await transporter.sendMail({
        from: `"SNAPDEAL" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "SNAPDEAL",
        text: `${otpCode} is your verification code to login to your Snapdeal Account. It is valid for 5 minutes. DO NOT share this code with anyone. - Team Snapdeal`,
      });
      console.log(`OTP sent to email: ${user.email}`);
    }

    // if (user.phone) {
    //   await twilioClient.messages.create({
    //     body: `Your OTP is ${otpCode}. It will expire in 5 minutes.`,
    //     from: process.env.TWILIO_PHONE,
    //     to: user.phone,
    //   });
    //   console.log(`OTP sent to phone: ${user.phone}`);
    // }
  } catch (err) {
    console.error("Failed to send OTP:", err);
    throw new Error("OTP sending failed");
  }
}
export default sendOtp;
