const express = require("express");
const cors = require("cors");

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

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
