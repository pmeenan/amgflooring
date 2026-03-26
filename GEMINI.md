# AMG Flooring - Gemini Context

This document captures project conventions, architectural decisions, and context built up over previous sessions. AI assistants should read this file to avoid regressing on previously solved problems.

## Tech Stack & Architecture

- **Framework:** Astro 5 with React integrations
- **Styling:** TailwindCSS
- **Animations & UI:** Framer Motion, Embla Carousel (`embla-carousel-react`), Lucide React icons
- **Types:** TypeScript

## Key Conventions & Workflows

### 1. Gallery Image Processing
- **Source:** Raw images are placed in staging directories (e.g., `_staging_photos/`).
- **Processing Script:** Use `scripts/process_galleries.js` to process images before they are moved to production content directories (`src/content/gallery/`).
- **Processing Requirements:**
  - Read EXIF data to fix orientation/rotation issues.
  - Resize images to a maximum of 1024x1024 pixels, maintaining aspect ratio.
  - Compress to JPEG format with quality 85 for optimal web performance.
  - The project utilizes `sharp` to accomplish these transformations.

### 2. Markdown & Content Guidelines
- **Image Captions:** When rendering Markdown articles or posts, captions should be generated using the Markdown `title` attribute. Ensure proper margin spacing between images and their captions.
- **Code Blocks:** If technical content is added, code blocks contain syntax highlighting, adapt correctly to light/dark modes, and include a "copy to clipboard" feature.

### 3. Deployment
- **Scripts:** Use the provided `./deploy.sh` (or `deploy.cmd` on Windows) routines.
- **Process:** The deployment scripts build the Astro project to the `dist/` directory and use `rsync` to synchronize the contents to the production server at `amgflooring.us`.

## Design Philosophy
- **Aesthetic Priorities:** Emphasize a rich, modern, and premium design language.
- **Micro-Animations:** Utilize Framer Motion for subtle entry animations, hover effects, and transitions to make the web app feel dynamic and responsive.
- **Format:** Ensure all interfaces maintain rigorous responsive layouts suitable for all device sizes.
