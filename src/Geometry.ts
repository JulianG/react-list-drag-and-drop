export interface Point {
	x: number;
	y: number;
}

export interface Rect {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface RectPoints {
	topLeft: Point;
	topRight: Point;
	bottomLeft: Point;
	bottomRight: Point;
}

export interface RectBounds {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

export function isRectValid(r: Rect): boolean {
	return r && r.width >= 0 && r.height >= 0;
}

export function areRectsOverlapping(r0: Rect, r1: Rect): boolean {
	const r = getIntersectionRect(r0, r1);
	return r.width > 0 && r.height > 0;
}

export function getAreaOfIntersection(r0: Rect, r1: Rect): number {
	const rect = getIntersectionRect(r0, r1);
	return getRectArea(rect);
}

export function getIntersectionRect(r0: Rect, r1: Rect): Rect {

	const r0b = getRectBounds(r0);
	const r1b = getRectBounds(r1);

	const x1 = r0b.left;
	const y1 = r0b.top;
	const x2 = r0b.right;
	const y2 = r0b.bottom;

	const x3 = r1b.left;
	const y3 = r1b.top;
	const x4 = r1b.right;
	const y4 = r1b.bottom;

	const x5 = Math.max(x1, x3);
	const y5 = Math.max(y1, y3);
	const x6 = Math.min(x2, x4);
	const y6 = Math.min(y2, y4);

	return { left: x5, width: x6 - x5, top: y5, height: y6 - y5 };
}

export function getRectArea(r: Rect): number {
	return isRectValid(r) ? r.width * r.height : 0;
}

export function getRectBounds(r: Rect): RectBounds {
	const top = r.top;
	const left = r.left;
	const bottom = r.top + r.height;
	const right = r.left + r.width;
	return { top, left, bottom, right };
}

export function getRectPoints(r: Rect): RectPoints {
	const { top, left, bottom, right } = getRectBounds(r);
	const topLeft = { x: left, y: top };
	const topRight = { x: right, y: top };
	const bottomLeft = { x: left, y: bottom };
	const bottomRight = { x: right, y: bottom };
	return { topLeft, topRight, bottomLeft, bottomRight };
}

export function pointToString(p: Point): string {
	return `Point{${p.x},${p.y}}`;
}

export function rectToString(r: Rect): string {
	const bounds = getRectBounds(r);
	return `Rect{${JSON.stringify(bounds)}}`;
}