# Alfred Ofori — Personal Portfolio

> Data Science & Analytics · Software Development · Creative Technology

A futuristic, minimal, high-performance personal portfolio built with React, Vite, TypeScript, and Tailwind CSS. Features WebGL lightning backgrounds, smooth scroll animations, and a scroll-driven SVG progress bar.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| TypeScript | Type safety |
| Tailwind CSS | Utility styling |
| GSAP | Animations |
| Lenis | Smooth scrolling |
| Lucide React | Icons |
| WebGL (custom) | Lightning background effect |

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Opens at: `http://localhost:5173`

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

### Preview production build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── App.tsx           ← Main app — all sections live here
├── Lightning.tsx     ← WebGL lightning background component
├── Logo.tsx          ← SVG logo mark + wordmark
├── main.tsx          ← React entry point
└── index.css         ← Global styles + Tailwind imports
```

---

## How to Customise

### Update your personal info
Edit the data arrays at the top of `src/App.tsx`:

```ts
const projects = [ ... ]   // Your projects
const skillGroups = [ ... ] // Your tech stack
const timeline = [ ... ]    // Your journey/milestones
const contacts = [ ... ]    // Your contact details
```

### Update contact numbers
In `src/App.tsx`, find the `contacts` array:

```ts
const contacts = [
  { label: "PHONE",   text: "0597 580 576", href: "tel:+233597580576" },
  { label: "PHONE 2", text: "0598 942 192", href: "tel:+233598942192" },
  ...
];
```

### Update your email
Search for `alfred@example.com` and replace with your real email.

### Update GitHub & LinkedIn
Search for `alfredofori` and replace with your real username.

### Add your CV
Place your CV file in the `public/` folder (e.g. `public/alfred-ofori-cv.pdf`), then link to it with `/alfred-ofori-cv.pdf`.

### Replace project images
Place images in `public/projects/` and reference them in the projects array:

```ts
{ id: 1, title: "...", image: "/projects/project1.jpg", ... }
```

---

## Deployment

### Vercel (recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the repo — Vercel auto-detects Vite
4. Deploy

### Netlify
1. Run `npm run build`
2. Drag the `dist/` folder into [netlify.com/drop](https://app.netlify.com/drop)

---

## Contact

**Alfred Ofori**
- Phone: 0597 580 576 / 0598 942 192
- Email: alfred@example.com
- GitHub: [github.com/alfredofori](https://github.com/alfredofori)
- LinkedIn: [linkedin.com/in/alfredofori](https://linkedin.com/in/alfredofori)
- Institution: Ghana Communication Technology University

---

© 2026 Alfred Ofori. All rights reserved.
