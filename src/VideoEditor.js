import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faVolumeMute,
	faVolumeUp,
	faPause,
	faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import ReactPlayer from "react-player";
import Duration from "./Duration";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

class VideoEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			playing: false,
			volume: 1,
			muted: false,
			played: 0,
			duration: 0,
			videoReady: false,
			downloadVideo: [],
			timings: [
				{
					start: 0,
					end: 0,
				},
			],
		};
	}
	ffmpeg = createFFmpeg({ log: true });
	componentDidMount = () => {
		this.loaded();
	};
	converter = async () => {
		this.ffmpeg.FS(
			"writeFile",
			"test.mp4",
			await fetchFile(this.props.video_file[0])
		);
		for await (let el of this.state.timings) {
			let d1 = (el.end - el.start).toFixed(1).toString();
			let d2 = el.start.toFixed(1).toString();
			await this.ffmpeg.run(
				"-ss",
				d2,
				"-i",
				"test.mp4",
				"-t",
				d1,
				"-f",
				"mp4",
				`${d1}.mp4`
			);
			const output_video = this.ffmpeg.FS("readFile", `${d1}.mp4`);
			const video_url = URL.createObjectURL(
				new Blob([output_video.buffer], { type: "video/mp4" })
			);
			this.setState({
				downloadVideo: [...this.state.downloadVideo, video_url],
			});
		}
		this.setState({ videoReady: true });
	};
	loaded = async () => {
		await this.ffmpeg.load();
	};
	handlePlayPause = () => {
		this.setState({ playing: !this.state.playing });
	};
	handleVolumeChange = (e) => {
		this.setState({ volume: parseFloat(e.target.value) });
	};
	handleToggleMuted = () => {
		this.setState({ muted: !this.state.muted });
	};
	handlePlay = () => {
		this.setState({ playing: true });
	};
	handlePause = () => {
		this.setState({ playing: false });
	};
	handleSeekMouseDown = (e) => {
		this.setState({ seeking: true });
		this.player.seekTo(parseFloat(e.target.value));
	};
	handleSeekChange = (e) => {
		this.setState({ played: parseFloat(e.target.value) });
	};
	handleSeekMouseUp = (e) => {
		this.setState({ seeking: false });
		this.player.seekTo(parseFloat(e.target.value));
	};
	handleProgress = (state) => {
		this.setState(state);
	};
	handleDuration = (duration) => {
		this.setState({ duration });
	};
	ref = (player) => {
		this.player = player;
	};
	new = (e) => {
		this.setState({
			timings: [
				{
					start: (e[0] * this.state.duration) / 100,
					end: (e[1] * this.state.duration) / 100,
				},
			],
		});
	};

	render = () => {
		return (
			<>
				<div className="wrapper">
					<ReactPlayer
						className="video"
						ref={this.ref}
						url={this.props.videoUrl}
						playing={this.state.playing}
						volume={this.state.volume}
						muted={this.state.muted}
						onPlay={this.handlePlay}
						onPause={this.handlePause}
						onClick={this.handlePlayPause}
						onProgress={this.handleProgress}
						onDuration={this.handleDuration}
					/>
					<div
						className={
							this.props.darkMode
								? "mainControls"
								: "mainControls Dark"
						}
					>
						<div className="progress">
							<input
								className="slider"
								type="range"
								min={0}
								max={0.999999}
								step="any"
								value={this.state.played}
								onMouseDown={this.handleSeekMouseDown}
								onChange={this.handleSeekChange}
								onMouseUp={this.handleSeekMouseUp}
							/>
							<div className="displayTime">
								<span className="time">
									<Duration
										seconds={
											this.state.duration *
											this.state.played
										}
									/>
								</span>
								<span className="time">
									<Duration seconds={this.state.duration} />
								</span>
							</div>
						</div>
						<div className="controls">
							<div className="player-controls">
								<button
									className="play-control"
									title="Play/Pause"
									onClick={this.handlePlayPause}
								>
									{this.state.playing ? (
										<FontAwesomeIcon icon={faPause} />
									) : (
										<FontAwesomeIcon icon={faPlay} />
									)}
								</button>
							</div>
							<div className="player-controls">
								<button
									className="play-control"
									title="Mute/Unmute Video"
									onClick={this.handleToggleMuted}
								>
									{this.state.muted ? (
										<FontAwesomeIcon icon={faVolumeMute} />
									) : (
										<FontAwesomeIcon icon={faVolumeUp} />
									)}
								</button>
							</div>
							<div>
								<label htmlFor="volume">Volume</label>
								<input
									id="volume"
									type="range"
									min={0}
									max={1}
									step="any"
									value={this.state.volume}
									onChange={this.handleVolumeChange}
									onProgress={this.handleProgress}
								/>
							</div>
							<div>
								<button title="Add" className="trim-control">
									ADD CLIP
								</button>
							</div>
							<div>
								<button
									title="Convert Video"
									className="convert"
									onClick={this.converter}
								>
									CUT VIDEO
								</button>
							</div>
						</div>
						<div className="multipleClips">
							<div style={{ width: "100%", height: 50 }}>
								<Range
									allowCross={false}
									defaultValue={[10, 20]}
									pushable={1}
									railStyle={{
										backgroundColor: "lightgrey",
										borderRadius: "0px",
										height: "10px",
									}}
									trackStyle={[
										{
											backgroundColor: "red",
											borderRadius: "0px",
											height: "10px",
										},
									]}
									handleStyle={[
										{
											backgroundColor: "white",
											border: "none",
											height: "20px",
											width: "20px",
											boxShadow: "none",
										},
										{
											backgroundColor: "white",
											border: "none",
											height: "20px",
											width: "20px",
											boxShadow: "none",
										},
									]}
									onChange={(e) => this.new(e)}
								/>
								<div className="displayTime marginTop">
									<button title="Delete" className="trim">
										DELETE CLIP
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.state.videoReady ? (
					<div className="download_video">
						{this.state.downloadVideo.map((e, i) => {
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
				) : (
					""
				)}
			</>
		);
	};
}

export default VideoEditor;
