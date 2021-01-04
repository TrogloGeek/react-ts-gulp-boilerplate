import Slider from './lib/comp/Slider';
import React from 'react';
import ReactDOM from 'react-dom';
import { requireElementWithId } from './lib/DOMUtil';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import ApiDemo from './ApiDemo';

function SimpleCounter() {
	const [count, setCount] = React.useState(0);
	return <div>
		You clicked {count} times.
		<button type="button" onClick={() => setCount(count + 1)}>click me!</button>
	</div>
}

function SliderDemo() {
	const [value, setValue] = React.useState(5);

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { currentTarget: input } = event;
		if (input.checkValidity()) {
			setValue(input.valueAsNumber);
		}
	}
	
	return <>
		<h1>Slider demo</h1>
		<input type="number" min={0} max={10} step={.1} value={value} onChange={handleInputChange} />
		<Slider min={0} max={10} step={.1} value={value} onChanged={setValue} />
	</>;
}

function Application() {
	return <BrowserRouter>
		<div className="header">
			<h1>My application</h1>
		</div>
		<div className="sidebar">
			<ul>
				<li><NavLink to="/counter">Simple counter</NavLink></li>
				<li><NavLink to="/slider">Slider component</NavLink></li>
				<li><NavLink to="/api">API usage example</NavLink></li>
			</ul>
		</div>
		<div className="main">
			<Switch>
				<Route path="/counter" component={SimpleCounter} />
				<Route path="/slider" component={SliderDemo} />
				<Route path="/api" component={ApiDemo} />
			</Switch>
		</div>
	</BrowserRouter>;
}

ReactDOM.render(<Application />, requireElementWithId('app-root'));
