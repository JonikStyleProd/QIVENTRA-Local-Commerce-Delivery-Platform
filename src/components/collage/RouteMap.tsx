import React from 'react';
import { GeoPoint, distanceKm } from '../../data/addresses';

interface RouteMapProps {
  /** Shops in the order they are visited. */
  from: GeoPoint[];
  to: GeoPoint;
  /** 0 at the first shop, 1 at the door. */
  progress: number;
  label: string;
  pointA: string;
  pointB: string;
}

const WIDTH = 360;
const HEIGHT = 220;
const PADDING = 34;
/** Below this the two points are a few houses apart; the drawing should not blow that up. */
const MIN_SPAN_KM = 0.6;

/** Fits the points into the drawing, north up, with km the same length in both directions. */
export const projectRoute = (points: GeoPoint[], width = WIDTH, height = HEIGHT, padding = PADDING) => {
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const midLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

  const kmPerLat = distanceKm({ lat: midLat, lng: midLng }, { lat: midLat + 1, lng: midLng });
  const kmPerLng = distanceKm({ lat: midLat, lng: midLng }, { lat: midLat, lng: midLng + 1 });

  const spanX = Math.max((Math.max(...lngs) - Math.min(...lngs)) * kmPerLng, MIN_SPAN_KM);
  const spanY = Math.max((Math.max(...lats) - Math.min(...lats)) * kmPerLat, MIN_SPAN_KM);
  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY);

  return (point: GeoPoint) => ({
    x: width / 2 + (point.lng - midLng) * kmPerLng * scale,
    y: height / 2 - (point.lat - midLat) * kmPerLat * scale,
  });
};

/** A point part of the way along a line through several points. */
export const pointAlong = (points: { x: number; y: number }[], progress: number) => {
  const lengths = points.slice(1).map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let left = Math.min(Math.max(progress, 0), 1) * total;
  for (let index = 0; index < lengths.length; index += 1) {
    if (left <= lengths[index] && lengths[index] > 0) {
      const share = left / lengths[index];
      return {
        x: points[index].x + (points[index + 1].x - points[index].x) * share,
        y: points[index].y + (points[index + 1].y - points[index].y) * share,
      };
    }
    left -= lengths[index];
  }
  return points[points.length - 1];
};

const Marker: React.FC<{ x: number; y: number; text: string; fill: string; color: string }> = ({ x, y, text, fill, color }) => (
  <g>
    <circle cx={x} cy={y} r={15} fill={fill} stroke="var(--color-ink)" strokeWidth={3} />
    <text x={x} y={y + 6} textAnchor="middle" fontSize={17} fontWeight={900} fill={color}>
      {text}
    </text>
  </g>
);

/** The route as a diagram from the demo coordinates. It draws no streets, and calls no map service. */
export const RouteMap: React.FC<RouteMapProps> = ({ from, to, progress, label, pointA, pointB }) => {
  const project = projectRoute([...from, to]);
  const points = [...from, to].map(project);
  const courier = pointAlong(points, progress);
  const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      className="block w-full h-auto bg-tint-tech border-2 border-ink rounded-xl"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <line key={`v${index}`} x1={index * 60} y1={0} x2={index * 60} y2={HEIGHT} stroke="var(--color-paper-dot)" strokeWidth={1} />
      ))}
      {[1, 2, 3].map((index) => (
        <line key={`h${index}`} x1={0} y1={index * 55} x2={WIDTH} y2={index * 55} stroke="var(--color-paper-dot)" strokeWidth={1} />
      ))}
      <polyline points={line} fill="none" stroke="var(--color-ink)" strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" />
      {points.slice(0, -1).map((point, index) => (
        <Marker key={index} x={point.x} y={point.y} text={pointA} fill="var(--color-accent)" color="#1E1E1E" />
      ))}
      <Marker x={points[points.length - 1].x} y={points[points.length - 1].y} text={pointB} fill="var(--color-card)" color="var(--color-ink)" />
      <circle cx={courier.x} cy={courier.y} r={8} fill="var(--color-action)" stroke="var(--color-ink)" strokeWidth={3} />
    </svg>
  );
};
