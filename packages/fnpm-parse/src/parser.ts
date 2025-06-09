import { AtSign, Lexer, Segment, Slash, type Token } from './lexer';
import type { IParseResult } from './types';

enum ParserFsmState {
    START = 0,
    EXPECT_SCOPE_SEGMENT = 1, // After @
    EXPECT_SLASH_AFTER_SCOPE = 2, // After @scope_segment
    EXPECT_NAME_SEGMENT_FOR_SCOPE = 3, // After @scope_segment/
    NAME_FOUND = 4, // Name is parsed, scope might be too
    EXPECT_VERSION_SEGMENT = 5, // After ...name@
    EXPECT_PATH_OR_END_AFTER_VERSION = 6, // After ...name@version
    PATH_PARSING = 7, // Consuming path segments, starts after the first path slash
    END = 8,
    ERROR = 9,
}

class Parser {
    private tokens: Token[] = [];
    private currentIndex = 0;
    private result: IParseResult = {
        name: '',
        fullName: '',
        scope: undefined,
        version: undefined,
        path: undefined,
        extension: undefined,
    };
    private state: ParserFsmState = ParserFsmState.START;
    private pathBuffer: string[] = [];

    private currentToken(): Token | undefined {
        return this.tokens[this.currentIndex];
    }

    private consumeToken(): Token | undefined {
        const token = this.currentToken();
        if (token) {
            this.currentIndex++;
        }
        return token;
    }

    private getExtension(filePath: string | undefined): string | undefined {
        if (!filePath) return undefined;
        const lastSlash = filePath.lastIndexOf('/');
        const fileName =
            lastSlash === -1 ? filePath : filePath.substring(lastSlash + 1);
        if (fileName) {
            const lastDot = fileName.lastIndexOf('.');
            if (lastDot > 0 && lastDot < fileName.length - 1) {
                // dot not first char, and has chars after
                return fileName.substring(lastDot + 1);
            }
        }
        return undefined;
    }

    public parse(str: string): IParseResult {
        this.tokens = new Lexer(str).lex();
        this.currentIndex = 0;
        this.result = { name: '', fullName: '' }; // Reset for multiple calls on same instance
        this.state = ParserFsmState.START;
        this.pathBuffer = [];

        if (this.tokens.length === 0) {
            // If input string was also empty, this is fine. Otherwise, it's an unparseable string.
            return this.result;
        }

        while (
            this.state !== ParserFsmState.END &&
            this.state !== ParserFsmState.ERROR
        ) {
            const token = this.currentToken();

            if (!token) {
                // No more tokens
                switch (this.state) {
                    case ParserFsmState.START: // Empty string or string that lexed to nothing
                    case ParserFsmState.NAME_FOUND:
                    case ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION:
                    case ParserFsmState.PATH_PARSING: // Path parsing naturally ends when tokens run out
                        this.state = ParserFsmState.END;
                        break;
                    default: // Premature end of input for the current state
                        this.state = ParserFsmState.ERROR;
                        break;
                }
                continue;
            }

            switch (this.state) {
                case ParserFsmState.START:
                    if (token instanceof AtSign) {
                        this.consumeToken();
                        this.state = ParserFsmState.EXPECT_SCOPE_SEGMENT;
                    } else if (token instanceof Segment) {
                        this.result.name = token.value;
                        this.result.fullName = token.value;
                        this.consumeToken();
                        this.state = ParserFsmState.NAME_FOUND;
                    } else {
                        // e.g. starts with / or other unexpected token
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.EXPECT_SCOPE_SEGMENT: // After @
                    if (token instanceof Segment) {
                        this.result.scope = token.value;
                        this.consumeToken();
                        this.state = ParserFsmState.EXPECT_SLASH_AFTER_SCOPE;
                    } else {
                        // @ not followed by segment (e.g. @/ or @@ or @ at end)
                        this.state = ParserFsmState.ERROR; // Invalid scope formation
                    }
                    break;

                case ParserFsmState.EXPECT_SLASH_AFTER_SCOPE: // After @scope_val
                    if (token instanceof Slash) {
                        this.consumeToken();
                        this.state =
                            ParserFsmState.EXPECT_NAME_SEGMENT_FOR_SCOPE;
                    } else {
                        // @scope_val not followed by /. Treat scope_val as name.
                        this.result.name = this.result.scope!;
                        this.result.fullName = this.result.name;
                        this.result.scope = undefined;
                        // Current token is not consumed, will be re-evaluated by NAME_FOUND state.
                        this.state = ParserFsmState.NAME_FOUND;
                    }
                    break;

                case ParserFsmState.EXPECT_NAME_SEGMENT_FOR_SCOPE: // After @scope_val/
                    if (token instanceof Segment) {
                        this.result.name = token.value;
                        // Scope must be defined here if we reached this state through valid transitions
                        this.result.fullName = `@${this.result.scope}/${this.result.name}`;
                        this.consumeToken();
                        this.state = ParserFsmState.NAME_FOUND;
                    } else {
                        // @scope_val/ not followed by name segment
                        this.state = ParserFsmState.ERROR; // Invalid name for scope
                    }
                    break;

                case ParserFsmState.NAME_FOUND: // Name is parsed. Expect @, /, or end.
                    if (token instanceof AtSign) {
                        this.consumeToken();
                        this.state = ParserFsmState.EXPECT_VERSION_SEGMENT;
                    } else if (token instanceof Slash) {
                        this.consumeToken(); // Consume the leading slash of the path
                        this.state = ParserFsmState.PATH_PARSING;
                    } else {
                        // Unexpected token
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.EXPECT_VERSION_SEGMENT: // After ...name@
                    if (token instanceof Segment) {
                        this.result.version = token.value;
                        this.consumeToken();
                        this.state =
                            ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION;
                    } else {
                        // ...name@ not followed by version segment (e.g. ...name@/path)
                        // The @ was not a version delimiter. Re-evaluate current token for path.
                        this.state =
                            ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION;
                    }
                    break;

                case ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION: // After ...name[@version]
                    if (token instanceof Slash) {
                        this.consumeToken(); // Consume the leading slash of the path
                        this.state = ParserFsmState.PATH_PARSING;
                    } else {
                        // No slash, so no path.
                        this.state = ParserFsmState.ERROR; // Unexpected token if not end
                    }
                    break;

                case ParserFsmState.PATH_PARSING: // Consuming path tokens
                    // The first slash into path mode is already consumed.
                    // Path can contain segments, slashes, and even @ (though unusual for @)
                    if (
                        token instanceof Segment ||
                        token instanceof Slash ||
                        token instanceof AtSign
                    ) {
                        this.pathBuffer.push(token.value);
                        this.consumeToken();
                        // Stay in PATH_PARSING until all tokens are consumed
                    } else {
                        this.state = ParserFsmState.ERROR; // Should not happen with current lexer
                    }
                    break;

                default:
                    this.state = ParserFsmState.ERROR; // Should not happen
            }
        }

        // Post-processing and finalization
        if (this.pathBuffer.length > 0) {
            this.result.path = this.pathBuffer.join('');
            this.result.extension = this.getExtension(this.result.path);
        }

        if (this.state === ParserFsmState.ERROR && !this.result.name) {
            // If a fundamental error occurred (e.g., couldn't parse name), return minimal result.
            return { name: '', fullName: '' };
        }

        // Ensure fullName is set if only name was parsed
        if (this.result.name && !this.result.fullName) {
            this.result.fullName = this.result.name;
        }

        return this.result;
    }
}

export default Parser;
