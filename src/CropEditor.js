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
import { Rnd } from "react-rnd";

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
      res: {},
		};
		this.mains = React.createRef();
	}
	ffmpeg = createFFmpeg({ log: true });
	componentDidMount = () => {
		this.loaded();
    let resol = this.mains.current.getBoundingClientRect();
    this.setState({
      res: resol
    })
    console.log(this.props.width, this.props.height);
	};
	converter = async () => {
		this.ffmpeg.FS(
			"writeFile",
			"test.mp4",
			await fetchFile(this.props.video_file[0])
		);
		// let d = this.state.duration.toFixed(1).toString();
		let d = "5.0";
		let cx = this.state.cx * 2;
		let cy = this.state.cy * 2;
		let x = this.state.x;
		let y = this.state.y;
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
  resize = (e) => {
    console.log(e);
  }
  video = () => {
    console.log(this.mains.current.getBoundingClientRect());
    console.log(this.mains.current.duration);
    console.log(this.mains.current.height);
    console.log(this.mains.current.width);
  }
	render() {
		return (
			<>
				<div className="crop">
					<div className="video1">
						{/* <ReactPlayer
							className="vid"
							ref={this.ref}
							url={this.props.videoUrl}
							playing={this.state.playing}
							muted={this.state.muted}
							onProgress={this.handleProgress}
							onDuration={this.handleDuration}
						/> */}
            <video ref={this.mains} className="vide" controls width="640" height="360" muted={this.state.muted}>
              <source src={this.props.videoUrl} type="video/mp4" />
            </video>
						{this.state.isMask ? (
							<div className="bgHide">
								<Rnd
                  bounds=".vide"
                  style={{
                    border: "1px solid yellow",
                    boxShadow: "0 0 0 1999px hsla(0, 0%, 0%, 0.6)",
                  }}
									default={{
										x: 0,
										y: 0,
										width: 180,
										height: 320,
									}}
                  onResizeStop={this.resize}
                  onDragStop={this.resize}
                  lockAspectRatio={9/16}
								/>
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
          <button onClick={this.video}>click</button> 
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
