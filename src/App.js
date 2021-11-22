import React from "react";
import VideoEditor from "./VideoEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSun,
	faMoon,
	faPlusCircle,
	faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isUpload: true,
			videoUrl: "",
			isDarkMode: true,
			video_file: undefined,
		};
	}

	componentDidMount = () => {
		this.toggleThemes();
	};

	toggleThemes = () => {
		if (this.state.isDarkMode) {
			document.body.style.backgroundColor = "#fff";
			document.body.style.color = "#1f242a";
		} else {
			document.body.style.backgroundColor = "#1f242a";
			document.body.style.color = "#fff";
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
				<div className="head">Video Editor</div>
				{this.state.isUpload ? (
					<div className="choose">
						<label htmlFor="up_file" className="file-drop">
							<input
								onChange={(e) =>
									this.upload_file(e.target.files)
								}
								type="file"
								id="up_file"
								accept=".3gp,.flv,.mp4,.avi,.mkv,.vob"
							/>
							<FontAwesomeIcon icon={faPlusCircle} id="plus" />
							Choose file
						</label>
						<div className="dropDownMenu">
							<button type="submit" className="dropBtn">
								<FontAwesomeIcon
									icon={faChevronDown}
									id="down"
								/>
							</button>
							<div className="dropMenus">
								<div className="menus">
									<img
										src="./drive.svg"
										alt="drive"
										className="img"
									/>
									<span className="span">Google Drive</span>
								</div>
								<div className="menus">
									<img
										src="./dropbox.svg"
										alt="drive"
										className="img"
									/>
									<span className="span">Dropbox</span>
								</div>
							</div>
						</div>
					</div>
				) : (
					<VideoEditor
						videoUrl={this.state.videoUrl}
						video_file={this.state.video_file}
						darkMode={this.state.isDarkMode}
					/>
				)}
				<div className={"theme_toggler"} onClick={this.toggleThemes}>
					{this.state.isDarkMode ? (
						<i className="toggle" aria-hidden="true">
							<FontAwesomeIcon icon={faMoon} />
						</i>
					) : (
						<i className="toggle">
							<FontAwesomeIcon icon={faSun} />
						</i>
					)}
				</div>
			</div>
		);
	};
}

export default App;
