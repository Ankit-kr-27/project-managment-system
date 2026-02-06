import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./api-error.js";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagelink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  // console.log("MAILTRAP_HOST:", process.env.MAILTRAP_SMTP_HOST);
  // console.log("MAILTRAP_PORT:", process.env.MAILTRAP_SMTP_PORT);
  // console.log("MAILTRAP_USER:", process.env.MAILTRAP_SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email service failed: ", error);
    throw new ApiError(500, "Email service failed. Please check your SMTP configuration.");
  }
};

const emailVerificationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we'are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const taskAssignmentMailgenContent = (username, taskTitle, projectName, creatorName) => {
  return {
    body: {
      name: username,
      intro: `You have been assigned to a new task "${taskTitle}" in project "${projectName}" by ${creatorName}.`,
      action: {
        instructions: "To view the task details, click the button below:",
        button: {
          color: "#22BC66",
          text: "View Task",
          link: `${process.env.CLIENT_URL}/project/${projectName}`, // Simplified link for now
        },
      },
      outro: "Good luck with the task!",
    },
  };
};

const projectInvitationMailgenContent = (username, projectName, inviterName) => {
  return {
    body: {
      name: username,
      intro: `You have been invited to join the project "${projectName}" by ${inviterName}.`,
      action: {
        instructions: "To view the project, click the button below:",
        button: {
          color: "#22BC66",
          text: "Go to Project",
          link: `${process.env.CLIENT_URL}/dashboard`,
        },
      },
      outro: "We are excited to have you on the team!",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  taskAssignmentMailgenContent,
  projectInvitationMailgenContent,
  sendEmail,
};
