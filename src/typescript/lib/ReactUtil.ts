import React from "react";

export function usePropStateSyncedOnChange<T>(prop: T): [T, React.Dispatch<React.SetStateAction<T>>]
{
	const [state, setState] = React.useState<T>(prop);
	React.useEffect(() => {
		if (state !== prop) {
			setState(prop);
		}
	}, [prop]);
	return [state, setState];
}
