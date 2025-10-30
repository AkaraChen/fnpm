export interface IParseResult {
    /** protocol if present, eg: npm:express -> npm, jsr:@std/testing -> jsr */
    protocol?: string;
    /** scope without @, eg: @scope/package -> scope */
    scope?: string;
    /** name without scope, eg: @scope/package -> package */
    name: string;
    /** full name with scope, eg: @scope/package@1.0.0/path -> @scope/package */
    fullName: string;
    /** full name with protocol if present, eg: npm:@scope/package */
    fullNameWithProtocol: string;
    /** version, eg: @scope/package@1.0.0/path -> 1.0.0 */
    version?: string;
    /** path, eg: @scope/package@1.0.0/README.md -> README.md */
    path?: string;
    /** extension, eg github-markdown-css/github-markdown.css -> css */
    extension?: string;
}

export interface IParseResultBase {
    protocol?: string;
    scope?: string;
    name: string;
    version?: string;
    path?: string;
}

export class ParseResult implements IParseResult {
    protocol?: string;
    scope?: string;
    name: string;
    version?: string;
    path?: string;

    constructor(opts: IParseResultBase) {
        this.protocol = opts.protocol;
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

    get fullNameWithProtocol(): string {
        if (this.protocol) {
            return `${this.protocol}:${this.fullName}`;
        }
        return this.fullName;
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

        if (!fileName || fileName.startsWith('.')) {
            // No filename or it's a hidden file (e.g., .eslintrc, .gitconfig)
            return undefined;
        }

        const lastDotIndex = fileName.lastIndexOf('.');

        // Ensure dot is present, not the first character of the filename segment itself (already handled by startsWith('.')),
        // and not the last character.
        if (lastDotIndex > 0 && lastDotIndex < fileName.length - 1) {
            const potentialExtension = fileName.substring(lastDotIndex + 1);
            // Check if the potential extension is purely numeric
            if (/^\d+$/.test(potentialExtension)) {
                return undefined; // Path segment like /1.2.3 should not yield '3' as extension
            }
            return potentialExtension;
        }
        return undefined;
    }
}
