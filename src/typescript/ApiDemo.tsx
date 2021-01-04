import React, { useEffect } from "react";
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom";

type Post = {
	id: number,
	title: string,
	body: string,
	userId: number
};

function jsonResponseHandler(response: Response) {
	if (!response.ok) {
		throw new Error(`fetch failed: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

async function loadPosts(): Promise<Post[]> {
	return fetch('https://jsonplaceholder.typicode.com/posts/')
		.then(jsonResponseHandler)
	;
}

async function loadPost(id: number): Promise<Post> {
	return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
		.then(jsonResponseHandler)
	;
}

type WaitForProps<T> = {
	promise: Promise<T>;
	children: (loaded: T) => ReturnType<React.FunctionComponent>
}

function WaitFor<T>({promise, children}: WaitForProps<T>): ReturnType<React.FunctionComponent> {
	const [result, setResult] = React.useState<T | undefined>();
	const [error, setError] = React.useState<string | undefined>();

	useEffect(() => {
		let alive = true;
		promise
			.then(result => {
				if (alive) { 
					setResult(result) 
				};
			}).catch(reason => {
				if (alive) {
					if (reason instanceof Error) {
						setError(`${reason.name}: ${reason.message}`);
					}
					setError(String(reason));
				}
			})
		;
		return () => { alive = false; };
	}, [promise]);

	if (error != null) {
		return <p style={{color: 'red'}}>{error}</p>;
	}
	if (result == null) {
		return <p>loading...</p>;
	}
	return children(result);
}

function Index() {
	const { url } = useRouteMatch();
	return <div>
		<h2>Posts from https://jsonplaceholder.typicode.com/posts/</h2>
		<WaitFor promise={loadPosts()}>{(loadedPosts) => {
			return <ol>
				{loadedPosts.map(({ id, title }) => <li key={id}>
					<h3><Link to={`${url}/${id}`}>{title}</Link></h3>
				</li>)}
			</ol>;
		}}</WaitFor>
	</div>;
}

function Post() {
	const { postId } = useParams<{ postId: string }>();
	return <div>
		<WaitFor promise={loadPost(parseInt(postId,10))}>{({ title, body }) => {
			return <article>
				<h2>{title}</h2>
				<p>{body}</p>
			</article>
		}}</WaitFor>
	</div>;
}

export default function ApiDemo() {
	const { path, url } = useRouteMatch();
	return <>
		<h1>API usage demo</h1>
		<Switch>
			<Route path={`${path}/:postId`}>
				<div><Link to={`${url}`}>&lt; retour</Link></div>
				<Post />
			</Route>
			<Route path={`${path}`} component={Index} />
			<Route>Oups, not found</Route>
		</Switch>
	</>;
}
