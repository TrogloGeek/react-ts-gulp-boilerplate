export namespace java {
	export type BinaryOperator<T> = (left: T, right: T) => T;
	export type Consumer<T> = (input: T) => void;
	export type Function<T,R> = (input: T) => R;
	export type Producer<T> = () => T;
	export type UnaryOperator<T> = (input: T) => T;
}
export interface ClassOf<T> { new(): T };
