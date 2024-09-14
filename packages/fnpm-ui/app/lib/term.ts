import AnsiConv from 'ansi-to-html';
import * as sanitizeHtml from 'sanitize-html';

const conv = new AnsiConv();

export const transformAnsi = (ansi: string) => {
    return sanitizeHtml.default(conv.toHtml(ansi), {
        allowedTags: ['span', 'b', 'i', 'u', 'br', 'strike'],
        allowedAttributes: {
            span: ['style'],
        },
    });
};
