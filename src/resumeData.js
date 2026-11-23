// Resume data for portfolio site — keep in sync with public/resume-ats.html

export const profile = {
  name: "Goutham Doddi",
  phone: "+91 79810 75481",
  email: "gouthamdoddi97@gmail.com",
  location: "Hyderabad, India",
  image: "/MyPhoto.jpeg",
  linkedin: "https://www.linkedin.com/in/goutham-doddi-22441b138/",
  github: "https://github.com/GouthamDoddi",
};

export const profileSummary = `Backend-focused Software Engineer with over 5 years of experience building real-time, high-throughput systems across online gaming and e-commerce. Specializes in event-driven architecture using MQTT and WebSocket, payment gateway integration, and fair play systems that validate game outcomes on live betting platforms. Deep grounding in object-oriented programming, low-level design, and SOLID principles, backed by a Test Engineer background that established Test-Driven Development and quality-first practices. Delivers maintainable, scalable, and extensible services in Python, Node.js, and TypeScript on PostgreSQL, MongoDB, and Redis.`;

export const experience = [
  {
    title: "Founder and Full Stack Developer",
    company: "Whiff-theory",
    location: "Dubai, United Arab Emirates",
    period: "Jan 2025 - Sep 2025",
    bullets: [
      "Founded and operate Whiff-theory, an independent perfume brand producing inspired fragrances crafted for the Indian market.",
      "Engineered a full e-commerce platform using MedusaJS, featuring a functional customer storefront and a dedicated admin panel for order, product, and inventory management.",
      "Built the frontend with Next.js, implementing response caching and cache revalidation patterns to ensure fast page loads and a seamless shopping experience.",
      "Integrated Razorpay for payment processing and Shiprocket for shipping, order tracking, and fulfilment automation across the storefront.",
      "Manage the business end to end across product development, marketing, fulfilment, and platform operations, including design of the product line, packaging, and social media content."
    ]
  },
  {
    title: "Backend Developer",
    company: "Aura eGaming",
    location: "Dubai, United Arab Emirates",
    period: "Oct 2024 - Dec 2025",
    bullets: [
      "Developed backend components for a high-performance online gaming platform, including payment gateway integrations, a player engagement offers module, and fair play systems that validate game outcomes.",
      "Built a B2C casino platform from scratch, comprising an admin console for game and bet management and a player interface for placing bets and viewing live sports with scorecards, TV streaming, and a hedge system.",
      "Built an ERP system using Flask and Python, including salary automation records that used the Strategy design pattern to map each employee's bank to the bank's required salary-record format.",
      "Implemented MQTT over WebSocket to broadcast live stake updates to every connected client from a single API, keeping real-time state synchronized across concurrent players.",
      "Designed and optimized complex database solutions in PostgreSQL (Supabase) and MongoDB, leveraging Redis and MQTT for high-throughput, real-time game functionality.",
      "Architected and implemented new game instances using design patterns (Strategy, Factory, Singleton, Decorator, Manager) and SOLID principles, reducing code complexity and improving extensibility.",
      "Launched and maintained games featured on prominent sites including Unicorn360 and 10cric, increasing platform visibility and user engagement through the offers module.",
      "Debugged live game issues, managed API updates, and ensured continuous platform stability and performance."
    ]
  },
  {
    title: "Full Stack Software Engineer",
    company: "Dhenusya Infotech",
    location: "Visakhapatnam, India",
    period: "Jan 2023 - Oct 2024",
    bullets: [
      "Engineered and deployed dynamic dashboards and marketing tools for email, WhatsApp, and SMS campaigns using React, React Native, and TypeScript.",
      "Engineered high-performance backend services and optimized ERP solutions through system design improvements, substantially improving reporting efficiency.",
      "Reduced operational costs by implementing automated server and database backup shell scripts while managing multi-client infrastructure and deployments.",
      "Conducted comprehensive testing and quality assurance to ensure the reliability and performance of deployed solutions."
    ]
  },
  {
    title: "Product Developer",
    company: "Apollo Tele Health",
    location: "Hyderabad, India",
    period: "Jan 2022 - Sep 2022",
    bullets: [
      "Contributed as part of a small, agile development team to the delivery of a Django-based ERP software project.",
      "Developed an analytics dashboard for manpower requisition and COVID-19 vaccination tracking within the ERP, using Python and Django.",
      "Applied prior testing experience to identify and resolve issues including missing database migrations and sub-optimal code quality.",
      "Developed comprehensive engineering guidelines and an entity-relationship diagram to improve software quality.",
      "Built user-facing onboarding screens for new registrants to the platform and integrated the dashboard with existing systems.",
      "Advocated to management for software quality improvements and drove their implementation through rigorous testing and quality assurance practices."
    ]
  },
  {
    title: "Associate Developer",
    company: "Zitisi Solutions",
    location: "Hyderabad, India",
    period: "Nov 2020 - Dec 2021",
    bullets: [
      "Independently engineered ShareYourTruck, a React Native cross-platform delivery application, managing end-to-end frontend and backend development with real-time order tracking, driver management, and payment processing.",
      "Architected the ShareYourTruck mobile experience for iOS and Android, enabling logistics and on-demand delivery services with integrated mapping, live notifications, and customer-driver communication.",
      "Developed full-stack backend infrastructure for MiraMira, an MBTI-based school platform, implementing personality-driven student matching and personalized dashboards.",
      "Delivered custom HRMS, ERP, and dashboard solutions for multiple clients, owning the complete lifecycle from requirements gathering to production deployment and maintenance.",
      "Led and mentored a backend development team, ensuring adherence to best practices and integrating Twilio and SendGrid across multiple client projects.",
      "Improved development efficiency through serverless architecture and REST APIs on MongoDB Atlas, integrating third-party APIs including Stripe and Calendly via webhooks.",
      "Introduced Docker containerization for backend applications, streamlining deployment across diverse client environments."
    ]
  },
  {
    title: "Software Test Engineer",
    company: "TeenagerStartups.com",
    location: "Remote",
    period: "Jan 2020 - Oct 2020",
    bullets: [
      "Implemented comprehensive backend test suites using the Django unit test framework, achieving 90 percent test coverage and reducing production defects.",
      "Conducted frontend testing with Selenium and cross-browser compatibility testing with BrowserStack and LambdaTest.",
      "Containerized the application using Docker and Docker Compose, simplifying deployment.",
      "Established Continuous Integration pipelines in GitLab, improving development efficiency and product quality.",
      "Applied a systematic approach to test planning, execution, and reporting within a fully remote team."
    ]
  }
];

export const careerHighlights = [
  "Recognized as one of the most productive engineers at Dhenusya Infotech, delivering applications on short notice and earning a salary increase of over 150 percent from probation to departure.",
  "Independently developed an analytics dashboard for manpower requisition and COVID-19 vaccination statistics that remains in extensive use within the Apollo Telehealth internal ERP (rise.hng.co.in).",
  "Conducted Python and web development seminars for 50 to 60 attendees at a local NGO, with one participant subsequently hired at Dhenusya Infotech.",
  "As the only non-IT-background engineer on a team of IIT students at TeenagerStartups.com, improved code quality by enforcing PEP 8 compliance and readability standards during unit test development.",
  "Submitted open-source pull requests to two perfume e-commerce projects, covering a Django 6.0.2 and Python 3.13 dependency upgrade and an e-commerce frontend initialization."
];

export const earlyCareer = [
  {
    title: "Bartender",
    company: "URU Brewpark",
    location: "Bangalore, India",
    period: "Jun 2018 - Oct 2018",
    bullets: [
      "Trained in flair and mixology, developing extensive product knowledge and guest-facing communication skills.",
      "Contributed to upselling and guest experience, and was recognized by management for dedication in the role.",
      "Transitioned from hospitality to software development to pursue analytical and engineering strengths."
    ]
  }
];

export const skills = [
  {
    category: "Programming Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL"]
  },
  {
    category: "Backend and Real-Time",
    items: ["Flask", "Django", "Node.js", "REST APIs", "MQTT", "MQTT over WebSocket", "WebSocket", "Publish/Subscribe Messaging", "Event-Driven Architecture", "Redis", "Serverless Architecture", "Webhooks", "Third-Party API Integration", "Twilio", "SendGrid"]
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MongoDB", "Supabase", "MongoDB Atlas", "Database Design", "Query Optimization", "Schema Migrations"]
  },
  {
    category: "iGaming and Betting",
    items: ["Fair Play Systems", "Fair-Play Validation", "Game Outcome Verification", "Player Engagement and Offers Modules", "Payment Gateway Integration", "Live Stake Broadcasting", "Hedge System", "Live Sports Scorecards", "B2C Casino Platform"]
  },
  {
    category: "E-Commerce",
    items: ["MedusaJS", "Next.js Storefront", "Response Caching and Cache Revalidation", "Order, Product and Inventory Management", "Stripe API", "Razorpay", "Shiprocket", "Shipping and Fulfilment Automation", "Order Tracking"]
  },
  {
    category: "Frontend and Mobile",
    items: ["React", "React Native", "Next.js", "Cross-Platform Mobile Development", "HTML5", "CSS3"]
  },
  {
    category: "Cloud and DevOps",
    items: ["AWS", "Google Cloud Platform", "Kubernetes (GKE)", "Docker", "Docker Compose", "CI/CD Pipelines", "GitLab CI", "Git", "Shell Scripting"]
  },
  {
    category: "Testing and QA",
    items: ["Test-Driven Development (TDD)", "Unit Testing", "Django Test Framework", "Selenium", "BrowserStack", "LambdaTest", "Regression Testing", "Jira", "Agile"]
  },
  {
    category: "Architecture and Design",
    items: ["Object-Oriented Programming", "Low-Level Design (LLD)", "System Design", "SOLID Principles", "Design Patterns (Strategy, Factory, Singleton, Decorator, Manager)"]
  }
];

export const education = [
  {
    degree: "Bachelor of Hospitality Management",
    institution: "Bharathiyar University",
    location: "Visakhapatnam, India",
    period: "Sep 2017 - Aug 2020",
    graduationDate: "Aug 2020"
  }
];

export const certificates = [
  "CS50: Introduction to Computer Science, Harvard University",
  "Data Structures, Algorithms and System Design, Scaler",
  "Test-Driven Development with Django and Python, Udemy",
  "UI/UX Research, Google"
];

export const links = [
  { label: "48-Hour Coding Challenge", url: "https://nfthub-git-master-gotham-zerns-projects.vercel.app/" },
  { label: "LinkedIn Profile", url: "https://www.linkedin.com/in/goutham-doddi-22441b138/" },
  { label: "GitHub Profile", url: "https://github.com/GouthamDoddi" }
];

export const interests = [
  "Tennis",
  "Guitar",
  "MBTI and psychology",
  "Geopolitics",
  "Perfumery and fragrance composition"
];

export const personalDetails = [
  { label: "Notice Period", value: "Immediate joiner, no notice period required" },
  { label: "Nationality", value: "Indian" },
  { label: "Languages", value: "English (Fluent), Hindi (Conversational), Telugu (Native), Russian (Reading proficiency)" },
  { label: "References", value: "Available upon request" }
];