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

[2. Setup & Installation](#2-setup--installation)

[3. User](#3-user)

- [Login User](#login-user)
- [Creating Your Own User](#creating-your-own-user)

[4. Technologies Used](#4-technologies-used)

[5. Folder Structure](#5-folder-structure)

[6. Features](#6-features)

[7. Accessibility and SEO](#7-accessibility--seo)

[8. Known Issues & Limitations](#8-known-issues--limitations)

[9. Semester Project 2 Assignment](#9-semester-project-2-assignment)

[10. Credits](#10-credits)

[11. Contact](#11-contact)

</details>

---

## 1. Project Overview

Barter is a modern auction house platform built as part of the Semester Project 2 assignment at NOROFF. The platform allows users to create listings, place bids, manage their profiles, and participate in real-time auctions with a credit-based system.

### Brand Story

**Barter** represents the ancient practice of exchanging goods and services without using money. In our digital auction house, users receive credits to bid on items, creating a modern trading platform where value is determined by community interest and competition.

### Project Links:

- GitHub Repo: [https://github.com/larstp/semesterproject2](https://github.com/larstp/semesterproject2)
- Live Site: [https://larstp.github.io/Barter](https://larstp.github.io/Barter)

---

## 2. Setup & Installation

### Prerequisites

- Node.js and npm installed

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development mode (with Tailwind watch):
   ```bash
   npm run dev
   ```
4. Or build for production:
   ```bash
   npm run build
   ```
5. Open `index.html` in your browser using Live Server

---

## 3. User

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

## 4. Technologies Used

- **HTML5** - Semantic markup with comprehensive form validation
- **Tailwind CSS** - Utility-first CSS framework with custom color palette
- **JavaScript ES6+** - Modules
- **GitHub Pages** - Hosting
- **Flowbite Icons** - SVG icon library
- **npm** - Package management and build scripts

---

## 5. Folder Structure

```
/
├── public/
│   ├── favicon/        # Favicon files
│   ├── icons/          # SVG icons (Flowbite)
│   └── img/            # Static images and graphics
├── src/
│   ├── css/
│   │   ├── global/     # Global styles
│   │   ├── input.css   # Tailwind source file
│   │   └── output.css  # Generated Tailwind output
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

## 6. Features

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

## 7. Accessibility & SEO

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

## 8. Known Issues / Limitations

- **Wins API Delay** - API can take hours to process won auctions, client-side logic displays ended auctions immediately
- **Bid Count Sorting** - API doesn't support sorting by bid count, handled client-side with limited dataset
- **Image Uploads** - Requires external URLs (no direct file uploads)
- **Single Tag Filter** - Filter by one tag at a time
- **No Real-time Updates** - Manual refresh needed to see new bids from other users

---

## 9. Semester Project 2 Assignment

This project was developed as part of the Semester Project 2 at NOROFF School of Technology and Digital Media, demonstrating:

- Front-end development with vanilla JavaScript
- API integration with RESTful endpoints
- Responsive design with Tailwind CSS
- User authentication and authorization
- Complex state management
- Form validation and error handling
- CRUD operations
- Time-based functionality (auction countdowns)

---

## 10. Credits

### Icons:

- [Flowbite Icons](https://flowbite.com/icons/) - SVG icon library (MIT License)

### Fonts:

- [Montserrat](https://fonts.google.com/specimen/Montserrat) - Display font
- [Roboto](https://fonts.google.com/specimen/Roboto) - Body font

### Tools & Resources:

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [GitHub Copilot](https://github.com/features/copilot) - AI coding assistant for help with math and debugging
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript and Web API references
- [Noroff API Documentation](https://docs.noroff.dev/docs/v2) - API reference

### Images:

- Placeholder images from [Unsplash](https://unsplash.com) - Free to use under the Unsplash License
- Custom graphics and logos created for the project

---

## 11. Contact

- **Author**: [larstp](https://github.com/larstp)
- **Course**: Semester Project 2 - NOROFF School of Technology and Digital Media
- **Year**: 2025/2026 Year 2
