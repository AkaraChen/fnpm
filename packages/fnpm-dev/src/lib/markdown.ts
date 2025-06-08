import rehypeDocument from 'rehype-document';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFormat from 'rehype-format';
import rehypeStarryNight from 'rehype-starry-night';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(rehypeExternalLinks, {
        target: '_blank',
    })
    .use(rehypeStarryNight)
    .use(rehypeStringify);
