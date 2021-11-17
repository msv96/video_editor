import React from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";

function Mask() {
	const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
	const bind = useDrag(
		({ down, offset: [ox, oy] }) => api.start({ x: ox, y: oy, immediate: down }),
		{
			bounds: { left: 318, right: 1238, top: -2, bottom: 78 },
		}
	);
	return (
		<div className="Main">
			<animated.div
				className="mask"
				{...bind()}
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
