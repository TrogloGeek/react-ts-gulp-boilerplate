import React from 'react';

type RefreshProps = {
	interval: number
};

export const Refresh: React.FunctionComponent<RefreshProps> =  ({interval: interval, children}) => {
	const [lastRefresh, setLastRefresh] = React.useState<number>(new Date().getTime());
	React.useDebugValue(lastRefresh);
	React.useEffect(() => {
		const intervalHandle = setInterval(() => {
			setLastRefresh(new Date().getTime());
		}, interval)
	}, []);
	console.log(lastRefresh);
	return <>{children}</>;
};
