import { Random } from 'random';

import type { UiGraphType } from '../components/GraphViewer';

export interface GraphNode {
  id: string;
}

export interface EuclideanNode extends GraphNode {
  x: number;
  y: number;
}

export interface GraphEdge<N extends GraphNode = GraphNode> {
  endpoints: [N, N];
}

export interface Graph<N extends GraphNode = GraphNode> {
  nodes: N[];
  edges: GraphEdge<N>[];
  toUiGraph: () => UiGraphType;
}

const MIN_NODE_COUNT = 5;
const MAX_NODE_COUNT = 12;

const WIDTH = 500;
const HEIGHT = 500;

export const generateEuclideanGraph = (seed: string): Graph<EuclideanNode> => {
  const rng = new Random(seed);

  const nodeCount = rng.int(MIN_NODE_COUNT, MAX_NODE_COUNT);

  const nodes: EuclideanNode[] = Array.from({ length: nodeCount }, (_, i) => ({
    id: i.toString(),
    x: rng.float() * WIDTH,
    y: rng.float() * HEIGHT,
  }));

  const edges: GraphEdge<EuclideanNode>[] = [];
  for (const u of nodes) {
    for (const v of nodes) {
      if (v.id >= u.id) {
        break;
      }
      edges.push({ endpoints: [u, v] });
    }
  }

  return {
    nodes,
    edges,
    toUiGraph: () => ({
      nodes: nodes.map(({ x, y }) => ({ x, y })),
      // TODO: use an adapter
      links: edges.map(({ endpoints: [source, target] }) => ({
        source,
        target,
      })),
    }),
  };
};
