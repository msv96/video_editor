import React from "react";
import VideoEditor from "./VideoEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isUpload: true,
			videoUrl: "",
			isDarkMode: false,
			video_file: undefined,
		};
	}

	componentDidMount = () => {
		this.toggleThemes();
	};

	toggleThemes = () => {
		if (this.state.isDarkMode) {
			document.body.style.backgroundColor = "#1f242a";
			document.body.style.color = "#fff";
		} else {
			document.body.style.backgroundColor = "#fff";
			document.body.style.color = "#1f242a";
		}
		this.setState({ isDarkMode: !this.state.isDarkMode });
	};

	upload_file = (fileInput) => {
		this.setState({
			isUpload: false,
			videoUrl: window.URL.createObjectURL(fileInput[0]),
			video_file: fileInput,
		});
	};

	render = () => {
		return (
			<div>
				{this.state.isUpload ? (
					<div className={"wrapper"}>
						<input
							onChange={(e) => this.upload_file(e.target.files)}
							type="file"
							className="hidden"
							id="up_file"
						/>
						<div
							className="file-drop"
							onClick={() =>
								document.getElementById("up_file").click()
							}
						>
							<div className="file-drop-target">
								Click to upload your video and edit!
							</div>
						</div>
					</div>
				) : (
					<VideoEditor
						videoUrl={this.state.videoUrl}
						video_file={this.state.video_file}
					/>
				)}
				<div className={"theme_toggler"} onClick={this.toggleThemes}>
					{this.state.isDarkMode ? (
						<i className="toggle" aria-hidden="true">
							<FontAwesomeIcon icon={faSun} />
						</i>
					) : (
						<i className="toggle">
							<FontAwesomeIcon icon={faMoon} />
						</i>
					)}
				</div>
			</div>
		);
	};
}

export default App;
