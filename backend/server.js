const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Your actual project data
const projects = [
  {
    id: 1,
    title: "Ashvaan",
    description:
      "An AI-powered mental health platform tailored for students, developed for the Smart India Hackathon.",
    techStack: ["React.js", "Node.js", "AI Integration"],
    link: "https://github.com/Madhav7871",
  },
  {
    id: 2,
    title: "GitTogether",
    description:
      "An AI-driven team formation platform designed to connect developers for hackathons.",
    techStack: ["React", "Full-Stack", "AI"],
    link: "https://github.com/Madhav7871",
  },
  {
    id: 3,
    title: "ShareFile",
    description:
      "A secure real-time sharing platform for nearby device discovery, instant file transfer, and live code collaboration without logins.",
    techStack: ["React", "Node.js", "Socket.io", "Express"],
    link: "https://github.com/Madhav7871/FileShare",
  },
  {
    id: 4,
    title: "Virtual Mouse Controller",
    description:
      "A computer vision application enabling complete cursor control via finger tracking.",
    techStack: ["Python", "OpenCV", "MediaPipe"],
    link: "https://github.com/Madhav7871",
  },
];

// API Route to get your projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const receiverEmail = process.env.CONTACT_RECEIVER || "madhavkalra@gmail.com";

  if (!smtpUser || !smtpPass) {
    return res.status(500).json({
      success: false,
      message:
        "Email service is not configured. Set SMTP_USER and SMTP_PASS in backend/.env.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `New  message from ${name}`,
      text: `You received a new contact request.

Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
`,
    });

    await transporter.sendMail({
      from: `"Madhav Kalra" <${smtpUser}>`,
      to: email,
      subject: "Thanks for connecting - I will contact you soon",
      text: `Hi ${name},

Thanks for reaching out. I received your message and will connect with you soon.

Your message:
${message}

Best regards,
Madhav Kalra`,
    });

    return res.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
