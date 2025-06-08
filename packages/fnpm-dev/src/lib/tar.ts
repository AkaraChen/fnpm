import { parseTarGzip } from 'nanotar';

export type Folder = {
    name: string;
    nodes: Array<Node>;
};

export type File = {
    name: string;
    content: string;
};

export const isFolder = (node: Node): node is Folder => 'nodes' in node;

export type Node = Folder | File;

const decoder = new TextDecoder();

export async function tarToTree(arrayBuffer: ArrayBuffer) {
    const items = await parseTarGzip(arrayBuffer);
    const tree: Folder = { name: '/', nodes: [] };
    for (const item of items) {
        const pathParts = item.name.split('/');
        let currentFolder = tree;
        for (const part of pathParts.slice(0, -1)) {
            let folder = currentFolder.nodes.find((node) => node.name === part);
            if (!folder) {
                folder = { name: part, nodes: [] };
                currentFolder.nodes.push(folder);
            }
            currentFolder = folder as Folder;
        }
        const file = {
            name: pathParts[pathParts.length - 1]!,
            content: decoder.decode(item.data),
        };
        currentFolder.nodes.push(file);
    }
    return tree;
}
