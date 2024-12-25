# 3D Portfolio

![Screenshot](/src/assets/screenshot.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installing Dependencies](#installing-dependencies)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Security Policy](#security-policy)
- [License](#license)

## Introduction

This is my personal portfolio website built with React, Vite, and Tailwind CSS. It showcases my various projects and experiences, providing a visually appealing and interactive user experience. The website leverages advanced web technologies such as Three.js, React Three Fiber, and Framer Motion to create interactive 3D models and animations.

## Features

- Responsive design using Tailwind CSS
- Interactive 3D models with Three.js and React Three Fiber
- Email functionality with EmailJS
- Animations with Framer Motion
- GitHub activity calendar
- Vertical timeline for experiences

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **3D Models**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Email**: EmailJS

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.22.x or higher)

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/s-satyajit/portfolio.git
   cd portfolio
   ```

### Installing Dependencies

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your EmailJS credentials:

   ```properties
   VITE_APP_EMAILJS_SERVICE_ID=your_service_id
   VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
.
├── .env                      # Environment variables
├── .env.sample               # Sample environment variables
├── .gitignore                # Git ignore rules
├── index.html                # Main HTML file
├── LICENSE                   # License file
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Lockfile for npm dependencies
├── postcss.config.cjs        # PostCSS configuration
├── public/                   # Public assets
│   ├── desktop_pc/           # Desktop PC assets
│   │   ├── license.txt       # License file
│   │   ├── scene.gltf        # 3D model file
│   │   └── textures/         # Textures for the 3D model
│   └── planet/               # Planet assets
│       ├── license.txt       # License file
│       ├── scene.gltf        # 3D model file
│       └── textures/         # Textures for the 3D model
├── src/                      # Source code
│   ├── assets/               # Asset files
│   │   ├── company/          # Company logos
│   │   ├── tech/             # Technology logos
│   │   ├── close.svg         # Close icon
│   │   ├── github.png        # GitHub logo
│   │   ├── logo.png          # Website logo
│   │   ├── menu.svg          # Menu icon
│   │   └── ...               # Other assets
│   ├── components/           # React components
│   │   ├── About.jsx         # About component
│   │   ├── Contact.jsx       # Contact component
│   │   ├── Experience.jsx    # Experience component
│   │   ├── Github.jsx        # GitHub component
│   │   ├── Hero.jsx          # Hero component
│   │   ├── IndividualSocialHandle.jsx # Individual social handle component
│   │   ├── Loader.jsx        # Loader component
│   │   ├── Navbar.jsx        # Navbar component
│   │   ├── Tech.jsx          # Tech component
│   │   ├── Works.jsx         # Works component
│   │   ├── canvas/           # Canvas components for 3D models
│   │   │   ├── BallCanvas.jsx # Ball canvas component
│   │   │   ├── ComputersCanvas.jsx # Computers canvas component
│   │   │   ├── EarthCanvas.jsx # Earth canvas component
│   │   │   └── StarsCanvas.jsx # Stars canvas component
│   │   └── index.js          # Component index file
│   ├── constants/            # Constants
│   │   └── index.js          # Constants index file
│   ├── hoc/                  # Higher-order components
│   │   └── SectionWrapper.js # Section wrapper component
│   ├── index.css             # Global styles
│   ├── main.jsx              # Application entry point
│   ├── main.test.js          # Test file
│   ├── styles.js             # Styles
│   └── utils/                # Utility functions
│       └── motion.js         # Motion utility functions
├── tailwind.config.cjs       # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
└── vitest.config.js          # Vitest configuration
```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build.
- `npm test`: Run tests with Vitest.

## Environment Variables

The following environment variables are required:

- `VITE_APP_EMAILJS_SERVICE_ID`: Your EmailJS service ID.
- `VITE_APP_EMAILJS_TEMPLATE_ID`: Your EmailJS template ID.
- `VITE_APP_EMAILJS_PUBLIC_KEY`: Your EmailJS public key.

## Security Policy

Please read our [Security Policy](SECURITY.md) for details on supported versions and how to report vulnerabilities.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.