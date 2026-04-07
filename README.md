# Administrative Letter Generator

A production-ready Next.js 14 web application for creating administrative letters in English and previewing them in Hindi or Marathi using Devanagari script. The app is designed for Vercel deployment, uses a free LibreTranslate endpoint through a Next.js API route, and supports Word export, PDF export, and copy-to-clipboard.

## Features

- English administrative letter editor with government-style sections
- Real-time translated preview for Hindi and Marathi
- 500ms debounced translation flow
- Official document-style preview with Devanagari typography
- Word export using `docx`
- PDF export using `html2pdf.js`
- Copy translated document to clipboard
- Mobile responsive admin UI
- No authentication and no paid APIs

## Tech Stack

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- `shadcn/ui`-style component setup
- LibreTranslate public API
- `docx` for `.docx` generation
- `html2pdf.js` for PDF generation

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

The app works with the default public endpoint, but you can override it:

```env
LIBRETRANSLATE_URL=https://translate.cutie.dating/translate
```

## Build and Production

Run a production build locally:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Deploy on Vercel

1. Push this project to a Git repository.
2. Import the repository into Vercel.
3. Set `LIBRETRANSLATE_URL` in Vercel project settings if you want to use a different LibreTranslate instance.
4. Deploy with the default Next.js build settings.

This project uses only Next.js pages and route handlers, so no custom backend server is required.

## Project Structure

```text
app/
components/
lib/
utils/
styles/
```

## Notes

- The app tries free LibreTranslate-compatible mirrors first and falls back to a free no-key translation endpoint when needed, which keeps Hindi and Marathi working without a paid service.
- PDF generation is handled client-side, which keeps the app compatible with Vercel serverless deployment.
- Rich-text formatting is intentionally out of scope for this version; formatting is preserved at the section and paragraph level.
