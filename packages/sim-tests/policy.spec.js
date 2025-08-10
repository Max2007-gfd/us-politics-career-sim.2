import { describe, it, expect } from 'vitest';
import * as Core from '@usp/core';
describe('policy', () => {
    it('drafting logs result', () => {
        let s = Core.createInitialState();
        const beforeLen = s.log.length;
        s = Core.draftPolicy(s, s.issues[0].id, s.issues[0].instruments[0]);
        expect(s.log.length).toBe(beforeLen + 1);
    });
});
