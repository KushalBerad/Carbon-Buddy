import { describe, expect, it } from 'vitest';
import { useUserStore } from '../store/userStore';

describe('User Store', () => {
    it('store should exist', () => {
        expect(useUserStore).toBeDefined();
    });

    it('should have current view state', () => {
        expect(useUserStore.getState().currentView).toBeDefined();
    });

    it('should expose sidebar state', () => {
        expect(typeof useUserStore.getState().sidebarOpen).toBe('boolean');
    });
});