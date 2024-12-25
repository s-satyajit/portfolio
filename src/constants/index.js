import {
  mobile,
  backend,
  iot,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  python,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  github_logo,
  eduskills_foundation,
  artsnmor,
  fluenceTech,
  quizzify,
  resume,
  codevault,
  threejs,
  github,
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
    icon: web,
  },
  {
    title: "App Developer",
    icon: iot,
  },
  {
    title: "Python Developer",
    icon: mobile,
  },
  {
    title: "DevOps Engineer",
    icon: backend,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
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
    name: "Tailwind CSS",
    icon: tailwind,
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
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "github",
    icon: github_logo,
  },
];

const experiences = [
  {
    title: "Software Developer Intern",
    company_name: "EduSkills Foundation",
    icon: eduskills_foundation,
    iconBg: "#383E56",
    date: "June 2023 - July 2023",
    points: [
      "Developing and maintaining web applications using Web Dev Technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in active designing and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Frontend Developer Intern",
    company_name: "Artsnmor",
    icon: artsnmor,
    iconBg: "#383E56",
    date: "June 2023 - July 2023",
    points: [
      "Developing and maintaining web applications using Web Dev Technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in active designing and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "UI/UX Designer Intern",
    company_name: "FluenceTech",
    icon: fluenceTech,
    iconBg: "#383E56",
    date: "June 2023 - July 2023",
    points: [
      "Developing and maintaining web applications using Web Dev Technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in active designing and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I Always Knew That You're Gonna Rock One Day And Here You're With This Beautiful Website",
    name: "Rishav Nayak",
    designation: "4th Year Student",
    company: "Madhav Institute Of Technology And Science",
    image: "https://rrnayak70.github.io/asset/assets/img/IMG_20230103_012557.jpg"},
  {
    testimonial:
      "I Know You Had The Potential To Do Anything You Just Needed A Push And I Gave You That.",
    name: "Sanskriti Yadav",
    designation: "3rd Year Student",
    company: "Madhav Institute Of Technology And Science",
    image: "https://img.lovepik.com/free-png/20210923/lovepik-cute-girl-avatar-png-image_401231841_wh1200.png",
  },
  {
    testimonial:
      "When I First Started Teaching You After It I Realised You're A Quick Leaner And You'll Become A Great Developer",
    name: "Harshil Bansal",
    designation: "Founder",
    company: "edSlash",
    image: "https://media.licdn.com/dms/image/D4D03AQEKzlmMH3hTSg/profile-displayphoto-shrink_400_400/0/1681105605606?e=1695859200&v=beta&t=Qpl1GZBg8Jr80_VoV0ZYU3ngov62L58xkKebg2xPKI8",
  },
];

const projects = [
  {
    name: "Quiz Webiste",
    description:
      "Experience the thrill of our interactive quiz website, crafted with HTML, CSS, and JavaScript. Challenge yourself with a wide range of questions from different categories, powered by Open Trivia DB. Engaging, user-friendly, and fun – test your knowledge and enjoy the journey of learning!",
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
    image: quizzify,
    source_code_link:"https://github.com/alok-2002/quizzify",
  
  },
  {
    name: "Resume Builder",
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
    image: resume,
    source_code_link: "https://github.com/alok-2002/resume_wizard",
  },
  {
    name: "Trip Guide",
    description:
      "Code Vault is a Windows & Android application that provides encryption and decryption of text using the Base64 algorithm and a secret key.This app allows users to securely store and share sensitive information by encoding it into Base64 format with a secret key.",
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
    image: codevault,
    source_code_link: "https://github.com/Alok-2002/Code_Vault_For_Windows",
  },
];

export { services, technologies, experiences, testimonials, projects };
