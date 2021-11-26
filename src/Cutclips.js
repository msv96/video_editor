import React from "react";
import { Range } from "rc-slider";

class Cutclips extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: this.props.start,
			end: this.props.end,
		};
	}
	Duration = (seconds) => {
		const date = new Date(seconds * 1000);
		const hh = ("0" + date.getUTCHours()).slice(-2);
		const mm = ("0" + date.getUTCMinutes()).slice(-2);
		const ss = ("0" + date.getUTCSeconds()).slice(-2);
		return `${hh}:${mm}:${ss}`;
	};
	time = (el, id) => {
		this.setState(
			{
				start: el[0],
				end: el[1],
			},
			() => {
				let index = this.props.timings.findIndex((e) => e.id === id);
				let data = this.props.timings;
				data[index].start = el[0];
				data[index].end = el[1];
				this.setState({
					timings: [...data],
				});
			}
		);
	};
	render() {
		return (
			<div style={{ width: "95%", margin: "25px 10px" }}>
				<Range
					allowCross={false}
					step={0.1}
					value={[this.state.start, this.state.end]}
					pushable={1}
					railStyle={{
						backgroundColor: "lightgrey",
						borderRadius: "3px",
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
					onChange={(el) => this.time(el, this.props.id)}
				/>
				<div className="displayTime marginTop">
					<div>
            <span className="time">
							{this.Duration(
								(this.props.duration * this.state.start) / 100
							)}
						</span>
						/
						<span className="time">
							{this.Duration(
								(this.props.duration * this.state.end) / 100
							)}
						</span>
					</div>
					<div>
						<button
							title="Delete"
							className="trim"
							onClick={() => this.props.remove(this.props.id)}
              disabled={this.props.isConverting}
            >
              {this.props.isConverting ? (
                <div className="loader"></div>
              ) : (
                "Delete"
              )}
						</button>
						<button
							title="Delete"
							className="convert"
							onClick={() => this.props.exportOne(this.props.id)}
              disabled={this.props.isConverting}
            >
              {this.props.isConverting ? (
                <div className="loader"></div>
              ) : (
                "Export"
              )}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Cutclips;
