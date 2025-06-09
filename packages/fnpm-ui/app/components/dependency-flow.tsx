import {
    type Edge,
    Handle,
    type Node,
    type NodeProps,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import { type CSSProperties, type FC, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import { Card, Text } from '@mantine/core';
import { getDeps } from 'fnpm-toolkit';
import { useNavigate } from 'react-router';
import type { PackageJson } from 'type-fest';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import type { Project } from '~/server/fnpm.server';

export type Manifest = Project['manifest'];

export interface DependencyFlowProps {
    projects: Array<Manifest>;
    rootProject?: Manifest;
    style?: CSSProperties;
}

function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set([...a].filter((x) => b.has(x)));
}

const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    options: {
        direction: 'TB' | 'LR';
    },
) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    for (const edge of edges) {
        g.setEdge(edge.source, edge.target);
    }

    for (const node of nodes) {
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        });
    }

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

const getNodesAndEdges = (
    projects: Array<Manifest>,
    rootProject?: Manifest,
) => {
    const nodes = projects.map((project) => ({
        type: 'custom',
        id: project.name!,
        position: { x: 0, y: 0 },
        data: {
            workspace: project.name!,
        },
    })) as Node[];
    const names = new Set(projects.map((p) => p.name!));
    const edges = projects.reduce((prev, curr) => {
        const deps: Set<string> = new Set(getDeps(curr as PackageJson));
        const localDeps = [...intersection(names, deps)];
        for (const localDep of localDeps) {
            prev.push({
                id: `${curr.name!}-${localDep}`,
                source: curr.name!,
                target: localDep,
                animated: true,
            });
        }
        return prev;
    }, [] as Edge[]);

    if (rootProject) {
        for (const project of projects) {
            if (project.name === rootProject.name) {
                continue;
            }
            edges.push({
                id: `${rootProject.name!}-${project.name!}`,
                source: rootProject.name!,
                target: project.name!,
                animated: true,
            });
        }
    }
    return { nodes, edges };
};

const CustomNode: FC<NodeProps<Node<{ workspace: string }>>> = ({ data }) => {
    const navigate = useNavigate();
    return (
        <>
            <Handle type='target' position={Position.Top} />
            <Card
                shadow='sm'
                padding='lg'
                radius='md'
                withBorder
                onClick={() => {
                    const url = `/packages/${encodeURIComponent(
                        data.workspace,
                    )}`;
                    navigate(url);
                }}
            >
                <Text>{data.workspace}</Text>
            </Card>
            <Handle type='source' position={Position.Bottom} />
        </>
    );
};

const InnerDependencyFlow: FC<DependencyFlowProps> = (props) => {
    const { projects, rootProject, style } = props;
    const { fitView } = useReactFlow();
    const initial = useMemo(
        () => getNodesAndEdges(projects, rootProject),
        [projects, rootProject],
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

    useDeepCompareEffectNoCheck(() => {
        const layouted = getLayoutedElements(nodes, edges, {
            direction: 'TB',
        });
        setNodes(layouted.nodes);
        setEdges(layouted.edges);

        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [nodes, edges]);

    return (
        <ReactFlow
            style={{ width: '100%', height: '100%', ...style }}
            nodes={nodes}
            nodeTypes={{ custom: CustomNode }}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            proOptions={{
                hideAttribution: true,
            }}
        />
    );
};

export const DependencyFlow: FC<DependencyFlowProps> = (props) => {
    return (
        <ReactFlowProvider>
            <InnerDependencyFlow {...props} />
        </ReactFlowProvider>
    );
};
