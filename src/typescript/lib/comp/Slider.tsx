import React from 'react';
import { identity, noop } from '../Functions';
import { usePropStateSyncedOnChange } from '../ReactUtil';
import { java } from '../TypeUtil';

function clamp(min: number, max: number, value: number) {
	return Math.min(max, Math.max(min, value));
}

function stepifier(min: number, max:number, step?: number) {
	if (step == null) return (v: number) => clamp(min, max, v);
	return (v: number)  =>  clamp(min, max, Math.round((v - min) / step) * step + min);
}

type SliderProps = {
	min: number,
	max: number,
	step?: number
	value: number,
	/** Notified while dragging slider cursor. */
	onChanging?: java.Consumer<number>,
	/** Notified on cursor release if new value differs from value prop. */
	onChanged?: java.Consumer<number>
};

export default function Slider(
	{min, max, step, value, onChanging = noop, onChanged = noop}: SliderProps	
) {
	if (!(Number.isFinite(min) && Number.isFinite(max) && min < max && (step == null || Number.isFinite(step)) && Number.isFinite(value) && min <= value && value <= max)) {
		throw new Error(`Invalid props: ${JSON.stringify({min, max, step, value})}`);
	}
	const range = max - min;
	const [currentValue, setCurrentValue] = usePropStateSyncedOnChange<number>(value);
	const [dragging, setDragging] = React.useState<boolean>(false);
	const rulerReference = React.useRef<HTMLDivElement>(null);

	function notifyCurrentValue(newValue: number) {
		setCurrentValue(newValue);
		onChanging(newValue);
	}
	const applyStep = stepifier(min, max, step);
	function updatePos(clientX: number) {
		const ruler = rulerReference.current;
		if (ruler != null) {
			const rulerBoundingBox = ruler.getBoundingClientRect();
			if (rulerBoundingBox.width > 0) {
				const pos = Math.max(0, Math.min(rulerBoundingBox.width, clientX - rulerBoundingBox.left));
				notifyCurrentValue(applyStep(pos / rulerBoundingBox.width * range + min));
			}
		}
	}

	React.useEffect(() => {
		if (dragging) {
			function stopDrag(event: MouseEvent) {
				setDragging(false);
			}
			function dragUpdate(event: MouseEvent) {
				updatePos(event.clientX);
			}
			document.addEventListener('mouseup', stopDrag);
			document.addEventListener('mousemove', dragUpdate);
			return () => {
				document.removeEventListener('mouseup', stopDrag);
				document.removeEventListener('mousemove', dragUpdate);
			};
		} else if (currentValue != value) {
			onChanged(currentValue);
		}
	}, [dragging, min, max, step]);

	function startDrag(event: React.MouseEvent) {
		if (event.button === 0) {
			event.preventDefault();
			setDragging(true);
			updatePos(event.clientX);
		}
	}

	const strValue = currentValue.toLocaleString();

	return <div className="slider">
		<div className="slider-bar" ref={rulerReference} onMouseDown={startDrag}>
			<div className={`slider-carret dragging-${dragging ? 'yes' : 'no'}`} style={{left: `${(currentValue - min) / range * 100}%`}} title={dragging ? undefined : strValue}>
				<div className="slider-carret-inner">
					<span className="slider-carret-value">{strValue}</span>
				</div>
			</div>
		</div>
	</div>;
}
