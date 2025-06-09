import { AtSign, Lexer, Segment, Slash, type Token } from './lexer';
import { type IParseResult, type IParseResultBase, ParseResult } from './types';

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
    private baseResult: IParseResultBase = { name: '' };
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

    public parse(str: string): IParseResult {
        this.tokens = new Lexer(str).lex();
        this.currentIndex = 0;
        this.baseResult = { name: '' }; // Reset for multiple calls on same instance
        this.state = ParserFsmState.START;
        this.pathBuffer = [];

        if (this.tokens.length === 0 && str.length > 0) {
            // Input string was not empty, but lexer produced no tokens (e.g. string of only invalid chars for lexer)
            // Or handle this as an error state in the FSM if preferred.
            return new ParseResult(this.baseResult);
        }
        if (this.tokens.length === 0 && str.length === 0) {
            return new ParseResult(this.baseResult); // Empty input string
        }

        while (
            this.state !== ParserFsmState.END &&
            this.state !== ParserFsmState.ERROR
        ) {
            const token = this.currentToken();

            if (!token) {
                // No more tokens
                switch (this.state) {
                    case ParserFsmState.START:
                    case ParserFsmState.NAME_FOUND:
                    case ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION:
                    case ParserFsmState.PATH_PARSING:
                        this.state = ParserFsmState.END;
                        break;
                    default:
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
                        this.baseResult.name = token.value;
                        this.consumeToken();
                        this.state = ParserFsmState.NAME_FOUND;
                    } else {
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.EXPECT_SCOPE_SEGMENT:
                    if (token instanceof Segment) {
                        this.baseResult.scope = token.value;
                        this.consumeToken();
                        this.state = ParserFsmState.EXPECT_SLASH_AFTER_SCOPE;
                    } else {
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.EXPECT_SLASH_AFTER_SCOPE:
                    if (token instanceof Slash) {
                        this.consumeToken();
                        this.state =
                            ParserFsmState.EXPECT_NAME_SEGMENT_FOR_SCOPE;
                    } else {
                        // Not a slash, so what was parsed as scope is actually the name.
                        this.baseResult.name = this.baseResult.scope!;
                        this.baseResult.scope = undefined;
                        this.state = ParserFsmState.NAME_FOUND; // Re-evaluate current token in NAME_FOUND
                    }
                    break;

                case ParserFsmState.EXPECT_NAME_SEGMENT_FOR_SCOPE:
                    if (token instanceof Segment) {
                        this.baseResult.name = token.value;
                        this.consumeToken();
                        this.state = ParserFsmState.NAME_FOUND;
                    } else {
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.NAME_FOUND:
                    if (token instanceof AtSign) {
                        this.consumeToken();
                        this.state = ParserFsmState.EXPECT_VERSION_SEGMENT;
                    } else if (token instanceof Slash) {
                        this.consumeToken(); // Consume the leading slash of the path
                        this.baseResult.path = ''; // Initialize path
                        this.state = ParserFsmState.PATH_PARSING;
                    } else {
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.EXPECT_VERSION_SEGMENT:
                    if (token instanceof Segment) {
                        this.baseResult.version = token.value;
                        this.consumeToken();
                        this.state =
                            ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION;
                    } else {
                        // Not a segment after @, so @ was not for version. Re-evaluate for path.
                        this.state =
                            ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION;
                    }
                    break;

                case ParserFsmState.EXPECT_PATH_OR_END_AFTER_VERSION:
                    if (token instanceof Slash) {
                        this.consumeToken(); // Consume the leading slash of the path
                        this.baseResult.path = ''; // Initialize path
                        this.state = ParserFsmState.PATH_PARSING;
                    } else {
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                case ParserFsmState.PATH_PARSING:
                    if (
                        token instanceof Segment ||
                        token instanceof Slash ||
                        token instanceof AtSign
                    ) {
                        this.pathBuffer.push(token.value);
                        this.consumeToken();
                    } else {
                        this.state = ParserFsmState.ERROR;
                    }
                    break;

                default:
                    this.state = ParserFsmState.ERROR;
            }
        }

        if (this.pathBuffer.length > 0) {
            // If path was initialized to "" (because a slash was seen), append the buffer.
            // Otherwise, if no slash was seen before (e.g. direct error or unexpected end), set it directly.
            if (this.baseResult.path === '') {
                this.baseResult.path += this.pathBuffer.join('');
            } else {
                // This case should ideally not be hit if path parsing is only entered after a slash.
                // However, to be safe, if path wasn't initialized, set it.
                this.baseResult.path = this.pathBuffer.join('');
            }
        }

        // If parsing ended in error and no name was found, it's a critical failure.
        if (this.state === ParserFsmState.ERROR && !this.baseResult.name) {
            return new ParseResult({ name: '' }); // Return minimal valid ParseResult
        }

        return new ParseResult(this.baseResult);
    }
}

export default Parser;
