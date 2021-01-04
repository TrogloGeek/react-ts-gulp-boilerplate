import { Iterators } from "./Iterators";

test.each([-1, 0, 1, 5])('Iterators.ofCount(%p)', (count) => {
	const iterator = Iterators.ofCount(count);
	for (let i = 0; i < count; i += 1) {
		expect(iterator.next()).toEqual({ done: false, value: i});
	}
	expect(iterator.next()).toEqual({ done: true, value: undefined});
	expect(iterator.next()).toEqual({ done: true, value: undefined});
}, 200);

test.each([
	[0, -1, 1],
	[0, 0, 1],
	[0, 5, 1],
	[0, -5, 1],
	[2, 5, 1],
	[0, -1, -1],
	[0, 0, -1],
	[0, 5, -1],
	[0, -5, -1],
	[2, 5, -1],
	[-2, -5, -1]
])('Iterators.ofRange(%p, %p, %p)', (start, end, step) => {
	const iterator = Iterators.ofRange(start, end, step);
	for (let i = start; (step < 0) ? (i > end) : (i < end); i += step) {
		expect(iterator.next()).toEqual({ done: false, value: i});
	}
	expect(iterator.next()).toEqual({ done: true, value: undefined});
	expect(iterator.next()).toEqual({ done: true, value: undefined});
}, 200);

test.each([-1, 0, 1, 5])('Iterators.map(Iterators.ofCount(%p), String)', (count) => {
	const iterator = Iterators.map(Iterators.ofCount(count), String);
	for (let i = 0; i < count; i+=1) {
		expect(iterator.next()).toEqual({ done: false, value: i.toString() });
	}
	expect(iterator.next()).toEqual({ done: true, value: undefined});
	expect(iterator.next()).toEqual({ done: true, value: undefined});
}, 200);

test.each([
	[-1, ''],
	[0, ''],
	[1, '0'],
	[5, '01234']
])('Iterators.reduce(Iterators.map(Iterators.ofCount(%p), String), (a,r) => a.concat(r), "")', (count, result) => {
	expect(Iterators.reduce(Iterators.map(Iterators.ofCount(count), String), (a,r) => a.concat(r), '')).toStrictEqual(result);
}, 200);
