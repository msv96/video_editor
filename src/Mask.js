import React, { useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";

function Mask(props) {
	const mask = useRef();
	const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
	const bind = useDrag(({ down, offset: [ox, oy] }) =>
		api.start({ x: ox, y: oy, immediate: down })
	);
	let position = () => {
		let video = props.playVideo.current.getBoundingClientRect();
		let maskAxis = mask.current.getBoundingClientRect();
		let x0 = Math.floor(maskAxis.left - video.left);
		let y0 = Math.floor(maskAxis.top - video.top);
		let x1 = Math.floor(video.width - maskAxis.width);
		let y1 = Math.floor(video.height - maskAxis.height);
		if (x0 < 0) {
			props.maskDimensions.x = 0;
		} else if (x0 >= x1) {
			props.maskDimensions.x = x1;
		} else {
			props.maskDimensions.x = x0;
		}
		if (y0 < 0) {
			props.maskDimensions.y = 0;
		} else if (y0 >= y1) {
			props.maskDimensions.y = y1;
		} else {
			props.maskDimensions.y = y0;
		}
	};
	return (
		<div className="Main">
			<animated.div
				className="mask"
				{...bind()}
				ref={mask}
				onMouseUp={position}
				style={{
					x: x,
					y: y,
					touchAction: "none",
				}}
			></animated.div>
		</div>
	);
}

export default Mask;
