import * as yaml from '@akrc/yaml';
import { Effect } from 'effect';

class ParseError extends Error {
    override name = 'ParseError';
    __tag = 'ParseError';
    constructor(error: unknown) {
        super(error instanceof Error ? error.message : String(error));
    }
}

export function JsonParse<T>(input: string) {
    return Effect.try({
        try() {
            return JSON.parse(input) as T;
        },
        catch(error) {
            return Effect.fail(new ParseError(error));
        },
    });
}

export function YamlParse<T>(input: string) {
    return Effect.try({
        try() {
            return yaml.load(input) as T;
        },
        catch(error) {
            return Effect.fail(new ParseError(error));
        },
    });
}
