import React from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faVolumeMute,
	faVolumeUp,
	faPause,
	faPlay,
} from "@fortawesome/free-solid-svg-icons";
import DownloadVideo from "./DownloadVideo";
import { Rnd } from "react-rnd";
import ReactPlayer from "react-player";

class CropEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isMask: false,
			playing: false,
			muted: false,
			played: 0,
			duration: 0,
			videoReady: false,
			downloadVideo: [],
			cx: 0,
			cy: 0,
			x: 0,
			y: 0,
			width: 640,
			height: 360,
			defaultWidth: 180,
			defaultHeight: 320,
			fx: 0,
			fy: 0,
			isConverting: false,
		};
	}
	ffmpeg = createFFmpeg({ log: true });
	componentDidMount = () => {
		this.loaded();
		this.setState({
			cx: this.state.defaultWidth,
			cy: this.state.defaultHeight,
			fx: this.props.width / this.state.width,
			fy: this.props.height / this.state.height,
		});
	};
	converter = async () => {
		this.setState({ isConverting: true });
		this.ffmpeg.FS(
			"writeFile",
			"test.mp4",
			await fetchFile(this.props.video_file[0])
		);
		let d = this.state.duration.toFixed(1).toString();
		let cx = parseInt(this.state.cx * this.state.fx);
		let cy = parseInt(this.state.cy * this.state.fy);
		let x = parseInt(this.state.x * this.state.fx);
		let y = parseInt(this.state.y * this.state.fy);
		await this.ffmpeg.run(
			"-ss",
			"0.0",
			"-i",
			"test.mp4",
			"-t",
			`${d}`,
			"-vf",
			`crop=${cx}:${cy}:${x}:${y}`,
			"-f",
			"mp4",
			`output.mp4`
		);
		const output_video = this.ffmpeg.FS("readFile", `output.mp4`);
		const video_url = URL.createObjectURL(
			new Blob([output_video.buffer], { type: "video/mp4" })
		);
		this.setState({
			downloadVideo: [...this.state.downloadVideo, video_url],
			videoReady: true,
			isConverting: false,
		});
	};
	loaded = async () => {
		await this.ffmpeg.load();
	};
	handlePlay = () => {
		this.setState({ playing: true });
	};
	handlePause = () => {
		this.setState({ playing: false });
	};
	handlePlayPause = () => {
		this.setState({ playing: !this.state.playing });
	};
	handleToggleMuted = () => {
		this.setState({ muted: !this.state.muted });
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
		console.log(player);
	};
	Duration = (seconds) => {
		const date = new Date(seconds * 1000);
		const hh = ("0" + date.getUTCHours()).slice(-2);
		const mm = ("0" + date.getUTCMinutes()).slice(-2);
		const ss = ("0" + date.getUTCSeconds()).slice(-2);
		return `${hh}:${mm}:${ss}`;
	};
	masks = () => {
		this.setState({
			isMask: !this.state.isMask,
		});
	};
	render() {
		return (
			<>
				<div className="crop">
					<div className="video1">
						<div className="video2">
							<ReactPlayer
								ref={this.ref}
								url={this.props.videoUrl}
								width={this.state.width}
								height={this.state.height}
								playing={this.state.playing}
								muted={this.state.muted}
								onPlay={this.handlePlay}
								onPause={this.handlePause}
								onClick={this.handlePlayPause}
								onProgress={this.handleProgress}
								onDuration={this.handleDuration}
							/>
							{this.state.isMask ? (
								<div className="bgHide">
									<Rnd
										bounds=".video1"
										style={{
											border: "2px solid white",
											boxShadow:
												"0 0 0 999px hsla(0, 0%, 0%, 0.6)",
										}}
										default={{
											x: 0,
											y: 0,
											width: this.state.defaultWidth,
											height: this.state.defaultHeight,
										}}
										lockAspectRatio={9 / 16}
										onResizeStop={(
											e,
											direction,
											ref,
											delta,
											position
										) => {
											this.setState({
												cx: ref.offsetWidth,
												cy: ref.offsetHeight,
												x: position.x,
												y: position.y,
											});
										}}
										onDragStop={(e, direction) => {
											this.setState({
												x: direction.x,
												y: direction.y,
											});
										}}
									/>
								</div>
							) : (
								""
							)}
						</div>
					</div>
					<div className="wrap">
						<input
							type="range"
							min={0}
							max={0.999999}
							step={0.01}
							value={this.state.played}
							onMouseDown={this.handleSeekMouseDown}
							onChange={this.handleSeekChange}
							onMouseUp={this.handleSeekMouseUp}
						/>
						<div className="displayTime">
							<span>
								{this.Duration(
									this.state.duration * this.state.played
								)}
							</span>
							<span>{this.Duration(this.state.duration)}</span>
						</div>
					</div>
					<div className="controls wrap">
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
						<div className="cutVideo">
							<button
								title="Add Clips"
								className="trim-control"
								onClick={this.masks}
								disabled={this.state.isConverting}
							>
								{this.state.isConverting ? (
									<div className="loader"></div>
								) : this.state.isMask ? (
									"DELETE MASK"
								) : (
									"ADD MASK"
								)}
							</button>
							<button
								title="Convert Video"
								className="convert"
								onClick={this.converter}
								disabled={this.state.isConverting}
							>
								{this.state.isConverting ? (
									<div className="loader"></div>
								) : (
									"CONVERT"
								)}
							</button>
						</div>
					</div>
				</div>
				{this.state.videoReady ? (
					<DownloadVideo downloadVideo={this.state.downloadVideo} />
				) : (
					""
				)}
			</>
		);
	}
}

export default CropEditor;
