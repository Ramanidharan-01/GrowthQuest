<div align="center">
  <img src="https://raw.githubusercontent.com/Ramanidharan-01/GrowthQuest/main/Dashboard.png" alt="GrowthQuest Dashboard Interface" style="max-width: 800px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />

  <h1>GrowthQuest</h1>
  <h3>Data-Driven Analytics and Progress Tracking Architecture</h3>

  <p>
    <a href="https://growthquest-bice.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo"></a>
    <img src="https://img.shields.io/badge/Tech_Stack-React_%7C_Next.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Tech Stack">
    <img src="https://img.shields.io/badge/Developer-Ramanidharan_D.-0A66C2?style=for-the-badge&logo=github" alt="Developer">
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  </p>
</div>

## The Vision

GrowthQuest is an advanced analytics dashboard engineered to transform complex datasets into actionable, highly visualized insights. Designed with performance and scalability at its core, the platform addresses the challenge of data fragmentation by providing a unified interface for progress tracking, metric analysis, and goal management. The application leverages a modern, component-driven frontend architecture to ensure rapid rendering efficiency and seamless user interactions.

By bridging the gap between raw data and intuitive user experience, GrowthQuest eliminates analytical bottlenecks. The interface is purposefully constructed with micro-interactions, responsive grid layouts, and optimized state management, ensuring that users can parse high-density information without cognitive overload or system latency.

# 🚀 Getting Started with GrowthQuest

Welcome to the **GrowthQuest** project! Follow this comprehensive guide to set up your local environment, run the development server, and build the application for production.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: [Download here](https://nodejs.org/) (v14 or higher recommended)
- **Package Manager**: npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)

---

## ⚙️ Setup & Installation

### 1. Navigate to the Project Directory
Open your terminal and navigate to the root folder of the project:

```bash
cd GrowthQuest
```

### 2. Install Dependencies
Install all required packages and dependencies defined in the `package.json` file. You can use either `npm` or `yarn`:

```bash
# Using npm (Default):
npm install

# Or if you prefer yarn:
yarn install
```

---

## 💻 Local Development

### 3. Fire up the Development Server
Launch the application locally to start developing. Run the following command:

```bash
npm run dev
```

> 💡 **Quick Note:** Check your `package.json` scripts. If your setup uses a different command to start the app (like `npm start` for Create React App setups rather than Vite), simply replace `npm run dev` with `npm start` in your terminal.

### 4. View the Application
Once the local server has started, open your favorite web browser and navigate to:

```plaintext
http://localhost:3000
```
*(Note: Check your terminal for the exact port. If you are using Vite, it might default to something like `http://localhost:5173`)*

---

## 🏗️ Building for Production

When you are ready to deploy, you can generate an optimized, minified build of the project:

```bash
npm run build
```

The output will be generated in a `dist/` or `build/` folder at the root of your project. These files are optimized for performance and are fully ready to be served by any static hosting provider (e.g., Vercel, Netlify, AWS S3, or GitHub Pages).


## System Architecture

```mermaid
graph TD
    Client[👤 User / Client] -->|Interacts| UI[🖥️ UI / Component Layer]
    UI -->|Triggers Updates| State[🔄 State Management]
    UI -->|Async Fetch| API[🌐 API / Controller Layer]
    API -->|Queries| DB[🗄️ Primary Data Store]
    API -->|Aggregates Metrics| Analytics[📊 Analytics Engine]
    State --> UI
    DB --> API
