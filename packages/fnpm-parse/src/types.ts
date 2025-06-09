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

export interface IParseResultBase {
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
        if (this.scope) {
            return `@${this.scope}/${this.name}`;
        }
        return this.name;
    }

    get extension(): string | undefined {
        if (!this.path) {
            return undefined;
        }
        const lastSlashIndex = this.path.lastIndexOf('/');
        const fileName =
            lastSlashIndex === -1
                ? this.path
                : this.path.substring(lastSlashIndex + 1);

        if (!fileName) {
            return undefined;
        }

        const lastDotIndex = fileName.lastIndexOf('.');

        // Ensure dot is present, not the first character (hidden file), and not the last character.
        if (lastDotIndex > 0 && lastDotIndex < fileName.length - 1) {
            return fileName.substring(lastDotIndex + 1);
        }
        return undefined;
    }
}
