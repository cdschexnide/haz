import { buildCellsFromLines, buildGrid, filterCells } from "../cellBuilder";
import { Line, DetectedCell, Point } from "../opencvTypes";

describe("cellBuilder", () => {
  describe("buildGrid", () => {
    it("should build a grid from intersections", () => {
      const intersections: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 200, y: 0 },
        { x: 0, y: 50 },
        { x: 100, y: 50 },
        { x: 200, y: 50 },
        { x: 0, y: 100 },
        { x: 100, y: 100 },
        { x: 200, y: 100 },
      ];

      const grid = buildGrid(intersections, 10);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(3);
      expect(grid.points[0][0]).toEqual({ x: 0, y: 0 });
      expect(grid.points[2][2]).toEqual({ x: 200, y: 100 });
    });

    it("should handle unsorted intersections", () => {
      const intersections: Point[] = [
        { x: 200, y: 100 },
        { x: 0, y: 0 },
        { x: 100, y: 50 },
        { x: 0, y: 100 },
        { x: 200, y: 0 },
        { x: 100, y: 0 },
        { x: 0, y: 50 },
        { x: 200, y: 50 },
        { x: 100, y: 100 },
      ];

      const grid = buildGrid(intersections, 10);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(3);
    });

    it("should use percentage-based clustering", () => {
      const intersections: Point[] = [
        { x: 0, y: 0 },
        { x: 102, y: 3 },
        { x: 200, y: 0 },
        { x: 2, y: 100 },
        { x: 98, y: 101 },
        { x: 201, y: 99 },
      ];

      const grid = buildGrid(intersections, 15);

      expect(grid.rows).toBe(2);
      expect(grid.cols).toBe(3);
    });
  });

  describe("buildCellsFromLines", () => {
    it("should build cells from a simple 2x2 grid", () => {
      const horizontal: Line[] = [
        { x1: 0, y1: 0, x2: 200, y2: 0 },
        { x1: 0, y1: 100, x2: 200, y2: 100 },
        { x1: 0, y1: 200, x2: 200, y2: 200 },
      ];
      const vertical: Line[] = [
        { x1: 0, y1: 0, x2: 0, y2: 200 },
        { x1: 100, y1: 0, x2: 100, y2: 200 },
        { x1: 200, y1: 0, x2: 200, y2: 200 },
      ];

      const cells = buildCellsFromLines(horizontal, vertical, 10);

      expect(cells.length).toBe(4);

      const topLeft = cells.find(c => c.x === 0 && c.y === 0);
      expect(topLeft).toBeDefined();
      expect(topLeft!.width).toBe(100);
      expect(topLeft!.height).toBe(100);
    });

    it("should handle no intersections gracefully", () => {
      const horizontal: Line[] = [{ x1: 0, y1: 0, x2: 100, y2: 0 }];
      const vertical: Line[] = [{ x1: 200, y1: 100, x2: 200, y2: 200 }];

      const cells = buildCellsFromLines(horizontal, vertical, 10);
      expect(cells.length).toBe(0);
    });
  });

  describe("filterCells", () => {
    it("should filter out cells smaller than minimum size", () => {
      const cells: DetectedCell[] = [
        { x: 0, y: 0, width: 100, height: 50 },
        { x: 100, y: 0, width: 30, height: 50 },
        { x: 0, y: 50, width: 100, height: 20 },
        { x: 100, y: 50, width: 30, height: 20 },
      ];

      const filtered = filterCells(cells, 50, 30);

      expect(filtered.length).toBe(1);
      expect(filtered[0]).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });

    it("should keep all cells if they meet minimum size", () => {
      const cells: DetectedCell[] = [
        { x: 0, y: 0, width: 100, height: 50 },
        { x: 100, y: 0, width: 100, height: 50 },
      ];

      const filtered = filterCells(cells, 50, 30);
      expect(filtered.length).toBe(2);
    });
  });
});
