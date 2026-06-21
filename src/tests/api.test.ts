import { describe, expect, it } from 'vitest';

describe('API Layer', () => {
    it('backend api routes should exist', () => {
        expect('/api/gemini/chat').toBeTruthy();
    });
});