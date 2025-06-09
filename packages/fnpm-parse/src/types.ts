export interface IParseResult {
    /** scope without @, eg: @scope/package -> scope */
    scope?: string;
    /** name without scope, eg: @scope/package -> package */
    name: string;
    /** full name with scope, eg: @scope/package@1.0.0/path -> @scope/package */
    fullName: string;
    /** version, eg: @scope/package@1.0.0/path -> 1.0.0 */
    version?: string;
    /** path, eg: @scope/package@1.0.0/README.md -> README.md */
    path?: string;
    /** extension, eg github-markdown-css/github-markdown.css -> css */
    extension?: string;
}

interface IParseResultBase {
    scope?: string;
    name: string;
    version?: string;
    path?: string;
}

export class ParseResult implements IParseResult {
    scope?: string;
    name: string;
    version?: string;
    path?: string;

    constructor(opts: IParseResultBase) {
        this.scope = opts.scope;
        this.name = opts.name;
        this.version = opts.version;
        this.path = opts.path;
    }

    get fullName(): string {
        return `@${this.scope}/${this.name}`;
    }

    get extension(): string | undefined {
        return this.path.split('.').pop();
    }
}
