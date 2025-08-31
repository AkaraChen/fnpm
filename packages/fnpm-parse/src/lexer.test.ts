import { describe, expect, it } from 'vitest';
import { AtSign, Lexer, Segment, Slash } from './lexer';

describe('Lexer', () => {
    // Helper function to check if a token is a Segment with the expected value
    function expectSegment(token: Segment, value: string) {
        expect(token).toBeInstanceOf(Segment);
        expect(token.value).toBe(value);
    }

    it('should tokenize a simple package name', () => {
        const lexer = new Lexer('lodash');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(1);
        expectSegment(tokens[0], 'lodash');
    });

    it('should tokenize a scoped package', () => {
        const lexer = new Lexer('@types/react');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(4);
        expect(tokens[0]).toBeInstanceOf(AtSign);
        expectSegment(tokens[1], 'types');
        expect(tokens[2]).toBeInstanceOf(Slash);
        expectSegment(tokens[3], 'react');
    });

    it('should tokenize a package with version', () => {
        const lexer = new Lexer('react@17.0.2');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(3);
        expectSegment(tokens[0], 'react');
        expect(tokens[1]).toBeInstanceOf(AtSign);
        expectSegment(tokens[2], '17.0.2');
    });

    it('should tokenize a scoped package with version', () => {
        const lexer = new Lexer('@types/react@17.0.0');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(6);
        expect(tokens[0]).toBeInstanceOf(AtSign);
        expectSegment(tokens[1], 'types');
        expect(tokens[2]).toBeInstanceOf(Slash);
        expectSegment(tokens[3], 'react');
        expect(tokens[4]).toBeInstanceOf(AtSign);
        expectSegment(tokens[5], '17.0.0');
    });

    it('should tokenize a package with path', () => {
        const lexer = new Lexer('lodash/fp');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(3);
        expectSegment(tokens[0], 'lodash');
        expect(tokens[1]).toBeInstanceOf(Slash);
        expectSegment(tokens[2], 'fp');
    });

    it('should tokenize a package with version and path', () => {
        const lexer = new Lexer('react@17.0.2/jsx-runtime');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(5);
        expectSegment(tokens[0], 'react');
        expect(tokens[1]).toBeInstanceOf(AtSign);
        expectSegment(tokens[2], '17.0.2');
        expect(tokens[3]).toBeInstanceOf(Slash);
        expectSegment(tokens[4], 'jsx-runtime');
    });

    it('should tokenize a scoped package with version and path', () => {
        const lexer = new Lexer('@babel/core@7.15.0/lib/transform');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(10);
        expect(tokens[0]).toBeInstanceOf(AtSign);
        expectSegment(tokens[1], 'babel');
        expect(tokens[2]).toBeInstanceOf(Slash);
        expectSegment(tokens[3], 'core');
        expect(tokens[4]).toBeInstanceOf(AtSign);
        expectSegment(tokens[5], '7.15.0');
        expect(tokens[6]).toBeInstanceOf(Slash);
        expectSegment(tokens[7], 'lib');
        expect(tokens[8]).toBeInstanceOf(Slash);
        expectSegment(tokens[9], 'transform');
    });

    it('should handle file extensions correctly', () => {
        const lexer = new Lexer('react/dist/react.production.min.js');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(5);
        expectSegment(tokens[0], 'react');
        expect(tokens[1]).toBeInstanceOf(Slash);
        expectSegment(tokens[2], 'dist');
        expect(tokens[3]).toBeInstanceOf(Slash);
        expectSegment(tokens[4], 'react.production.min.js');
    });

    it('should handle empty string', () => {
        const lexer = new Lexer('');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(0);
    });

    it('should handle special characters in package names', () => {
        const lexer = new Lexer('jquery-ui@1.12.1');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(3);
        expectSegment(tokens[0], 'jquery-ui');
        expect(tokens[1]).toBeInstanceOf(AtSign);
        expectSegment(tokens[2], '1.12.1');
    });

    it('should handle multiple consecutive special characters', () => {
        const lexer = new Lexer('@/test');
        const tokens = lexer.lex();

        expect(tokens.length).toBe(3);
        expect(tokens[0]).toBeInstanceOf(AtSign);
        expect(tokens[1]).toBeInstanceOf(Slash);
        expectSegment(tokens[2], 'test');
    });
});
