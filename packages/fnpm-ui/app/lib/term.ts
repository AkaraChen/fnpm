import AnsiConv from 'ansi-to-html';
import DOMPurify from 'isomorphic-dompurify';

const conv = new AnsiConv();

export const transformAnsi = (ansi: string) => {
    return DOMPurify.sanitize(conv.toHtml(ansi), {
        ALLOWED_TAGS: ['span', 'b', 'i', 'u', 'br', 'strike'],
        ALLOWED_ATTR: ['style'],
    });
};
