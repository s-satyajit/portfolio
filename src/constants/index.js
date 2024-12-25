import {
  webDev,
  mobileDev,
  uiux,
  devops,
  javascript,
  typescript,
  java,
  kubernetes,
  kafka,
  reactjs,
  python,
  nodejs,
  mongodb,
  eduskills_foundation,
  artsnmor,
  fluenceTech,
  liveTalk,
  hirrd,
  ems,
  codeStudio,
  currencyConverter,
  geoLocator,
  docker,
  webRTC,
  redis,
  aws,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: webDev,
  },
  {
    title: "App Developer",
    icon: mobileDev,
  },
  {
    title: "UI/UX Designer",
    icon: uiux,
  },
  {
    title: "DevOps Engineer",
    icon: devops,
  },
];

const technologies = [
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Python",
    icon: python,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "WebRTC",
    icon: webRTC,
  },
  {
    name: "Redis",
    icon: redis,
  },
  {
    name: "Kafka",
    icon: kafka,
  },
  {
    name: "Kubernetes",
    icon: kubernetes,
  },
  {
    name: "docker",
    icon: docker,
  },
  {
    name: "aws",
    icon: aws,
  },
  {
    name: "Java",
    icon: java,
  },
];

const experiences = [
  {
    title: "Software Developer Intern",
    company_name: "EduSkills Foundation",
    icon: eduskills_foundation,
    iconBg: "#383E56",
    date: "Aug 2024 - Dec 2024",
    points: [
      "I developed backend systems for web applications using Node.js and Express.js, focusing on making them fast and scalable.",
      "Designed and optimized MySQL databases, writing clean and efficient queries to handle large amounts of data without slowing down the system.",
      "Worked on deploying the applications using Docker and automated workflows with GitHub Actions to save time during development.",
      "Implemented user login systems with secure authentication using JWT (JSON Web Tokens) and OAuth2.",
    ],
  },
  {
    title: "Frontend Developer Intern",
    company_name: "Artsnmor",
    icon: artsnmor,
    iconBg: "#383E56",
    date: "Oct 2023 - Mar 2023",
    points: [
      "I built interactive and responsive web pages using React.js, JavaScript, and modern web libraries to ensure everything worked smoothly and looked great.",
      "Connected the frontend with backend APIs to fetch and display data dynamically, making the apps feel alive and real-time.",
      "Focused on improving performance by using techniques like lazy loading and managing states efficiently with tools like Redux.",
      "Gained experience working in a team using Agile methodology, where I used Git for version control and used JIRA to track tasks and collaborate effectively.",
    ],
  },
  {
    title: "UI/UX Designer Intern",
    company_name: "FluenceTech",
    icon: fluenceTech,
    iconBg: "#383E56",
    date: "Dec 2022 - May 2023",
    points: [
      "I worked on designing user-interfaces by creating wireframes, prototypes, and user flows using tools Figma.",
      "Collaborated with developers and tested designs with real users to find out what could be improved and made changes based on feedback to create a better experience.",
      "Focused on making designs responsive, so they looked great and worked well on different devices, using CSS frameworks and best practices.",
      "Learned how to balance aesthetics and functionality while keeping the user’s needs at the center of the design process.",
    ],
  },
];

const socialHandles = [
  {
    platform: "GitHub",
    url: "https://github.com/s-satyajit",
    api: "https://api.github.com/users/s-satyajit",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/satyajitsamal/",
    static: {
      name: "Satyajit Samal",
      profilePicture:
        "https://media.licdn.com/dms/image/v2/D4D03AQF4tUeWQcytyw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1667214908011?e=1740614400&v=beta&t=BlgDsE-JOHoGfUJL-uHKzc1gp1XV7BvDazJVzS41vuU", 
      bio: "Software Developer | Building User-Focused Web Applications | Ex-intern @fluenceTech",
    },
  },
  {
    platform: "X",
    url: "https://x.com/satyajitstwt",
    static: {
      name: "satyajitstwt",
      profilePicture:
        "https://pbs.twimg.com/profile_images/1585863434293637120/NBV79bKw_400x400.jpg",
      bio: "Software Developer | Skilled in JavaScript, React, Node.js, MongoDB | Building user centric web apps | Ex-intern @artsnmor, @fluenceTech",
    },
  },
];

const projects = [
  {
    name: "LiveTalk - Multi User Chat App",
    description:
      "A chat application that lets you chat with multiple people at the same time, designed to make communication easy and smooth.",
    tags: [
      {
        name: "html",
        color: "blue-text-gradient",
      },
      {
        name: "css",
        color: "green-text-gradient",
      },
      {
        name: "javascript",
        color: "pink-text-gradient",
      },
      {
        name: "open-trivia",
        color: "green-text-gradient",
      },
    ],
    image: liveTalk,
    source_code_link: "https://github.com/s-satyajit/multi-user-chatApp",
  },
  {
    name: "Hirrd - Job Portal App",
    description:
      "Web application that enables users to create professional and polished resumes effortlessly. With its user-friendly interface and intuitive design, anyone can easily generate a visually appealing resume in minutes. This repository contains the source code for the Resume Wizard website.",
    tags: [
      {
        name: "html",
        color: "blue-text-gradient",
      },
      {
        name: "css",
        color: "green-text-gradient",
      },
      {
        name: "javascript",
        color: "pink-text-gradient",
      },
    ],
    image: hirrd,
    source_code_link: "https://github.com/s-satyajit/hirrd-jobPortal",
  },
  {
    name: "TeamZen - Employee Management System",
    description:
      "A React based Employee Management System offering efficient employee data management with a responsive interface.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tkinter",
        color: "green-text-gradient",
      },
    ],
    image: ems,
    source_code_link:
      "https://github.com/s-satyajit/employee-management-system",
  },
  {
    name: "CodeStudio - Web Code Editor",
    description:
      "A web-based code editor for HTML, CSS, and JavaScript, offering live preview, and syntax highlighting. Perfect for seamless and intuitive web development!",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tkinter",
        color: "green-text-gradient",
      },
    ],
    image: codeStudio,
    source_code_link: "https://github.com/s-satyajit/WebCodeEditor",
  },
  // {
  //   name: "Inventory Dashboard",
  //   description:
  //     "This Inventory Management Dashboard is designed to analyze and report data from a single Excel sheet, providing clear insights through interactive charts and detailed tables.",
  //   tags: [
  //     {
  //       name: "python",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "tkinter",
  //       color: "green-text-gradient",
  //     },
  //   ],
  //   image: ems,
  //   source_code_link: "https://github.com/s-satyajit/inventory-dashboard",
  // },
  {
    name: "Currency Converter",
    description:
      "A currency conversion application that offers users real-time exchange rates, a user-friendly interface, and quick currency calculations. Perfect for finance professionals and international travelers.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tkinter",
        color: "green-text-gradient",
      },
    ],
    image: currencyConverter,
    source_code_link:
      "https://github.com/s-satyajit/CurrencyConverterApp-ReactJS",
  },
  {
    name: "Geo Locator",
    description:
      "GeoLocatior is a web application that fetches the latitude and longitude of a user's device using the HTML Geolocation API. It then displays the user's position on a map.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tkinter",
        color: "green-text-gradient",
      },
    ],
    image: geoLocator,
    source_code_link: "https://github.com/s-satyajit/geo-locator-app-js",
  },
];

export { services, technologies, experiences, socialHandles, projects };
