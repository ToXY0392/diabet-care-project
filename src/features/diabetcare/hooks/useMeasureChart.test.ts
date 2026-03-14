import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMeasureChart } from "./useMeasureChart";

describe("useMeasureChart", () => {
  it("returns path, areaPath, points and stats for a series", () => {
    const series = [70, 120, 180, 140, 90];
    const { result } = renderHook(() => useMeasureChart(series));

    expect(result.current.path).toBeDefined();
    expect(result.current.path).toMatch(/^M[\d.\s,]+( L[\d.\s,]+)+$/);
    expect(result.current.areaPath).toContain(result.current.path);
    expect(result.current.points).toHaveLength(5);
    expect(result.current.stats).toEqual({
      avg: 120,
      min: 70,
      max: 180,
    });
  });

  it("assigns shape hypo for value < 70", () => {
    const series = [50, 120];
    const { result } = renderHook(() => useMeasureChart(series));
    expect(result.current.points[0].shape).toBe("hypo");
    expect(result.current.points[1].shape).toBe("in_range");
  });

  it("assigns shape hyper for value > 180", () => {
    const series = [120, 200];
    const { result } = renderHook(() => useMeasureChart(series));
    expect(result.current.points[0].shape).toBe("in_range");
    expect(result.current.points[1].shape).toBe("hyper");
  });

  it("assigns shape in_range for 70 <= value <= 180", () => {
    const series = [70, 180, 100];
    const { result } = renderHook(() => useMeasureChart(series));
    expect(result.current.points[0].shape).toBe("in_range");
    expect(result.current.points[1].shape).toBe("in_range");
    expect(result.current.points[2].shape).toBe("in_range");
  });
});
