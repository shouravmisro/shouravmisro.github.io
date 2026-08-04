# 🚀 Modern Multi-Profile Developer & SQA Portfolio

A state-of-the-art, high-performance developer portfolio and blog built with **Astro 5**, **Tailwind CSS v4**, **TypeScript**, **React**, and **Decap CMS**.

It features multi-profile homepages (Software QA `/qa`, IoT/Embedded `/iot`, and Combined `/`), an integrated technical blog system, and two visual admin editors (`/make` and `/admin`).

---

## ✨ Features

- 🎯 **Multi-Profile System**:
  - **`/`**: Combined Developer, SQA, and Embedded Systems profile.
  - **`/qa`**: Tailored Software Quality Assurance (SQA) & Manual/API Testing portfolio.
  - **`/iot`**: Tailored IoT, Robotics, & Embedded Systems Engineering portfolio.
- 📝 **Technical Blog System**:
  - Full blogging platform with category filtering (`SQA`, `IoT`, `Engineering`).
  - Markdown content support with code highlighting, reading times, tags, and dynamic routing (`/blog/[slug]`).
- ⚡ **Dual Content Management Options**:
  - **Visual Site Builder (`/make`)**: Edit profile data, experience, and projects in an interactive visual wizard.
  - **Decap CMS Admin (`/admin`)**: Edit blog posts, experience, achievements, and site metadata directly from your browser.
- 🌓 **Light & Dark Theme**: Built-in dark mode toggle with soft off-white light mode palette.
- 🚀 **GitHub Pages Deployment Ready**: Static site build pipeline optimized for instant GitHub Pages hosting.

---

## 📁 Project Structure

```text
├── public/
│   ├── admin/             # Decap CMS admin dashboard (/admin)
│   ├── site.json          # Main portfolio database (Bio, Experience, Projects)
│   └── uploads/           # Uploaded images and media
├── src/
│   ├── components/
│   │   ├── ProfileHome.astro # Reusable multi-profile homepage component
│   │   ├── Sidebar.astro     # Responsive sidebar navigation
│   │   └── make/             # Interactive site builder UI (/make)
│   ├── data/
│   │   └── blogs.ts          # Blog data schema and posts
│   ├── content/
│   │   └── blogs/            # Markdown blog posts created via CMS
│   ├── middleware.ts         # Route redirects (/QA -> /qa, /IOT -> /iot)
│   ├── pages/
│   │   ├── index.astro       # Root portfolio (Combined Profile)
│   │   ├── qa/               # SQA Profile (/qa, /qa/projects, /qa/blog, etc.)
│   │   ├── iot/              # IoT Profile (/iot, /iot/projects, /iot/blog, etc.)
│   │   └── blog/             # Main Blog index and [slug] post renderer
│   └── styles/
│       └── global.css        # Core design tokens and global CSS
├── astro.config.mjs
└── package.json
```

---

## 🛠️ Step-by-Step Setup Guide

Follow these steps to build and customize this portfolio for yourself:

### 1. Prerequisites
Ensure you have **Node.js (v18 or higher)** and **git** installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/shouravmisro/shouravmisro.github.io.git
cd shouravmisro.github.io
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Local Development Server
```bash
npm run dev
```
Open **`http://localhost:4321`** in your browser to view your live portfolio.

---

## ✍️ How to Customize Your Content

### Method 1: Using the Visual Builder (`/make`)
1. With your dev server running, navigate to **`http://localhost:4321/make`**.
2. Fill out your name, bio, experience, skills, and projects in the interactive wizard.
3. Click **Export site.json** and replace the file at `public/site.json`.

### Method 2: Using the Admin Dashboard (`/admin`)
1. Open **`http://localhost:4321/admin`** in your browser.
2. Add or edit **Blog Posts**, **Experience**, and **Achievements**.
3. Changes saved in the admin panel are automatically written to disk.

### Method 3: Editing Data Files Directly
- **Personal Info & Experience**: Edit `public/site.json`.
- **Blog Posts**: Add or edit blog posts in `src/data/blogs.ts` or add Markdown `.md` files to `src/content/blogs/`.

---

## 🚀 Deploying to GitHub Pages

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit with customized portfolio content"
   git push origin main
   ```

2. **Configure GitHub Pages**:
   - Go to your repository settings on GitHub: `Settings > Pages`.
   - Set **Source** to **GitHub Actions** (or `Deploy from a branch` -> `gh-pages` / `main`).
   - If using Astro GitHub Action, your site will automatically build and publish!

---

## 📜 Available Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts local development server at `http://localhost:4321` |
| `npm run build` | Compiles the production static bundle to `./dist/` |
| `npm run preview` | Previews the production build locally |

---

## 📄 License

Distributed under the MIT License. Feel free to fork and adapt it for your personal portfolio!
