// Basic contact/identity info shown in the resume header (name, title, location, contact links).
export const personal = {
  name: "Sean Argie A. Quiteles",
  title: "Programmer/Analyst",
  location: "Mandaluyong City, Metro Manila, PH",
  phone: "09218847645",
  email: "seanargieq@gmail.com",
  linkedin: "https://www.linkedin.com/in/saaquiteles",
  github: "https://github.com/saaquiteles"
};

// A short paragraph of professional summary text describing who this person is and what they do.
export const summary = `
  I am a Programmer/Analyst with hands-on experience in Java, Spring Boot, Thymeleaf, and React,
  currently advancing through Vertere Global Solutions' Hire-Train-Deploy (HTD) Program.
  I build RESTful APIs using DTO design patterns and validate code quality with JUnit and Mockito,
  while deepening my grasp of the wider software development lifecycle.
  Previously, as a Software Developer Intern at Bridge360, Inc., I delivered secure authentication
  features for a MERN-stack application, achieving 100% integration success on email verification and password reset.
  A Computer Engineering graduate of Mapúa University, I remain committed to continuously growing
  my expertise in full-stack architecture and software testing.
`;

// The list of past jobs/roles, each with a role, company, duration, and bullet-point highlights.
export const experience = [
  {
    role: "HTD Programmer/Analyst",
    company: "Vertere Global Solutions Inc.",
    location: "Makati City",
    duration: "June 2026 – Present",
    highlights: [
      "Selected for Vertere's Hire, Train, Deploy (HTD) Program, an intensive training pipeline that equips early-career professionals with in-demand technical skills for project-ready roles.",
      "Developing server-side applications using Java, Spring Boot, and Thymeleaf, building RESTful APIs with DTO design patterns, and creating front-end interfaces using React and JSX.",
      "Practicing unit testing with JUnit and Mockito while continuously growing knowledge of software engineering methodologies, including SDLC and STLC, through ongoing hands-on training."
    ]
  },
  {
    role: "Software Developer Intern",
    company: "Bridge360, Inc.",
    location: "Makati City",
    duration: "May 2025 – July 2025",
    highlights: [
      "Engineered responsive UI components and RESTful backend features for a MERN stack application, achieving 100% successful integration of email verification and password reset systems to enhance user security.",
      "Optimized software reliability by conducting rigorous unit testing and debugging, resulting in the delivery of defect-free code and a streamlined deployment lifecycle within an Agile environment.",
      "Facilitated project transparency and technical alignment by producing comprehensive documentation and presenting updates in weekly sprints, reducing troubleshooting time for production defects."
    ]
  }
];

// The list of schools attended, each with a degree, specialization, institution, and duration.
export const education = [
  {
    degree: "Bachelor of Science in Computer Engineering",
    specialization: "UNIX Administration",
    institution: "Mapúa University",
    duration: "Aug 2018 – Jan 2026"
  },
  {
    degree: "Senior High School",
    specialization: "Accounting and Business Management (ABM) Strand",
    institution: "Saint Louis School of Solano, Nueva Vizcaya",
    duration: "Jun 2012 – May 2018"
  }
];

// The list of earned certifications, each with a title, issuer, date, and a link to view the credential.
export const certifications = [
  {
    title: "Associate Data Engineer",
    issuer: "DataCamp",
    duration: "Aug 2026",
    linkLabel: "View credential",
    link: "https://www.datacamp.com/certificate/DEA0015515464920"
  }
];

// The list of notable accomplishments/experiences outside of jobs and school (e.g. site visits, events).
export const accomplishments = [
  {
    title: "International Technology Site Visits – Japan",
    venue: "Nagoya, Osaka, and Kyoto, Japan",
    duration: "Nov 6–10, 2024",
    highlights: [
      "Analyzed real-world applications of automation and sensing technologies during site visits to Toyota Technological Institute and Omron Corporation.",
      "Observed high-precision manufacturing systems and industrial innovations, gaining a practical understanding of large-scale data-driven hardware and software integration.",
      "Engaged in cross-cultural technological seminars focused on the evolution of robotics and smart manufacturing within the Japanese tech ecosystem."
    ]
  }
];

// The list of featured projects shown in the "Projects" section, each with a title, description, tech stack, and links.
export const projects = [
  {
    accession: "NO. 001",
    status: "PUBLISHED",
    headline: "A Vision System That Tells Cockatiels Apart",
    title: "Recognition of Feather and Color Mutation on Cockatiels via Raspberry Pi Using OpenCV and SqueezeNet",
    description: "Real time image classification system using Raspberry Pi, OpenCV, and SqueezeNet CNN." + "\n" + "Source code to be put on GitHub soon.",
    tech: ["Python", "OpenCV", "PyTorch", "Raspberry Pi", "CNN", "SqueezeNet"],
    highlights: [
      "Achieved 91.17% accuracy",
      "Ensembled approach with Haar Cascade and SqueezeNet for robust detection and classification.",
      "Optimized embedded system performance for real-time inference on resource-constrained hardware."
    ],
    stats: [
      { label: "Accuracy", value: "91.17%" },
      { label: "Method", value: "Haar Cascade + SqueezeNet CNN, ensembled" },
      { label: "Platform", value: "Raspberry Pi — real-time, resource-constrained" }
    ],
    linkLabel: "Read the published paper",
    link: "https://ebooks.iospress.nl/doi/10.3233/ATDE251126"
  },
  {
    accession: "NO. 002",
    status: "ON DISPLAY",
    selfReferential: true,
    displayNote: "Field note: the range you are standing in right now is this project.",
    title: "This Project (Personal CV Website)",
    description: "A 3D first-person interactive curriculum vitae — walk a tactical firing range and shoot holographic targets to unlock each real resume section.",
    tech: ["React", "Three.js", "React Three Fiber", "JavaScript", "Tailwind CSS", "Framer Motion"],
    link: "#"
  }
];

// Maps each internal skill category key (e.g. "programming") to the display label shown in the UI.
export const skillCategoryLabels = {
  programming: "Order I — Programming Languages",
  web: "Order II — Web & Frameworks",
  tools: "Order III — Tools & Environment",
  databases: "Order IV — Data Storage",
  process: "Order V — Testing & Process",
  data: "Order VI — Data Handling",
  soft: "Order VII — Field Conduct"
};

// The actual skills grouped by category (matching the keys used in skillCategoryLabels) for the skills list.
export const skills = {
  programming: ["Java", "Python", "JavaScript", "TypeScript"],
  web: ["React", "Spring Boot", "Thymeleaf", "Node.js", "Express", "REST APIs", "DTO Patterns", "HTML", "CSS"],
  tools: ["Git", "GitHub", "Linux", "OpenCV", "VS Code", "Postman", "Microsoft Office"],
  databases: ["MongoDB"],
  process: ["JUnit", "Mockito", "Unit Testing", "SDLC", "STLC"],
  data: ["Data Handling", "API Integration", "Data Validation", "Structured Data Processing"],
  soft: [
    "Team collaboration",
    "Problem solving",
    "Adaptability",
    "Attention to detail",
    "Effective communication",
    "Time management"
  ]
};
