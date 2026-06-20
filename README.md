# Carbon Buddy 🌱

Carbon Buddy is a full-stack AI-powered sustainability application designed to help individuals understand, track, and reduce their carbon footprint through practical daily actions, personalized AI insights, and long-term behavioral motivation.

The platform transforms sustainable living into a simple habit-building system by rewarding environmentally conscious behavior without requiring invasive personal data collection or unrealistic lifestyle changes.

Built as a solution for **Challenge 3: Carbon Footprint Reduction & Sustainable Living**.

---

## Problem Statement

Most individuals contribute to carbon emissions every day without understanding how their daily habits impact the environment.

Existing carbon footprint tracking applications often fail because they:

* Require excessive manual data entry
* Depend on privacy-invasive financial or behavioral tracking
* Suggest unrealistic lifestyle changes
* Lack long-term user engagement mechanisms
* Provide little emotional motivation for continued sustainable behavior

Carbon Buddy solves this by making sustainability practical, personalized, and rewarding.

---

## Solution Approach

Carbon Buddy focuses on one simple principle:

**Small daily improvements create long-term environmental impact.**

Instead of forcing users to radically change their lifestyle, the application encourages gradual sustainable behavior through:

* Daily eco-friendly habit tracking
* AI-powered sustainability recommendations
* Personalized weekly behavior analysis
* Emotional reward-based engagement systems
* Practical low-carbon lifestyle alternatives

The goal is to make sustainable living feel effortless rather than stressful.

---

# Core Features

## 1. Habit-Based Carbon Score

Users complete simple sustainable daily habits such as:

* Using public transport
* Walking or biking instead of short rides
* Saving electricity
* Conserving water
* Reducing household waste

Each completed action contributes to reducing the user's carbon footprint while increasing sustainability progress.

---

## 2. AI Sustainability Coach

Integrated with Google Gemini API.

Users can ask sustainability-related questions such as:

* How can I reduce my carbon footprint?
* Better commuting alternatives?
* Ways to save energy at home?
* Sustainable lifestyle suggestions?

Implemented with intelligent invalid-input detection to prevent AI hallucinations on nonsensical user queries.

Example invalid input:

```text
akjsdhasjdh
```

AI safely responds with guided suggestion prompts instead of generating false answers.

---

## 3. Weekly Lifestyle Reflection

AI analyzes weekly user behavior and generates personalized sustainability reports.

The reflection engine provides:

* Weekly sustainability progress summary
* Behavioral improvement suggestions
* Personalized recommendations for the upcoming week
* Sustainability performance insights

This allows users to continuously improve their lifestyle patterns.

---

## 4. Carbon → Health → Money Dashboard

The central dashboard visualizes real-world impact metrics.

Tracks:

* Estimated carbon footprint reduction
* Money saved through sustainable choices
* Healthier lifestyle improvements
* Sustainability progress analytics
* Environmental impact summaries

This helps users understand the direct benefits of their actions.

---

## 5. Eco Finder

Location-aware sustainable recommendation system.

Provides eco-friendly alternatives such as:

* Public transport suggestions
* EV charging station discovery
* Nearby sustainable lifestyle options
* Practical location-based recommendations

Designed to encourage real-world sustainable decisions.

---

## 6. Green Streak System

Behavioral consistency tracking engine.

Rewards users for maintaining sustainable habits.

Tracks:

* Daily sustainability streaks
* Achievement badges
* Habit consistency
* Progressive milestone rewards

Encourages long-term user engagement.

---

## 7. AI Eco Meal Alternatives

Google Gemini suggests healthier low-emission food alternatives.

Examples:

* Beef → Lentil Burger
* Dairy Milk → Plant-Based Alternatives
* Processed Foods → Sustainable Protein Sources

Benefits:

* Lower carbon emissions
* Better dietary health
* Lower environmental impact

Users improve both health and sustainability simultaneously.

---

## 8. Earth Bloom Emotional Reward System 🌳

The emotional engagement engine of Carbon Buddy.

Every sustainable action contributes to growing a virtual ecosystem.

Growth progression stages:

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

The system creates emotional motivation and positive behavioral reinforcement.

Instead of abstract carbon metrics, users visually experience their environmental impact.

---

# Tech Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS v4
* Motion / Framer Motion

## State Management

* Zustand
* Zustand Persist Middleware
* Browser localStorage Persistence

## Backend

* Node.js
* Express.js

## AI Integration

* Google Gemini API
* Google AI Studio

---

# System Architecture

The application follows a modular full-stack architecture.

## Frontend Layer

React-based user interface consisting of:

* Dashboard
* Daily Habits
* AI Coach
* Weekly Reflection
* AI Meal Suggestions
* Eco Finder
* Earth Bloom
* Achievements
* Settings

---

## State Layer

State management powered by Zustand stores.

Stores:

* userStore
* habitStore
* chatStore
* mealStore
* reflectionStore
* bloomStore

Provides:

* Atomic state management
* Persistent browser storage
* Minimal rerenders
* Better performance isolation

---

## Backend Layer

Express.js API server.

Endpoints:

```text
/api/gemini/chat
/api/gemini/reflection
/api/gemini/meal
```

Responsibilities:

* Secure Gemini API proxying
* AI request handling
* Prompt sanitization
* Input validation
* JSON schema validation

---

## AI Layer

Google Gemini API handles:

* Sustainability coaching
* Meal alternative generation
* Weekly reflection analytics
* Personalized recommendation generation

---

# Engineering Improvements Implemented

The application architecture was significantly optimized during development.

Major engineering improvements include:

* Refactored monolithic App.tsx architecture into modular Zustand stores
* Reduced App.tsx from 475+ lines into lightweight routing architecture
* Eliminated unnecessary global rerenders
* Implemented localStorage persistent state management
* Added React.lazy code splitting for faster initial load
* Implemented React.memo page optimization
* Added responsive mobile drawer navigation system
* Fixed Tailwind CSS v4 dark mode runtime bug
* Added interactive notification center
* Added AI invalid-input detection layer
* Improved mobile responsiveness across viewport sizes
* Reduced unnecessary component re-renders using memoization
* Optimized expensive calculations using computed caching

---

# Security Considerations

Security-focused design choices:

* Gemini API secured behind Express backend proxy
* API key stored in environment variables
* No sensitive user data collection
* No bank account or financial data access
* No privacy-invasive behavioral tracking
* AI input validation prevents malformed prompt abuse
* Protected against unnecessary frontend API exposure

---

# Performance Optimizations

Implemented optimizations include:

* Zustand atomic store architecture
* Persistent local storage caching
* Lazy-loaded route splitting
* React.memo optimization
* Reduced unnecessary rerenders
* Memoized expensive calculations
* Mobile responsive rendering optimization
* Tailwind CSS dark mode optimization
* Framer Motion animation optimization

---

# Local Development Setup

## Prerequisites

Install:

* Node.js

---

## Installation

Install dependencies

```bash
npm install
```

Create environment file

```bash
.env.local
```

Add Gemini API key

```env
GEMINI_API_KEY=your_api_key_here
```

Run development server

```bash
npm run dev
```

Open application

```text
http://localhost:3000
```

---

# Project Structure

```text
src/

components/
 ├── Navbar
 ├── Sidebar
 ├── ThemeProvider
 ├── ThemeSwitcher
 ├── AchievementBadge
 ├── ProgressRing
 └── Shared UI Components

pages/
 ├── DashboardPage
 ├── DailyHabitsPage
 ├── AICoachPage
 ├── WeeklyReflectionPage
 ├── MealSuggestionPage
 ├── EcoFinderPage
 ├── EarthBloomPage
 ├── SettingsPage
 └── StreakSystemPage

store/
 ├── userStore
 ├── habitStore
 ├── chatStore
 ├── mealStore
 ├── reflectionStore
 └── bloomStore
```

---

# Design Philosophy

Carbon Buddy was designed around one principle:

**Reducing carbon footprint should not require invasive tracking, unrealistic lifestyle changes, or complicated manual data entry.**

The platform focuses on practical small improvements that gradually help users build sustainable habits.

The objective is behavioral change through positive reinforcement rather than forcing users into dramatic lifestyle modifications.

---

# Deployment

Application can be deployed using:

* Render
* Railway
* Vercel (with backend adaptation)

Environment Variable Required:

```env
GEMINI_API_KEY=your_api_key
```

---

# Why Carbon Buddy Is Different

Unlike traditional carbon tracking applications:

* No bank statement integration
* No privacy-invasive data collection
* No forcing unrealistic lifestyle changes
* No complex manual carbon calculations
* Focuses on practical habit-based improvement
* Uses emotional motivation through Earth Bloom ecosystem

Small daily improvements create measurable environmental impact.

---

Built to make sustainability practical, intelligent, and rewarding. 🌍
