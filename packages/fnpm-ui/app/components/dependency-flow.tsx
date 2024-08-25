import type { Project } from '@pnpm/types';
import {
    type Edge,
    type Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import { type FC, useCallback, useEffect, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import type { SerializeFrom } from '@remix-run/node';

export interface DependencyFlowProps {
    projects: Array<SerializeFrom<Project>>;
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

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map<Node>((node) => {
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

const getNodesAndEdges = (projects: Array<SerializeFrom<Project>>) => {
    const nodes = projects.map((project) => ({
        id: project.manifest.name!,
        position: { x: 0, y: 0 },
        data: {
            label: project.manifest.name!,
        },
    })) as Node[];
    const names = new Set(projects.map((p) => p.manifest.name!));
    const depsFields = [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'optionalDependencies',
    ] as const;
    const edges = projects.reduce((prev, curr) => {
        const deps: Set<string> = new Set(
            depsFields.flatMap((field) =>
                Object.keys(curr.manifest[field] ?? {}),
            ),
        );
        const localDeps = [...intersection(names, deps)];
        for (const localDep of localDeps) {
            prev.push({
                id: `${curr.manifest.name!}-${localDep}`,
                source: curr.manifest.name!,
                target: localDep,
                animated: true,
            });
        }
        return prev;
    }, [] as Edge[]);
    return { nodes, edges };
};

const InnerDependencyFlow: FC = () => {
    const { fitView, setNodes, setEdges, getEdges, getNodes } = useReactFlow();

    const nodes = getNodes();
    const edges = getEdges();
    const onLayout = useCallback(
        (direction: 'TB' | 'LR') => {
            const layouted = getLayoutedElements(nodes, edges, {
                direction,
            });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });
        },
        [nodes, edges],
    );
    useEffect(() => {
        onLayout('TB');
    }, []);
    return null;
};

export const DependencyFlow: FC<DependencyFlowProps> = (props) => {
    const { projects } = props;
    const initial = useMemo(() => getNodesAndEdges(projects), [projects]);
    const [nodes, , onNodesChange] = useNodesState(initial.nodes);
    const [edges, , onEdgesChange] = useEdgesState(initial.edges);

    return (
        <ReactFlow
            style={{
                width: '100%',
                height: '100%',
            }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
        >
            <InnerDependencyFlow />
        </ReactFlow>
    );
};
