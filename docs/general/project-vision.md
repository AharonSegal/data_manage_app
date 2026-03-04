# 🎯 Project Vision — Client Project Management Platform

---

## The Problem

A business owner manages multiple ongoing projects simultaneously. Each project involves collecting data, tracking information, and performing repetitive manual tasks — all of which are currently handled by hand across a scattered collection of Excel files.

The day-to-day reality looks like this:
- Data arrives from various sources — WhatsApp messages, emails, Excel files, phone calls
- Someone manually copies that data into a spreadsheet
- Someone then manually logs into external websites or portals and re-enters that same data into forms
- Reports and summaries are manually compiled
- Follow-ups, alerts, and notifications are sent manually
- If something is missed, there is no safety net

This process is:
- **Slow** — enormous amounts of time spent on repetitive data entry
- **Error-prone** — manual copying between systems causes mistakes
- **Unscalable** — as the business grows, the manual load grows with it
- **Invisible** — there is no central place to see the status of everything at once
- **Stressful** — critical tasks depend entirely on a person remembering to do them

---

## The Vision

Build a **custom business operating system** — a single web application that replaces the Excel files, eliminates the manual data entry, automates the repetitive tasks, and gives the business owner a clear real-time view of everything happening across all their projects.

This is not a generic project management tool like Trello or Asana. It is built specifically around this business's exact workflows, data structures, and processes. Every project in the app maps directly to a real project in the business.

---

## How It Works — The Big Picture

### Data comes in
Instead of copying data from WhatsApp into Excel, data is entered once — directly into the app — either manually through a clean form, or automatically parsed from incoming messages, emails, or uploaded files.

### The app takes over
Once data is in the system, the app handles everything that used to be done manually:
- Logging into external portals and filling in forms automatically
- Sending WhatsApp or email notifications to the right people
- Generating reports and summaries
- Triggering alerts when thresholds are crossed or deadlines are missed

### The owner stays in control
Before any automated action is taken, the owner gets a WhatsApp notification showing the details and asking for approval. One reply — YES or NO — and the system acts. After every action, a confirmation is sent with a screenshot or summary as proof.

### Everything is visible
The main dashboard shows a live overview of all projects — statuses, recent activity, key numbers, and anything requiring attention. Every project has its own section with detailed data views, action history, and a notes area for internal observations.

---

## The First Project — Certificates

The first real workflow being automated is the submission of certificates to a private company portal.

Currently this is done entirely by hand:
1. Someone receives certificate data
2. They manually log into a private portal
3. They manually fill out a form with the certificate details
4. They submit and hope it went through correctly

With this app:
1. Certificate data is entered into the app
2. The owner receives a WhatsApp message: *"New certificate ready — reply YES to submit or NO to cancel"*
3. The owner replies YES
4. The app automatically logs into the portal, fills the form, and submits it
5. A screenshot of the confirmation page is sent back via WhatsApp
6. The submission is logged in the system with a full audit trail

This is the proof of concept that the platform works. Once this is running, the same pattern — enter data, approve, automate, confirm — will be applied to every other project in the business.

---

## What Gets Built Over Time

The platform is built in stages. Each stage adds a layer of capability on top of the last.

**Stage 1 — The Shell**
The visual foundation of the app. Navigation, layout, theme, structure. No logic yet — just the skeleton of the platform so the owner can see and feel how it will work before committing to full development.

**Stage 2 — Auth & Database**
Google login so only the owner can access the app. Firestore database connected and live. Notes can be saved and loaded. The app becomes a real, persistent tool.

**Stage 3 — First Automation (Certificates)**
The Playwright automation for certificate submission. Twilio WhatsApp integration. The full approval flow. The first real business problem is solved end to end.

**Stage 4 — Dashboard & Reporting**
Real charts, KPIs, and data views across all projects. The dashboard becomes a live control panel for the entire business.

**Stage 5+ — More Projects**
Each additional project in the business gets its own section in the app, its own data structure, and its own automations — all following the same proven pattern.

---

## Who Uses This

This application has a single user — the business owner. It is a private internal tool, not a public product. Authentication is handled via Google login and access is restricted to one account.

The owner interacts with the app in two ways:
- **In the browser** — viewing data, entering information, checking statuses, reading notes
- **On WhatsApp** — receiving notifications and approving or cancelling automated actions

---

## Design Philosophy

The app should feel like a **professional internal tool** — clean, fast, and purposeful. Not flashy, not overcomplicated. Every screen exists for a reason. Every click should save time compared to the manual process it replaces.

It supports both **light and dark mode** and works on both **desktop and mobile**, because the owner may need to check something or approve an action from anywhere.

The interface uses a **VS Code-style sidebar navigation** — a folder tree that gives instant access to every project and every page within it, always visible, always clear.

---

## The Measure of Success

This platform succeeds when:
- The owner stops touching Excel entirely
- Manual data entry into external portals drops to zero
- Every automated action has an approval step and a confirmation trail
- The owner can open the app at any moment and immediately understand the status of everything
- Time previously spent on repetitive tasks is freed up for actual business decisions

---

*Project Vision v1.0*
*The data fields, form structures, and specific automations for each project will be defined per-project as the client provides requirements*
