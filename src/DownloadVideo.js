import React from "react";

function DownloadVideo({ downloadVideo }) {
	return (
		<div className="download_video">
			{downloadVideo.map((e, i) => {
				return (
					<video
						width="480"
						height="270"
						controls
						controlsList="noplaybackrate"
						disablePictureInPicture
						key={"video" + i}
					>
						<source src={e} type="video/mp4" />
					</video>
				);
			})}
		</div>
	);
}

export default DownloadVideo;
