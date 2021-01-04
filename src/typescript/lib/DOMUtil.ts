import { ClassOf } from "./TypeUtil";

export function requireTypedElementWithId<T extends HTMLElement>(id: string, elementType: ClassOf<T>): T {
	const element = document.getElementById(id);
	if (element instanceof elementType) {
		return element;
	}
	throw new TypeError(`element #${id} was expected to be instance of ${elementType.name}, got ${element}`);
}

export function requireElementWithId(id: string): HTMLElement {
	const element = document.getElementById(id);
	if (element != null) {
		return element;
	}
	throw new Error(`DOM element #${id} not found`);
}
