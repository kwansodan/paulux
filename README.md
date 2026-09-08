# Paulux | Private, Standalone Booking & Management Platform

Paulux is a standalone, white-label appointment booking and business management platform deployed on dedicated domains for high-volume appointment businesses:
- 💈 **Barbershops & Grooming Lounges**
- 💉 **MedSpas & Aesthetic Clinics**
- ✂️ **Hair Salons & Color Studios**
- 🎨 **Tattoo & Piercing Studios**
- 💆 **Massage Therapy & Bodywork**
- 🏋️ **Fitness Studios & Private Coaching**
- 💅 **Nail Bars & Lash Lounges**
- 🐕 **Pet Grooming Boutiques**

## Key Value Proposition

- **0% Commission:** Zero marketplace taxes or per-booking surcharges (unlike Fresha, Mindbody, Booksy).
- **Your Own Domain:** Runs on your branded domain (`booking.yourbrand.com`).
- **100% Data Sovereignty:** Private database, full client history, and direct customer relationships.
- **Direct Merchant Payouts:** Integrates directly with Paystack / Stripe into your own bank account.
- **Turnkey 48-Hour Deployment:** Provisioned and configured with hands-on engineer onboarding.

## Architecture

This repository contains the marketing, SEO snapshot generation, interactive demo tour, and Vercel serverless lead acquisition engine:
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4.
- **SEO Architecture:** Automated crawler snapshots (`scripts/generate-seo-pages.cjs`), Schema.org JSON-LD (`SoftwareApplication`, `Product`, `FAQPage`, `Article`), OpenGraph, Twitter Cards, dynamic sitemap, and robots.txt.
- **Lead Capture API:** Vercel Serverless Function (`frontend/api/leads.ts`) receiving quote inquiries and dispatching instant email alerts via Resend and SMS alerts via Arkesel to operations.

## Environment Variables

### Live Chat (Chatwoot)
- `VITE_CHATWOOT_WEBSITE_TOKEN`: Website Inbox Token from your Chatwoot Dashboard (**Settings** -> **Inboxes** -> **Add Inbox** -> **Website**).
- `VITE_CHATWOOT_BASE_URL`: Chatwoot instance base URL (defaults to `https://app.chatwoot.com`, or your self-hosted Chatwoot domain).

### Lead Notifications (Vercel Serverless Function)
- `RESEND_API_KEY`: Resend API key for admin email alerts.
- `OPS_EMAIL`: Email address to receive lead notifications.
- `ARKESEL_API_KEY`: Arkesel API key for instant SMS dispatch.
- `OPS_PHONE`: Operations phone number for SMS alerts.
- `ARKESEL_SENDER_ID`: Custom SMS Sender ID (e.g. `Paulux`).

### Direct Contact Widgets
- `VITE_PLATFORM_WHATSAPP`: WhatsApp support phone number for direct messaging widget.
- `VITE_PLATFORM_INSTAGRAM`: Instagram handle without `@`.

