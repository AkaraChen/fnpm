import { type File, type Folder, type Node, isFolder } from '@/lib/tar';
import { nanoid } from 'nanoid';
import { type FC, useMemo, useState } from 'react';
import { type NodeRendererProps, Tree } from 'react-arborist';
import 'file-icons-js/css/style.css';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn, detectLangByFilename } from '@/lib/utils';
import IconFolder from '@tabler/icons-react/dist/esm/icons/IconFolder';
// @ts-ignore
import { getClassWithColor } from 'file-icons-js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface FileTreeProps {
    fileTree: Node[];
    className?: string;
}

type TreeNode = {
    id: string;
    name: string;
    original: Folder | File;
    children?: TreeNode[];
};

function sortNode(a: Node, b: Node) {
    // folder first
    if (isFolder(a) && !isFolder(b)) {
        return -1;
    }
    // sort by alphabet, case-insensitive
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
}

const FileTreeNode: FC<NodeRendererProps<TreeNode>> = (props) => {
    const { node, style } = props;
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);
    const indent = indentSize / 24;
    if (!node.isLeaf) {
        return (
            <div
                onClick={() => {
                    node.toggle();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        node.toggle();
                    }
                }}
                className={
                    'flex items-center hover:text-blue-500 h-10 cursor-pointer border-b border-border px-4 w-full'
                }
                style={{
                    marginLeft: `${indent}rem`,
                }}
            >
                <IconFolder size={18} />
                <span className={'ml-2'}>{props.node.data.name}</span>
            </div>
        );
    }
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                'flex items-center h-10 border-b border-border px-4 w-full',
                style,
            )}
        >
            <div
                className={'flex w-5 cursor-pointer'}
                style={{
                    marginLeft: `${indent}rem`,
                }}
            >
                <i
                    className={cn(
                        getClassWithColor(props.node.data.name),
                        'not-italic block size-full',
                    )}
                />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <div
                        className={
                            'ml-1 opacity-75 hover:text-blue-500 hover:opacity-100'
                        }
                        onClick={() => {
                            setOpen(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setOpen(true);
                            }
                        }}
                    >
                        {props.node.data.name}
                    </div>
                </DialogTrigger>
                <DialogContent
                    className={
                        'max-w-screen-lg w-full max-h-[600px] flex flex-col'
                    }
                >
                    <DialogTitle>Code</DialogTitle>
                    <div className={'overflow-y-auto'}>
                        <SyntaxHighlighter
                            language={detectLangByFilename(
                                props.node.data.name,
                            )}
                            style={atomOneLight}
                            customStyle={{
                                background: 'transparent',
                                fontSize: '13px',
                                padding: 0,
                            }}
                        >
                            {(props.node.data.original as File).content}
                        </SyntaxHighlighter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const FileTree: FC<FileTreeProps> = (props) => {
    const { fileTree } = props;
    const renderTree = useMemo(() => {
        function traverse(node: Folder | File): Array<TreeNode> {
            // temp fix here, need to fix in tar2tree
            if (node.name === '') {
                return [];
            }
            const treeNode: TreeNode = {
                id: nanoid(),
                name: node.name,
                original: node,
            } as TreeNode;
            if (isFolder(node)) {
                treeNode.children = node.nodes.sort(sortNode).flatMap(traverse);
            }
            return [treeNode];
        }
        // Sort the top-level nodes before traversing
        return fileTree.sort(sortNode).flatMap(traverse);
    }, [fileTree]);
    return (
        <Tree
            data={renderTree}
            width={'100%'}
            indent={24}
            rowHeight={40}
            openByDefault={false}
            className={cn('font-mono text-sm select-none', props.className)}
        >
            {FileTreeNode}
        </Tree>
    );
};
