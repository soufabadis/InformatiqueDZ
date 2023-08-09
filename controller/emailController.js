const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Email, // Use process.env instead of proccess.env
    pass: process.env.PASSWORD_KEY,
  },
});

async function mailler(Data) { 
  try {
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: Data.to,
      subject: Data.subject,
      text: Data.text,
      html: Data.html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}

module.exports = mailler;
