import { localPoint } from '@visx/event';
import { DefaultNode, Graph } from '@visx/network';
import { useScreenSize } from '@visx/responsive';
import { Zoom } from '@visx/zoom';
import type { FC, ReactNode } from 'react';

export interface NetworkProps {
  width: number;
  height: number;
}

interface CustomNode {
  x: number;
  y: number;
  color?: string;
}

interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

const nodes: CustomNode[] = [
  { x: 50, y: 20 },
  { x: 200, y: 250 },
  { x: 300, y: 40, color: '#26deb0' },
];

const links: CustomLink[] = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0], dashed: true },
];

const graph = {
  nodes,
  links,
};

export const background = '#272b4d';

const NetworkGraph = () => {
  return (
    <Graph<CustomLink, CustomNode>
      graph={graph}
      nodeComponent={({ node: { color } }) =>
        color ? <DefaultNode fill={color} /> : <DefaultNode />
      }
      linkComponent={({ link: { source, target, dashed } }) => (
        <line
          x1={source.x}
          y1={source.y}
          x2={target.x}
          y2={target.y}
          strokeWidth={2}
          stroke='#999'
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
