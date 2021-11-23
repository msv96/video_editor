import React from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faVolumeMute,
	faVolumeUp,
	faPause,
	faPlay,
} from "@fortawesome/free-solid-svg-icons";
import DownloadVideo from "./DownloadVideo";

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
			resolution: {
				cx: 0,
				cy: 0,
				x: 0,
				y: 0,
			},
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
		// let d = this.state.duration.toFixed(1).toString();
		let d = "5.0";
		let cx = this.state.resolution.cx;
		let cy = this.state.resolution.cy;
		let x = this.state.resolution.x;
		let y = this.state.resolution.y;
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
		});
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
	Duration = (seconds) => {
		const date = new Date(seconds * 1000);
		const hh = date.getUTCHours();
		const mm = date.getUTCMinutes();
		const ss = ("0" + date.getUTCSeconds()).slice(-2);
		if (hh) {
			return `${hh}:${("0" + mm).slice(-2)}:${ss}`;
		}
		return `${mm}:${ss}`;
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
						<ReactPlayer
							className="vid"
							ref={this.ref}
							url={this.props.videoUrl}
							playing={this.state.playing}
							muted={this.state.muted}
							onProgress={this.handleProgress}
							onDuration={this.handleDuration}
              onReady={(e) => console.log(e)}
						/>
						{this.state.isMask ? (
							<div className="bgHide">
								<div className="mask"></div>
							</div>
						) : (
							""
						)}
					</div>
					<div className="wrap">
						<input
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
							>
								{this.state.isMask ? "DELETE MASK" : "ADD MASK"}
							</button>
							<button
								title="Convert Video"
								className="convert"
								onClick={this.converter}
							>
								CONVERT
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
