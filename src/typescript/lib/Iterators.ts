import { identity } from "./Functions";

export namespace Iterators {
	type Mapper<Input, Result> = (input: Input) => Result;

	export function map<T, R>(iterator: Iterator<T>, mapper: Mapper<T,R>): Iterator<R>
	{
		return {
			next: () => {
				const { done, value } = iterator.next();
				return done === true 
					? { done, value }
					: { done, value: mapper(value) }
				;
			}
		}
	}

	type Reducer<Input, Result> = (accumulator: Result, current: Input) => Result;

	export function reduce<T, R>(iterator: Iterator<T>, reducer: Reducer<T, R>, initialValue: R): R
	{
		let result = initialValue;
		for (let current = iterator.next(); !current.done; current = iterator.next()) {
			result = reducer(result, current.value);
		}
		return result;
	}

	export function ofRange(start: number, endExclusive: number, step: number = 1): Iterator<number, undefined>
	{
		let next = start;
		const evalCompletion = step < 0
			? () => next <= endExclusive
			: () => next >= endExclusive
		;
		return {
			next: () => {
				const done = evalCompletion();
				if (done) {
					return  { done, value: undefined };
				}
				const value = next;
				next += step;
				return { done, value };
			}
		}
	}

	export function ofCount(iterations: number): Iterator<number, undefined>
	{
		return ofRange(0, iterations);
	}
}
