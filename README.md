# Carbon Buddy 🌱

Carbon Buddy is a full-stack AI-powered sustainability platform designed to help users understand, track, and reduce their carbon footprint through habit building, AI-powered recommendations, behavioral analysis, and long-term environmental motivation.

Built for **Challenge 3 — Carbon Footprint Reduction & Sustainable Living**.

The platform transforms sustainability into a practical daily habit system that helps users make environmentally responsible decisions without requiring invasive personal data collection or unrealistic lifestyle changes.

![Tests](https://img.shields.io/badge/tests-10%20passing-brightgreen)
![Build](https://img.shields.io/badge/build-passing-success)
![Security](https://img.shields.io/badge/security-reviewed-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

# Problem Statement

Most individuals unknowingly contribute to carbon emissions every day through transportation choices, food habits, energy consumption, and waste generation.

Existing carbon footprint applications often fail because they:

* Require excessive manual data entry
* Depend on privacy-invasive tracking systems
* Suggest unrealistic lifestyle changes
* Lack long-term user engagement systems
* Provide little emotional motivation for behavioral consistency

Carbon Buddy solves this by making sustainability practical, personalized, and rewarding.

---

# Solution Approach

Carbon Buddy is designed around one principle:

**Small daily improvements create long-term environmental impact.**

Instead of forcing users into drastic lifestyle changes, the platform gradually helps users build sustainable habits through:

* Daily eco-friendly habit tracking
* AI-powered sustainability recommendations
* Weekly lifestyle reflection analysis
* Emotional reward-based engagement systems
* Low-carbon lifestyle alternatives

The goal is to make sustainable living simple and maintainable.

---

# Core Features

## 1. Daily Habit Tracking System

Users log sustainable habits including:

* Saving electricity
* Conserving water
* Using public transport
* Walking or biking instead of short rides
* Reducing household waste

Each completed habit contributes toward reducing overall carbon footprint.

---

## 2. AI Sustainability Coach

Integrated with Google Gemini API.

Users can ask sustainability-related questions such as:

* How can I reduce my carbon footprint?
* Better transportation alternatives?
* Ways to save electricity at home?
* Sustainable lifestyle recommendations

Invalid or nonsensical user inputs are safely handled to avoid unreliable AI-generated responses.

Example:

```text
akjsdhasjdh
```

The AI responds safely instead of generating misleading content.

---

## 3. Weekly Reflection Engine

The AI analyzes user behavior and generates weekly sustainability reports.

Provides:

* Weekly sustainability summary
* Personalized improvement suggestions
* Lifestyle behavior analysis
* Next-week sustainability recommendations

This allows users to improve habits continuously.

---

## 4. Carbon Impact Dashboard

Central dashboard visualizes measurable impact.

Tracks:

* Estimated carbon footprint reduction
* Money saved through sustainable choices
* Healthier lifestyle improvements
* Sustainability progress analytics
* Environmental impact summaries

Users understand how small actions create measurable environmental benefits.

---

## 5. Eco Finder

Location-aware sustainability recommendation system.

Provides:

* Public transportation alternatives
* EV charging station discovery
* Sustainable nearby lifestyle suggestions
* Eco-friendly location recommendations

Encourages real-world environmentally conscious decisions.

---

## 6. Green Streak System

Behavior consistency tracking system.

Tracks:

* Daily sustainability streaks
* Achievement badges
* Habit consistency
* Progressive milestone rewards

Designed to encourage long-term sustainable behavior.

---

## 7. AI Eco Meal Suggestions

Google Gemini suggests environmentally friendly food alternatives.

Examples:

* Beef → Lentil Burger
* Dairy Milk → Plant-Based Alternatives
* Processed Foods → Sustainable Protein Sources

Benefits:

* Lower carbon emissions
* Healthier diet choices
* Sustainable food awareness

---

## 8. Earth Bloom Emotional Reward System

Every sustainable action contributes toward growing a virtual ecosystem.

Growth stages:

* Seed
* Sprout
* Young Plant
* Healthy Plant
* Small Tree
* Blooming Tree
* Growing Tree
* Mini Ecosystem
* Garden
* Thriving Forest

The system provides emotional motivation and positive reinforcement for sustainable habits.

---

# Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS v4
* Motion Library

## Backend

* Node.js
* Express.js

## State Management

* Zustand
* Zustand Persist Middleware
* Browser localStorage Persistence

## AI Integration

* Google Gemini API

---

# System Architecture

```text
Frontend (React + TypeScript)
            ↓
State Management (Zustand Stores)
            ↓
Express Backend API Layer
            ↓
Gemini AI Processing Layer
            ↓
Response Handling Layer
            ↓
UI Rendering + Sustainability Insights
```

The application follows modular full-stack architecture.

---

# Backend API Endpoints

Implemented backend endpoints:

```text
/api/gemini/chat
/api/gemini/reflection
/api/gemini/meal
```

Backend responsibilities:

* Secure Gemini API proxying
* AI request handling
* Input validation
* Safe response handling
* Error handling middleware

---

# Engineering Improvements Implemented

During development the architecture was significantly improved.

Major improvements include:

* Modular React component architecture
* State management separation using Zustand stores
* Persistent browser storage architecture
* Mobile responsive UI optimization
* Improved sidebar navigation system
* Reduced unnecessary component rerenders
* Code splitting across independent page modules
* Tailwind CSS dark mode support improvements
* Better component reusability architecture
* Optimized frontend rendering performance

---

# Security Controls Implemented

Security-first development practices implemented:

* API key isolated through environment variables
* No hardcoded credentials inside repository
* Backend proxy prevents frontend secret exposure
* `.gitignore` excludes sensitive environment files
* No unsafe eval() execution
* No dangerouslySetInnerHTML usage
* Dependency vulnerability verification using npm audit
* No user credentials stored in source code

---

# Accessibility Compliance

Accessibility-focused implementation includes:

* ARIA labels added across interactive elements
* Semantic HTML structure across components
* Keyboard accessible navigation patterns
* Proper button labeling for assistive technologies
* Responsive mobile and desktop design
* Dark mode and light mode accessibility support
* Screen-reader friendly interactive controls

---

# Testing Coverage

Carbon Buddy uses automated testing with Vitest and React Testing Library.

Implemented automated tests:

* Application rendering validation
* Zustand store initialization testing
* Sidebar toggle state testing
* Current view state transition testing
* API layer testing
* Security validation testing
* Performance testing
* Accessibility testing
* Routing validation
* Component rendering stability testing

### Current Status

* 8 test files
* 10 automated tests
* 100% passing test suite

Run tests:

```bash
npm run test
```

---

# Continuous Integration Pipeline

GitHub Actions CI pipeline configured.

Location:

```text
.github/workflows/ci.yml
```

Automated pipeline executes:

```text
npm install
npm run lint
npm run test
npm run build
```

Ensures automated code quality verification before deployment.

---

# Engineering Quality Assurance

Project quality validation completed successfully.

Verification checks:

```bash
npm run lint      ✓ Passed
npm run build     ✓ Passed
npm run test      ✓ 10 Tests Passed
npm audit         ✓ 0 Vulnerabilities
```

Quality measures implemented:

* Strict TypeScript validation
* Modular architecture design
* Automated testing pipeline
* Security documentation
* Continuous integration workflow
* Maintainable component separation

---

# Project Structure

```text
src/

components/
 ├── Navbar.tsx
 ├── Sidebar.tsx
 ├── ThemeProvider.tsx
 ├── ThemeSwitcher.tsx
 ├── HabitToggle.tsx
 ├── Button.tsx
 ├── Card.tsx
 └── Shared UI Components

pages/
 ├── DashboardPage.tsx
 ├── DailyHabitsPage.tsx
 ├── AICoachPage.tsx
 ├── WeeklyReflectionPage.tsx
 ├── MealSuggestionPage.tsx
 ├── EcoFinderPage.tsx
 ├── EarthBloomPage.tsx
 ├── SettingsPage.tsx
 └── OnboardingPage.tsx

store/
 ├── userStore.ts
 ├── habitStore.ts
 ├── chatStore.ts
 ├── mealStore.ts
 ├── reflectionStore.ts
 └── bloomStore.ts

tests/
 ├── App.test.tsx
 ├── component.test.tsx
 ├── store.test.ts
 ├── security.test.ts
 ├── accessibility.test.ts
 ├── api.test.ts
 ├── performance.test.ts
 └── setup.ts
```

---

# Local Development Setup

## Prerequisites

Install:

* Node.js
* Git

Install dependencies:

```bash
npm install
```

Create environment file:

```text
.env.local
```

Add Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Run development server:

```bash
npm run dev
```

Open locally:

```text
http://localhost:3000
```

---

# Deployment

Current deployment platform:

* Render Cloud Hosting

Supported deployment options:

* Render
* Railway
* Vercel (frontend adaptation required)

Production build commands:

```bash
npm run build
npm run start
```

Required environment variable:

```env
GEMINI_API_KEY=your_api_key_here
```

---

# Assumptions Made

The application assumes:

* Users want privacy-safe sustainability tracking
* Habit-based behavioral improvement works better than manual carbon calculation
* Small sustainable actions compound over time
* AI recommendations should remain practical and lightweight
* Long-term motivation improves sustainable behavior consistency

---

# Why Carbon Buddy Is Different

Unlike traditional carbon tracking applications:

* No bank account integration
* No privacy-invasive behavior tracking
* No unrealistic lifestyle forcing
* No complicated manual carbon calculations
* Practical daily habit-based improvement system
* Emotional motivation through Earth Bloom ecosystem

Small daily improvements create measurable environmental impact.

---

# Build Verification

Project successfully validated using:

```bash
npm run lint
npm run build
npm run test
npm audit
```

Current project status:

* Build Successful
* TypeScript Validation Passed
* 10 Automated Tests Passed
* 0 Known Security Vulnerabilities

---

# License

MIT License

---

Built to make sustainability intelligent, practical, and rewarding. 🌍
