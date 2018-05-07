import * as Geom from '../Geometry';

/* tslint:disable no-any */
// const _test = (s: string, f: any) => console.warn(`Skipping test: ${s}`);

test('Two Rects not overlapping, when r0 is NW of r1', () => {
	const r0: Geom.Rect = { top: 0, left: 0, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeFalsy();
});

test('Two Rects not overlapping, when r0 is NE of r1', () => {
	const r0: Geom.Rect = { top: 0, left: 20, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeFalsy();
});

test('Two Rects not overlapping, when r0 is SE of r1', () => {
	const r0: Geom.Rect = { top: 20, left: 20, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeFalsy();
});

test('Two Rects not overlapping, when r0 is SW of r1', () => {
	const r0: Geom.Rect = { top: 20, left: 0, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeFalsy();
});

test('Two rects are overlapping, when r0 is NW os r1', () => {
	const r0: Geom.Rect = { top: 5, left: 5, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeTruthy();
});

test('Two rects are overlapping, when r0 is NE of r1', () => {
	const r0: Geom.Rect = { top: 5, left: 15, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeTruthy();
});

test('Two Rects are overlapping, when r0 is SE of r1', () => {
	const r0: Geom.Rect = { top: 15, left: 15, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeTruthy();
});

test('Two Rects are overlapping, when r0 is SW of r1', () => {
	const r0: Geom.Rect = { top: 15, left: 5, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeTruthy();
});

test('Two Rects are overlapping, when r0 is within r1', () => {
	const r0: Geom.Rect = { top: 12, left: 12, width: 6, height: 6 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeTruthy();
});

test('Two Rects are overlapping, when r1 is within r0', () => {
	const r0: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 12, left: 12, width: 6, height: 6 };
	expect(Geom.areRectsOverlapping(r0, r1)).toBeTruthy();
});

/// /// ///

test('Two overlapping rects, when r0 is NW os r1, have the expected overlapping Rect', () => {
	const r0: Geom.Rect = { top: 5, left: 5, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getIntersectionRect(r0, r1)).toEqual({ top: 10, left: 10, width: 5, height: 5 });
});

test('Two rects are overlapping, when r0 is NE of r1, have the expected overlapping Rect', () => {
	const r0: Geom.Rect = { top: 5, left: 15, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getIntersectionRect(r0, r1)).toEqual({ top: 10, left: 15, width: 5, height: 5 });
});

test('Two Rects are overlapping, when r0 is SE of r1, have the expected overlapping Rect', () => {
	const r0: Geom.Rect = { top: 15, left: 15, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getIntersectionRect(r0, r1)).toEqual({ top: 15, left: 15, width: 5, height: 5 });
});

test('Two Rects are overlapping, when r0 is SW of r1, have the expected overlapping Rect', () => {
	const r0: Geom.Rect = { top: 15, left: 5, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getIntersectionRect(r0, r1)).toEqual({ top: 15, left: 10, width: 5, height: 5 });
});

test('Two Rects are overlapping, when r0 is within r1, have the expected overlapping Rect', () => {
	const r0: Geom.Rect = { top: 12, left: 12, width: 6, height: 6 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getIntersectionRect(r0, r1)).toEqual({ top: 12, left: 12, width: 6, height: 6 });
});

test('Two Rects are overlapping, when r1 is within r0, have the expected overlapping Rect', () => {
	const r0: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 12, left: 12, width: 6, height: 6 };
	expect(Geom.getIntersectionRect(r0, r1)).toEqual({ top: 12, left: 12, width: 6, height: 6 });
});

/// /// ///

test('Two Rects NOT overlapping, have a zero overlapping area', () => {
	const r0: Geom.Rect = { top: 0, left: 0, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(0);
});

test('Two overlapping rects, when r0 is NW os r1, have the expected overlapping area', () => {
	const r0: Geom.Rect = { top: 5, left: 5, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(25);
});

test('Two rects are overlapping, when r0 is NE of r1, have the expected overlapping area', () => {
	const r0: Geom.Rect = { top: 5, left: 15, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(25);
});

test('Two Rects are overlapping, when r0 is SE of r1, have the expected overlapping area', () => {
	const r0: Geom.Rect = { top: 15, left: 15, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(25);
});

test('Two Rects are overlapping, when r0 is SW of r1, have the expected overlapping area', () => {
	const r0: Geom.Rect = { top: 15, left: 5, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(25);
});

test('Two Rects are overlapping, when r0 is within r1, have the expected overlapping area', () => {
	const r0: Geom.Rect = { top: 12, left: 12, width: 6, height: 6 };
	const r1: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(36);
});

test('Two Rects are overlapping, when r1 is within r0, have the expected overlapping area', () => {
	const r0: Geom.Rect = { top: 10, left: 10, width: 10, height: 10 };
	const r1: Geom.Rect = { top: 12, left: 12, width: 6, height: 6 };
	expect(Geom.getAreaOfIntersection(r0, r1)).toBe(36);
});
