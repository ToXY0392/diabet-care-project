import { useMemo } from "react";

/**
 * Calcule le tracé SVG (ligne + zone remplie) et les points du graphique glycémie.
 * Seuils hypo/hyper utilisés pour la forme des points (accessibilité / daltoniens).
 */
/** Zone glycémique pour double codage visuel (couleur + forme) : hypo = carré, in_range = cercle, hyper = triangle. */
export type PointZone = "hypo" | "in_range" | "hyper";

const HYPER_THRESHOLD = 180;
const HYPO_THRESHOLD = 70;

export type MeasureChartPoint = {
  value: number;
  x: number;
  y: number;
  index: number;
  /** Forme pour accessibilité / daltoniens : hypo = carré, in_range = cercle, hyper = triangle */
  shape: PointZone;
};

type MeasureChartResult = {
  path: string;
  areaPath: string;
  points: MeasureChartPoint[];
  stats: {
    avg: number;
    min: number;
    max: number;
  };
};

function getZone(value: number): PointZone {
  if (value < HYPO_THRESHOLD) return "hypo";
  if (value > HYPER_THRESHOLD) return "hyper";
  return "in_range";
}

export function useMeasureChart(series: readonly number[], width = 310, height = 170): MeasureChartResult {
  return useMemo(() => {
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = Math.max(max - min, 1);

    const points: MeasureChartPoint[] = series.map((value, index) => {
      const x = (index / (series.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 24) - 12;
      return { value, x, y, index, shape: getZone(value) };
    });

    const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
    const areaPath = `${path} L${width},${height} L0,${height} Z`;

    return {
      path,
      areaPath,
      points,
      stats: {
        avg: Math.round(series.reduce((sum, value) => sum + value, 0) / series.length),
        min,
        max,
      },
    };
  }, [height, series, width]);
}
