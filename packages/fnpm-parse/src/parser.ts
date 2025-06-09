import type { IParseResult } from './types';

type ParserStateBase = {
    state: 'none' | 'scope' | 'name' | 'version' | 'path';
    result: IParseResult;
};

type ParserStateNone = ParserStateBase & {
    state: 'none';
};

type ParserStateScope = ParserStateBase & {
    state: 'scope';
};

type ParserStateName = ParserStateBase & {
    state: 'name';
};

type ParserStateVersion = ParserStateBase & {
    state: 'version';
};

type ParserStatePath = ParserStateBase & {
    state: 'path';
};

type ParserState =
    | ParserStateNone
    | ParserStateScope
    | ParserStateName
    | ParserStateVersion
    | ParserStatePath;

class Parser {
    state: ParserState = {
        state: 'none',
        result: {
            scope: '',
            name: '',
            fullName: '',
            version: '',
            path: '',
            extension: '',
        },
    };

    parse(_str: string): IParseResult {
        throw new Error('Not implemented');
    }

    scope() {}
}

export default Parser;
