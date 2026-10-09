# Barter - Auction House Platform

<p align="center">
  <img src="public/img/logos/logo_full_circle.png" alt="Barter Logo" width="180" />
</p>

## Project Documentation: Barter Auction House

### Contents:

<details>
  <summary>Table of Contents</summary>
  
  [1. Project Overview](#1-project-overview)

- [Project Links](#project-links)
- [Brand Story](#brand-story)

[2. Assignment Specifics](#2-assignment-specifics)

[3. Setup & Installation](#3-setup--installation)

[4. User](#4-user)

- [Login User](#login-user)
- [Creating Your Own User](#creating-your-own-user)

[5. Technologies Used](#5-technologies-used)

[6. Folder Structure](#6-folder-structure)

[7. Features](#7-features)

[8. Accessibility and SEO](#8-accessibility--seo)

[9. Known Issues & Limitations](#9-known-issues--limitations)

[10. Development History](#10-development-history)

[11. Credits](#11-credits)

[12. Contact](#12-contact)

</details>

---

## 1. Project Overview

Barter is a modern, responsive auction house platform built as part of the Semester Project 2 assignment at NOROFF. The platform allows users to create listings, place bids, manage their profiles, and participate in auctions using a credit-based system.

The project was later refined for the POR2 portfolio assignment, with a focus on visual polish, responsive behavior, accessibility, and clearer user feedback.

### Brand Story

**Barter** represents the ancient practice of exchanging goods and services without using money. In our digital auction house, users receive credits to bid on items, creating a modern trading platform where value is determined by community interest and competition.

### Project Links:

- GitHub Repo: [https://github.com/larstp/semesterproject2](https://github.com/larstp/semesterproject2)
- Hosting: Vercel

---

## 2. Assignment Specifics

### Semester Project 2

Barter was created for the NOROFF Semester Project 2 assignment. The brief required a student-only auction application integrated with the Noroff Auction House API. Visitors should be able to browse and search listings, while registered users should be able to manage profiles, create listings, and participate in bidding with virtual credits.

The project demonstrates:

- Vanilla JavaScript and DOM manipulation without a front-end framework.
- REST API integration with the Noroff v2 Auction House API.
- User registration and authentication using `@stud.noroff.no` email addresses.
- Listing creation, editing, deletion, browsing, searching, and filtering.
- Profile management, credits, bidding, and bid history.
- Responsive and accessible interfaces for desktop and mobile users.
- Tailwind CSS for utility-based styling.

### POR2

The POR2 assignment focused on improving selected previous projects so they could be presented professionally in a portfolio. For Barter, this included addressing lecturer feedback, improving maintainability, refining responsive behavior, adding a user-controlled dark mode, and polishing the visual presentation.

POR2 improvements include:

- Added persistent light/dark mode with a header toggle and theme-aware logos.
- Added responsive login icons, improved mobile controls, and removed the navigation flash during theme changes.
- Added Cabinet Grotesk typography to Home and Listings headings.
- Added clearer Home page copy, highest-bid information, auction section subheadings, and a logged-out signup marquee.
- Improved dark-mode form controls, labels, footer styling, profile avatars, and hover states.
- Added password visibility controls and confirm-password validation to registration.
- Improved Current Bids winner/outbid indicators and mobile bid-form layout.
- Improved mobile spacing and responsive presentation throughout the application.

---

## 3. Setup & Installation

### Prerequisites

- Node.js and npm installed

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development mode with Tailwind watch:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Open `index.html` in your browser using Live Server.

Vercel uses `npm run build` automatically and serves the project root. The
deployment configuration is stored in `vercel.json`.

---

## 4. User

### Login User:

You can create a test user or use an existing account.

### Creating Your Own User:

<table>
  <tr>
    <th>E-Mail</th>
    <th>Username</th>
    <th>Password</th>
  </tr>
  <tr>
    <td>Must be a valid email ending in @stud.noroff.no</td>
    <td>Letters, numbers, and underscores only</td>
    <td>Minimum 8 characters</td>
  </tr>
</table>

**Starting Credits:** All new users receive 1000 credits to start bidding!

---

## 5. Technologies Used

- **HTML5** - Semantic markup with comprehensive form validation
- **Tailwind CSS** - Utility-first CSS framework with custom color palette
- **JavaScript ES6+** - Modules
- **Vercel** - Hosting and deployment
- **Flowbite Icons and Lucide Icons** - SVG icon libraries
- **Cabinet Grotesk** - Variable display font used for Home and Listings headings
- **npm** - Package management and build scripts

---

## 6. Folder Structure

```
/
├── public/
│   ├── favicon/        # Favicon files
│   ├── icons/          # SVG icons (Flowbite)
│   └── img/            # Static images and graphics
├── src/
│   ├── css/
│   │   ├── global/     # Global styles
│   │   ├── tailwind.input.css # Tailwind source file
│   │   ├── tailwind.css       # Generated Tailwind output
│   │   └── global/            # Global styles and theme rules
│   ├── js/
│   │   ├── api/        # API integration (auth, listings, bids, profile)
│   │   ├── components/ # Reusable components (header, footer, cards, etc.)
│   │   ├── pages/      # Page-specific scripts
│   │   └── utils/      # Utility functions (storage, helpers, constants)
│   └── pages/          # HTML pages
├── documentation/      # Assignment docs (to make my life easier)
├── index.html          # Landing page
├── package.json        # npm scripts and dependencies
├── tailwind.config.js  # Tailwind configuration
└── README.md
```

---

## 7. Features

### Core Functionality:

- **User Authentication** - Register, login, logout with validation
- **Landing Page** - Hero section featuring listing ending soonest, popular auctions, recently added
- **Browse Listings** - Paginated auction listings with search and filter by tags
- **Sort Listings** - Sort by newest, oldest, ending soon, or most bids
- **Create Listings** - Post items with title, description, media gallery, tags, and end date
- **Edit/Delete Listings** - Owner-only controls with confirmation
- **Place Bids** - Real-time bidding with credit validation
- **Bid History** - View all bids on each listing with timestamps
- **User Profiles** - View own and others' profiles with avatar, banner, bio
- **Edit Profile** - Update avatar, banner, and bio
- **Profile Dashboard** - Tabs for user's listings, won auctions, and current bids
- **Credits System** - Track available credits, earn from winning bids
- **Search Functionality** - Search listings by title or description
- **Individual Listing Pages** - Detailed view with image gallery, seller info, bidding form

### UI/UX Features:

- **Fully Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Custom Color Palette** - blue-slate, cool-steel, celadon, dust-grey, petal-frost
- **Interactive Elements** - Hover effects, transitions, icon swaps
- **Pagination Controls** - Arrow icon navigation with hover states
- **Loading Indicators** - Async operation feedback
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation on all input fields
- **Mobile Navigation** - Bottom navbar for mobile devices
- **Desktop Header** - Full navigation with search and user menu

### Smart Features:

- **Won Auctions Detection** - Shows ended auctions while API processes wins
- **Bid Status Indicators** - Visual feedback for winning/losing bids
- **Expired Listings** - Visual distinction for ended auctions
- **Back Navigation** - Consistent back buttons with hover effects
- **Seller Protection** - Users cannot bid on their own listings

---

## 8. Accessibility & SEO

### Accessibility:

- Semantic HTML structure (`header`, `nav`, `main`, `section`, `footer`)
- ARIA labels and roles on all interactive elements
- Alt text on all images with fallbacks
- Keyboard navigation support
- Color contrast meets WCAG standards
- Focus states on all interactive elements
- Screen reader friendly form labels and error messages

### SEO:

- Comprehensive meta tags on all pages
- Descriptive page titles
- Semantic heading hierarchy
- Optimized images with proper alt text
- Clean URL structure

---

## 9. Known Issues / Limitations

- **Wins API Delay** - API can take hours to process won auctions, client-side logic displays ended auctions immediately
- **Bid Count Sorting** - API doesn't support sorting by bid count, handled client-side with limited dataset
- **Image Uploads** - Requires external URLs (no direct file uploads)
- **Single Tag Filter** - Filter by one tag at a time
- **No Real-time Updates** - Manual refresh needed to see new bids from other users

---

## 10. Development History

The project has been developed in stages as part of the NOROFF School of Technology and Digital Media coursework:

### Semester Project 2

- Front-end development with vanilla JavaScript.
- API integration with the Noroff Auction House API.
- User authentication and authorization.
- Listing CRUD operations, bidding, and auction countdowns.
- Responsive design, form validation, and error handling.

### POR2

- Visual refinement for portfolio presentation.
- User-controlled dark mode and theme-aware assets.
- Improved responsive forms, navigation, typography, copy, and auction status feedback.

Further lecturer-feedback refactoring is being maintained separately on the `feedback-fixes` branch and is not part of the POR2 hand-in branch.

---

## 11. Credits

### Icons:

- [Flowbite Icons](https://flowbite.com/icons/) - SVG icon library (MIT License)

### Fonts:

- [Montserrat](https://fonts.google.com/specimen/Montserrat) - Display font
- [Roboto](https://fonts.google.com/specimen/Roboto) - Body font
- Cabinet Grotesk - Variable heading font used on Home and Listings

### Tools & Resources:

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [GitHub Copilot](https://github.com/features/copilot) - AI coding assistant for help with math and debugging
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript and Web API references
- [Noroff API Documentation](https://docs.noroff.dev/docs/v2) - API reference

### Images:

- Placeholder images from [Unsplash](https://unsplash.com) - Free to use under the Unsplash License
- Custom graphics and logos created for the project

---

## 12. Contact

- **Author**: [larstp](https://github.com/larstp)
- **Course**: Semester Project 2 - NOROFF School of Technology and Digital Media
- **Year**: 2025/2026 Year 2
