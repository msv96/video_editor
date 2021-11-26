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
import "rc-slider/assets/index.css";
import DownloadVideo from "./DownloadVideo";
import Cutclips from "./Cutclips";

class VideoEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			playing: false,
			muted: false,
			played: 0,
			duration: 0,
			videoReady: false,
			downloadVideo: [],
			timings: [],
			start: 0,
			end: 0,
			isConverting: false,
		};
	}
	ffmpeg = createFFmpeg({ log: true });
	componentDidMount = () => {
		this.loaded();
	};
	converter = async () => {
		this.setState({ isConverting: true });
		this.ffmpeg.FS(
			"writeFile",
			"test.mp4",
			await fetchFile(this.props.video_file[0])
		);
		for await (let el of this.state.timings) {
			let d1 = (((el.end - el.start) / 100) * this.state.duration)
				.toFixed(1)
				.toString();
			let d2 = ((el.start / 100) * this.state.duration)
				.toFixed(1)
				.toString();
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
		this.setState({ videoReady: true, isConverting: false });
	};
	exportOne = async (id) => {
		this.setState({ isConverting: true });
		this.ffmpeg.FS(
			"writeFile",
			"test.mp4",
			await fetchFile(this.props.video_file[0])
		);
		for await (let el of this.state.timings) {
			if (id === el.id) {
				let d1 = (((el.end - el.start) / 100) * this.state.duration)
					.toFixed(1)
					.toString();
				let d2 = ((el.start / 100) * this.state.duration)
					.toFixed(1)
					.toString();
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
		}
		this.setState({ videoReady: true, isConverting: false });
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
	clips = () => {
		let random = Math.floor(Math.random() * 10000);
		if (this.state.timings.length === 0) {
			this.setState({
				timings: [
					{
						id: random,
						start: this.state.start,
						end: this.state.end,
					},
				],
			});
		} else {
			this.setState({
				timings: [
					...this.state.timings,
					{
						id: random,
						start: this.state.start,
						end: this.state.end,
					},
				],
			});
		}
	};
	Duration = (seconds) => {
		const date = new Date(seconds * 1000);
		const hh = ("0" + date.getUTCHours()).slice(-2);
		const mm = ("0" + date.getUTCMinutes()).slice(-2);
		const ss = ("0" + date.getUTCSeconds()).slice(-2);
		return `${hh}:${mm}:${ss}`;
	};
	remove = (id) => {
		let filtered = this.state.timings.filter((e) => e.id !== id);
		this.setState({ timings: filtered });
	};
	start = () => {
		this.setState({
			start: this.state.played * 100,
			playing: true,
		});
	};
	end = () => {
		this.setState({
			end: this.state.played * 100,
			playing: false,
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
								? "mainControls Dark"
								: "mainControls"
						}
					>
						<div className="progress">
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
								<span>
									{this.Duration(this.state.duration)}
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
								<button
									title="Start Clipping"
									className="clipBtn"
									onClick={this.start}
								>
									START REC
								</button>
								<button
									title="Stop Clipping"
									className="clipBtn"
									onClick={this.end}
								>
									STOP REC
								</button>
							</div>
							<div className="cutVideo">
								<button
									title="Add Clips"
									className="trim-control"
									onClick={this.clips}
									disabled={this.state.end === 0 || this.state.isConverting}
								>
									ADD CLIP
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
                    "EXPORT ALL"
                  )}
								</button>
							</div>
						</div>
						<div className="multipleClips">
							{this.state.timings.length === 0
								? ""
								: this.state.timings.map((el) => {
										return (
											<Cutclips
												key={el.id + "_clip"}
												id={el.id}
												start={el.start}
												end={el.end}
												duration={this.state.duration}
												playing={this.state.playing}
												timings={this.state.timings}
												remove={this.remove.bind(this)}
												exportOne={this.exportOne.bind(
													this
												)}
                        isConverting={this.state.isConverting}
											/>
										);
								  })}
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
	};
}

export default VideoEditor;
