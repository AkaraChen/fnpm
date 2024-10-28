import rehypeShiki from '@shikijs/rehype';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
        themes: {
            light: 'one-light',
            dark: 'one-dark-pro',
        },
    })
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(rehypeStringify);
