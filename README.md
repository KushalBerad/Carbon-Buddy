# Carbon Buddy 🌱

An AI-powered sustainable lifestyle companion that helps individuals understand, track, and reduce their carbon footprint through simple daily actions, personalized insights, and behavioral motivation.

Built for solving real-world sustainability challenges by making eco-friendly living practical, engaging, and rewarding.

---

## Problem Statement

Most people contribute to carbon emissions every day without understanding their environmental impact.

Existing carbon footprint applications often fail because they:

- Require too much manual input
- Depend on privacy-invasive data collection
- Offer poor long-term engagement
- Do not provide practical lifestyle recommendations

Carbon Buddy solves this by turning sustainability into an interactive daily habit system.

---

## Core Features

### 1. Habit-Based Carbon Score

Users complete simple sustainable daily habits such as:

- Using public transport
- Saving electricity
- Conserving water
- Reducing waste

Each action contributes to reducing carbon footprint.

---

### 2. AI Sustainability Coach

Integrated with Google Gemini API.

Users can ask questions like:

- How can I reduce my carbon footprint?
- Better commuting alternatives?
- Energy saving tips?
- Sustainable lifestyle suggestions?

Includes invalid input detection to prevent AI hallucinations.

---

### 3. Weekly Lifestyle Reflection

AI analyzes weekly user behavior and provides:

- Sustainability progress summary
- Personalized improvement suggestions
- Weekly eco-performance insights

---

### 4. Carbon → Health → Money Dashboard

Tracks real-world impact through:

- Carbon saved
- Money saved
- Healthier lifestyle improvements
- Sustainability metrics

---

### 5. Eco Finder

Location-aware sustainable recommendations.

Examples:

- EV charging stations
- Public transport suggestions
- Nearby eco-friendly options

---

### 6. Green Streak System

Rewards consistent sustainable behavior.

Tracks:

- Daily streaks
- Achievement badges
- Progress milestones

---

### 7. AI Eco Meal Alternatives

Google Gemini suggests healthier low-emission food alternatives.

Example:

- Beef → Lentil Burger
- Dairy → Plant-based alternatives

Users improve both health and sustainability.

---

### 8. Earth Bloom Emotional Reward System 🌳

The emotional engagement engine.

Every sustainable action contributes to growing a virtual ecosystem.

Progression stages:

- Seed
- Sprout
- Young Plant
- Blooming Tree
- Thriving Forest

This creates long-term behavioral motivation.

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Zustand State Management

### Backend

- Express.js
- Node.js

### AI Integration

- Google Gemini API
- Google AI Studio

### Persistence

- Browser localStorage
- Zustand Persist Middleware

---

## Architecture Overview

System architecture contains:

Frontend Layer

- Dashboard
- Daily Habits
- AI Coach
- Weekly Reflection
- AI Meal Suggestions
- Eco Finder
- Earth Bloom
- Achievements
- Settings

Backend Layer

- Express Server
- Gemini API Proxy
- Input Validation Layer
- AI Prompt Sanitization

Data Layer

- localStorage persistence
- Zustand stores

---

## Local Setup

### Prerequisites

- Node.js installed

### Installation

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

Run project

```bash
npm run dev
```

Open browser

```bash
http://localhost:3000
```

---

## Performance Optimizations Implemented

- Zustand atomic state management
- React.memo optimization
- React.lazy code splitting
- localStorage persistence
- Mobile responsive drawer navigation
- Tailwind dark mode optimization
- Framer Motion animation optimization
- Memoized expensive calculations
- Reduced unnecessary rerenders

---

## Why Carbon Buddy Works

Unlike traditional carbon tracking apps:

- No bank statement integration
- No privacy invasive tracking
- No forcing unrealistic lifestyle changes
- Focuses on practical daily improvements

Small actions create long-term environmental impact.

---

## Future Scope

- Deployment to cloud hosting
- Advanced sustainability analytics
- Social sustainability challenges
- Community eco leaderboards

---

Built with the goal of making sustainability simple, practical, and rewarding.