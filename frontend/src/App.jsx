import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const Portfolio = () => {
  const [backendProjects, setBackendProjects] = useState([]);
  const [backendLoading, setBackendLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroScrollRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const socialLinks = {
    github: "https://github.com/Madhav7871",
    linkedin: "https://www.linkedin.com/in/madhav-kalra-807252242/",
  };

  const skills = [
    "C++",
    "Java",
    "Python",
    "React.js",
    "Node.js",
    "Express.js",
    "Socket.io",
    "Tailwind CSS",
    "Vite",
    "OpenCV",
    "JavaScript",
    "REST APIs",
    "MongoDB",
    "Git & GitHub",
    "Data Structures & Algorithms",
  ];

  const fileShareFallback = {
    title: "ShareFile",
    description:
      "A secure real-time sharing platform for nearby device discovery, instant file transfer, and live code collaboration without logins.",
    techStack: ["React", "Node.js", "Socket.io", "Express"],
    link: "https://github.com/Madhav7871/FileShare",
  };

  // Fetch projects from your backend API
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then(async (data) => {
        let fileShareRepo = null;

        try {
          const githubResponse = await fetch(
            "https://api.github.com/repos/Madhav7871/FileShare",
          );
          if (githubResponse.ok) {
            fileShareRepo = await githubResponse.json();
          }
        } catch (error) {
          console.error("Error fetching FileShare repo:", error);
        }

        const normalizedProjects = data.map((project) => {
          const isOldDropSync =
            typeof project.title === "string" &&
            project.title.trim().toLowerCase() === "dropsync";

          const isShareFile =
            typeof project.title === "string" &&
            project.title.trim().toLowerCase() === "sharefile";

          if (!isOldDropSync && !isShareFile) {
            return project;
          }

          return {
            ...project,
            title: "ShareFile",
            description:
              fileShareRepo?.description || fileShareFallback.description,
            techStack: fileShareFallback.techStack,
            link: fileShareRepo?.html_url || fileShareFallback.link,
          };
        });

        setBackendProjects(normalizedProjects);
        setBackendLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching backend projects:", error);
        setBackendLoading(false);
      });
  }, []);

  useEffect(() => {
    const heroElement = heroScrollRef.current;
    const canvas = canvasRef.current;
    if (!heroElement || !canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = "/Picsart_26-04-13_21-29-10-465.jpg.jpeg";
    imageRef.current = image;

    const drawFrame = (progressValue) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      canvas.width = viewportWidth;
      canvas.height = viewportHeight;

      const loadedImage = imageRef.current;
      if (!loadedImage || !loadedImage.complete) {
        return;
      }

      const scale = 1 + progressValue * 0.35;
      const coverScale = Math.max(
        viewportWidth / loadedImage.width,
        viewportHeight / loadedImage.height,
      );
      const drawWidth = loadedImage.width * coverScale * scale;
      const drawHeight = loadedImage.height * coverScale * scale;
      const offsetX = (viewportWidth - drawWidth) / 2;
      const offsetY = (viewportHeight - drawHeight) / 2;

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      ctx.drawImage(loadedImage, offsetX, offsetY, drawWidth, drawHeight);

      const overlay = ctx.createLinearGradient(0, 0, 0, viewportHeight);
      overlay.addColorStop(0, "rgba(3, 6, 16, 0.20)");
      overlay.addColorStop(0.6, "rgba(3, 6, 16, 0.45)");
      overlay.addColorStop(1, "rgba(3, 6, 16, 0.75)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    };

    const updateScroll = () => {
      const top = heroElement.offsetTop;
      const distance = heroElement.offsetHeight - window.innerHeight;
      const current = window.scrollY - top;
      const progressValue = Math.max(0, Math.min(1, current / distance));
      setScrollProgress(progressValue);
      drawFrame(progressValue);
    };

    const handleResize = () => {
      updateScroll();
    };

    image.onload = () => {
      drawFrame(0);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const nameOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.05) / 0.2));
  const roleOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.2));

  const handleContactInputChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitContactForm = async (event) => {
    event.preventDefault();
    setContactStatus("");
    setContactSending(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send message.");
      }

      setContactStatus("Message sent successfully. Please check your email.");
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setContactStatus(error.message || "Something went wrong.");
    } finally {
      setContactSending(false);
    }
  };

  return (
    <main className="portfolio-page">
      <section className="hero-scroll" ref={heroScrollRef}>
        <div className="hero-sticky">
          <canvas ref={canvasRef} className="hero-canvas" />

          <div className="hero-overlay hero-overlay-center">
            <p className="hero-tagline">Software Developer and Tech Learner</p>
            <h1
              className="hero-name"
              style={{
                opacity: nameOpacity,
                transform: `translateY(${(1 - nameOpacity) * 20}px)`,
              }}
            >
              Madhav Kalra.
            </h1>
            <h2
              className="hero-role"
              style={{
                opacity: roleOpacity,
                transform: `translateY(${(1 - roleOpacity) * 20}px)`,
              }}
            >
              CSE Student | Developer | Problem Solver
            </h2>
            <div className="hero-actions">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hero-btn hero-btn-primary"
              >
                Explore GitHub
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hero-btn hero-btn-secondary"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>

          <div className="scroll-hint">Scroll Down</div>
        </div>
      </section>

      <div className="portfolio-container">
        <section className="about-section">
          <h2>About Me</h2>
          <p>
            Hello, I am Madhav Kalra. I am currently pursuing B.Tech in Computer
            Science Engineering from Bhagwan Parshuram Institute of Technology.
            Before this, I completed a Diploma in Electronics and Communication
            Engineering from Guru Tegh Bahadur Polytechnic Institute.
          </p>
          <p>
            My ECE background built my foundation in technology, and now I am
            diving deep into software development, programming, and modern web
            technologies. I enjoy building projects, learning continuously, and
            collaborating with people who love creating impactful ideas.
          </p>
        </section>

        <section className="education-section">
          <h2>Education</h2>
          <div className="timeline">
            <article className="timeline-card">
              <h3>B.Tech in Computer Science Engineering</h3>
              <p>Bhagwan Parshuram Institute of Technology</p>
              <span>Current</span>
            </article>
            <article className="timeline-card">
              <h3>Diploma in Electronics and Communication Engineering</h3>
              <p>Guru Tegh Bahadur Polytechnic Institute</p>
              <span>Completed</span>
            </article>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills-section">
          <h2>Technical Arsenal</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="projects-section">
          <h2>Featured Projects</h2>

          {backendLoading ? (
            <p className="loading-text">Loading projects from server...</p>
          ) : (
            <div className="project-grid">
              {backendProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {project.techStack.map((tech, index) => (
                      <span key={index} className="tech-item">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link ? (
                    <a
                      className="project-link"
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Project
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="connect-section">
          <h2>Let us Connect</h2>
          <p>
            If you are interested in technology, collaboration, or discussing
            innovative ideas, feel free to connect with me.
          </p>
          <button
            type="button"
            className="connect-cta-btn"
            onClick={() => {
              setContactStatus("");
              setContactModalOpen(true);
            }}
          >
            Connect With Me
          </button>
          <div className="connect-links">
            <a href={socialLinks.github} target="_blank" rel="noreferrer">
              GitHub Profile
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn Profile
            </a>
          </div>
        </section>
      </div>

      {contactModalOpen ? (
        <div
          className="contact-modal-backdrop"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="contact-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Send a Message</h3>
            <p>Fill your details and I will connect with you soon.</p>
            <form className="contact-form" onSubmit={submitContactForm}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={handleContactInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email ID"
                value={contactForm.email}
                onChange={handleContactInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Contact Number"
                value={contactForm.phone}
                onChange={handleContactInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={contactForm.message}
                onChange={handleContactInputChange}
                required
              />

              {contactStatus ? (
                <p className="contact-status">{contactStatus}</p>
              ) : null}

              <div className="contact-actions">
                <button
                  type="button"
                  className="contact-btn contact-btn-secondary"
                  onClick={() => setContactModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="contact-btn contact-btn-primary"
                  disabled={contactSending}
                >
                  {contactSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Portfolio;
