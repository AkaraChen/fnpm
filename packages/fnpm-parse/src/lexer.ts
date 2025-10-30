export class Segment {
    constructor(public value: string) {}
}

export class AtSign {
    value = '@';
}

export class Slash {
    value = '/';
}

export class Colon {
    value = ':';
}

export type Token = Segment | AtSign | Slash | Colon;

export class Lexer {
    private index = 0;
    private stack = '';
    private tokens: Token[] = [];

    constructor(private str: string) {}

    private char(): string {
        return this.str[this.index];
    }

    private hasMore(): boolean {
        return this.index < this.str.length;
    }

    private emit(): void {
        if (this.stack) {
            const token = new Segment(this.stack);
            this.stack = '';
            this.tokens.push(token);
        }
    }

    private advance(): void {
        this.index++;
    }

    lex(): Token[] {
        this.tokens = [];
        this.stack = '';
        this.index = 0;

        while (this.hasMore()) {
            this.processChar();
        }

        // Emit any remaining segment in the stack
        this.emit();

        return this.tokens;
    }

    private processChar(): void {
        const currentChar = this.char();

        switch (currentChar) {
            case '@':
                this.emit();
                this.tokens.push(new AtSign());
                this.advance();
                break;

            case '/':
                this.emit();
                this.tokens.push(new Slash());
                this.advance();
                break;

            case ':':
                this.emit();
                this.tokens.push(new Colon());
                this.advance();
                break;

            default:
                this.stack += currentChar;
                this.advance();
                break;
        }
    }
}
