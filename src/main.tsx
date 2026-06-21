/**
 * Carbon Buddy Application Bootstrap
 *
 * Initializes the React application root and mounts the
 * AI-powered sustainability platform responsible for:
 *
 * - Carbon footprint awareness tracking
 * - Sustainable lifestyle recommendations
 * - Eco habit monitoring
 * - Intelligent climate-conscious user guidance
 *
 * Entry layer optimized for maintainability and production deployment.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Root DOM container validation
 * Ensures predictable application mounting behavior.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Carbon Buddy failed to initialize root container.');
}

/**
 * React application bootstrap initialization.
 */
const carbonBuddyRoot = createRoot(rootElement);

carbonBuddyRoot.render(
  <StrictMode>
    <App />
  </StrictMode>
);