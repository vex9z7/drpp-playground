import { localPoint } from '@visx/event';
import { DefaultNode, Graph } from '@visx/network';
import { useScreenSize } from '@visx/responsive';
import { Zoom } from '@visx/zoom';
import type { ComponentProps, FC, ReactNode } from 'react';

import { generateEuclideanGraph } from '../utils/generate-seedable-random-graph';

const DEFAULT_NODE_COLOR = '#26deb0';
const DEFAULT_EDGE_STROKE_COLOR = '#999';

// see at http://www.cse.yorku.ca/~oz/hash.html
const djb2 = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // BUG: number is not integer
  return hash >>> 0; // ensure unsigned 32-bit
};

const getRandomSeed = () => {
  const utcTime = Date.now().toString();
  const numHash = djb2(utcTime);
  return numHash.toString(16).padStart(8, '0');
};

const graph = generateEuclideanGraph(getRandomSeed());
const uiGraph = graph.toUiGraph();

export interface UiGraphNode {
  x: number;
  y: number;
  color?: string;
}

export interface UiGraphEdge {
  source: UiGraphNode;
  target: UiGraphNode;
  color?: string;
  dashed?: boolean;
}

const UiGraph = Graph<UiGraphEdge, UiGraphNode>;
export type UiGraphType = ComponentProps<typeof UiGraph>['graph'];

export const background = '#272b4d';

const NetworkGraph = () => {
  return (
    <UiGraph
      graph={uiGraph}
      nodeComponent={({ node: { x, y, color } }) => (
        <DefaultNode x={x} y={y} fill={color ?? DEFAULT_NODE_COLOR} />
      )}
      linkComponent={({ link: { source, target, dashed } }) => (
        <line
          x1={source.x}
          y1={source.y}
          x2={target.x}
          y2={target.y}
          strokeWidth={2}
          stroke={DEFAULT_EDGE_STROKE_COLOR}
          strokeOpacity={0.6}
          strokeDasharray={dashed ? '8,4' : undefined}
        />
      )}
    />
  );
};

interface DragableLayerProps {
  width: number;
  height: number;
  scaleMin: number;
  scaleMax: number;
  children: ReactNode;
}

const DragableLayer: FC<DragableLayerProps> = (props) => {
  const { width, height, children, scaleMin, scaleMax } = props;

  return (
    <Zoom<SVGSVGElement>
      width={width}
      height={height}
      scaleXMin={scaleMin}
      scaleXMax={scaleMax}
      scaleYMin={scaleMin}
      scaleYMax={scaleMax}
    >
      {(zoom) => {
        return (
          <svg
            width={width}
            height={height}
            style={{
              cursor: zoom.isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
            ref={zoom.containerRef}
          >
            <rect width={width} height={height} fill={background} />
            <g transform={zoom.toString()}>{children}</g>
            <rect
              width={width}
              height={height}
              fill='transparent'
              onTouchStart={zoom.dragStart}
              onTouchMove={zoom.dragMove}
              onTouchEnd={zoom.dragEnd}
              onMouseDown={zoom.dragStart}
              onMouseMove={zoom.dragMove}
              onMouseUp={zoom.dragEnd}
              onMouseLeave={() => {
                if (zoom.isDragging) zoom.dragEnd();
              }}
              onDoubleClick={(event) => {
                const point = localPoint(event) ?? { x: 0, y: 0 };
                // TODO: change the double click behavior
                zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
              }}
            />
          </svg>
        );
      }}
    </Zoom>
  );
};

export const GraphViewer = () => {
  const { width, height } = useScreenSize();

  return (
    <DragableLayer width={width} height={height} scaleMin={1 / 2} scaleMax={2}>
      <NetworkGraph />
    </DragableLayer>
  );
};
