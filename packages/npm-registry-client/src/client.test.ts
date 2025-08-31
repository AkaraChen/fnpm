import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';

describe('createApiClient', () => {
    it('should create a client', async () => {
        const mockFetch = vi.fn();
        const options = {
            baseUrl: 'https://test.com',
            fetch: mockFetch,
        };
        const client = createApiClient(options);
        try {
            // @ts-expect-error: This is a test for an invalid GET call
            await client.GET('/test-url');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
        expect(mockFetch).toHaveBeenCalledOnce();
    });

    it('should merge options with new options', async () => {
        const mockFetch = vi.fn();
        const options = {
            baseUrl: 'https://test.com',
            fetch: mockFetch,
        };
        const client = createApiClient(options);
        const client2 = client.with({
            baseUrl: 'https://test2.com',
            fetch: () => {
                return mockFetch(1);
            },
        });
        try {
            // @ts-expect-error: This is a test for an invalid GET call with merged options
            await client2.GET('/test-url');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
        expect(mockFetch).toHaveBeenCalledWith(1);
    });
});
