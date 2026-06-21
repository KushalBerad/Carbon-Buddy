import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App Render', () => {
    it('renders without crashing', () => {
        const app = render(<App />);
        expect(app).toBeTruthy();
    });
});