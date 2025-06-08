export const urlToAbsolute = (url: URL) => {
    return `${url.pathname}${url.search}${url.hash}`;
};
