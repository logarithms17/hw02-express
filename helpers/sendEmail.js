import nodemailer from "nodemailer"
import "dotenv/config";

const { GMAIL_EMAIL, GMAIL_PASSWORD} = process.env

const nodeMailerConfig = {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASSWORD
    },
    tls: {
    // This setting prevents the self-signed certificate error by not rejecting unauthorized certificates
    rejectUnauthorized: false,
  },
}

//transporter object
const transport = nodemailer.createTransport(nodeMailerConfig)

console.log(GMAIL_EMAIL)
console.log(GMAIL_PASSWORD)

//transportr function
const sendEmail = async (data) => {
  try {
    const email = { ...data, from: GMAIL_EMAIL }; // Define the email sender
    await transport.sendMail(email);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// const sendEmail = async (data) => {
//     // we will pass the data including the subject, recepient and content inside a unified object which corresponds to the email
//     const email = { ...data, from: GMAIL_EMAIL } //the email that will send the verification email to the users

//     await transport.sendMail(email)
// }

export default sendEmail