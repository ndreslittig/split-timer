import React from 'react';

function milliToTime(t) {
	console.log("T is: ");
	console.log(t);
    return new Date(t).toISOString().slice(15, -1);
}

function LapInput(props) {
	return (
		<div className="form-group col-md-6">
			<label className="control-label">Distance Per Split:</label>
			<div className="input-group">
				<input type="number" className="form-control" placeholder="400" name="lapDistance" onChange={props.onChange} />
				<div className="input-group-addon">meters</div>
			</div>
		</div>
	);
}


function MeterInput(props) {
	return (
		<div className="form-group col-md-6">
			<label className="control-label">Race Distance:</label>
			<div className="input-group">
				<input type="number" className="form-control" name="raceDistance" onChange={props.onChange} />
				<div className="input-group-addon">meters</div>
			</div>
		</div>
	);
}

function CalculatedPace(props) {
	return (
		<div>
		<div className="col-xs-12">
			<label className="calculatedPace">Calculated Pace: <span className="mark">{milliToTime(props.pace)}</span> per <span className="mark">{props.lapDistance}m</span></label><br />
			<label className="calculatedPace">{props.remainder > 0 ? "Then: "+milliToTime(props.remainderPace)+" for "+props.remainder+"m" : ""}</label>
		</div>
		<div className="clearfix"></div>
		</div>

	);
}

export default class TimeTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			numLaps : 0,
			calculatedPace : 0,
			raceDistance: 0,
			lapDistance : 400,
			remainder: 0,
			readablePace: ""
		};
		this.handleChange = this.handleChange.bind(this);
	}

	calculatePace() { //move up to app scope to allow for refreshing of pace info after changing either time or distance, not just distance
		if(this.props.totalTime > 0 && this.state.raceDistance > 0 && this.state.lapDistance > 0) {
			console.log(this.props.totalTime+ ", "+ this.state.raceDistance + ", "+ this.state.lapDistance);
			var remainder = this.state.raceDistance%this.state.lapDistance == 0 ? 0 : ((this.state.raceDistance-30) % this.state.lapDistance)+30; //account for mile+1500, quick way to get 1609m as 3x400m + 409m
			var rawPace = this.props.totalTime/this.state.raceDistance;
			this.setState(() => ({
				numLaps : Math.floor((this.state.raceDistance-(remainder == 0 ? 0 : 10))/this.state.lapDistance),
				calculatedPace : this.state.lapDistance*rawPace,
				remainder : remainder,
				remainderPace : remainder*rawPace
			}), this.reportPace);
		} else {
			this.setState(() => ({
				calculatedPace : 0,
				lapDistance:400,
				remainderPace: 0,
				remainder : 0
			}), console.log("Some stuff is zeros. Didn't recalculate.") );
			
		}
			
	}

	reportPace() {
		this.props.callback("paceMillis", this.state.calculatedPace);
		this.props.callback("remainderPaceMillis", this.state.remainderPace);
		this.props.callback("numLaps", this.state.numLaps);
		console.log("Readable Pace per 400m: "+new Date(this.state.calculatedPace).toISOString().slice(14, -1))
		console.log("Remainder: " + this.state.remainder + "m at "+milliToTime(this.state.calculatedPace))
	}

	handleChange(event) {
		var ev = event.nativeEvent;
		console.log(ev.target.name + " changed to " + ev.target.value + ", max: " + ev.target.max);
		this.setState(() => ({
			[ev.target.name] : ev.target.value
		}), this.calculatePace);
	}


	render() {
		return (
			<div>
			<div className="form-group">		
					<MeterInput onChange={this.handleChange} />
					<LapInput onChange={this.handleChange} />
			</div>

			<CalculatedPace pace={this.state.calculatedPace} lapDistance={this.state.lapDistance} remainder={this.state.remainder} remainderPace={this.state.remainderPace} />
			</div>
		);

	}
}