import React from 'react';

function TimeComponent(props) { //stateless functional component yo
	return (
		<div className="col-xs-4 form-group">
		<input className="form-control" onChange={props.onChange} type="number" name={props.name} placeholder={props.abbrev} min="1" max={props.name==="hundredths" ? "99" : "59"}  />
		</div>
	);
}

var factors = { minutes : 60000,
			    seconds : 1000,
			    hundredths : 10 };

export default class TimeTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minutes : 0,
			seconds : 0,
			hundredths : 0,
			millis : 0
		};
		this.handleChange = this.handleChange.bind(this);
	}



	handleChange(event) {
		var ev = event.nativeEvent;
		console.log(ev.target.name + " changed to " + ev.target.value + ", max: " + ev.target.max);
		if(ev.target.name !== "minutes") {
			ev.target.value = ("0" + Number(ev.target.value)).slice(-2);
		}
		this.setState(() => ({
			[ev.target.name] : ev.target.value 
		}), this.sumMillis);
	}

	sumMillis() {
		this.setState(() => ({
			millis : (this.unitToMillis("minutes") + this.unitToMillis("seconds") + this.unitToMillis("hundredths"))
		}), this.reportMillis);
	}

	reportMillis() {
		this.props.callback("goalMillis", this.state.millis)
		console.log("MILLIS: "+this.state.millis);
		console.log("Readable: "+new Date(this.state.millis).toISOString().slice(11, -1))
	}

	unitToMillis(unit) {
		console.log("Converting " + unit + ": " + this.state[unit] +"*"+factors[unit]);
		return this.state[unit]*factors[unit];
	}

	 render() {
	 	return (
	 		<div className="timeTable">
	 			
	 			
		 			<div className="form-group ">

		 				<form className="">
		 					<label className="control-label">Goal Time:</label>
		 					<div className="form-group">
					 			<TimeComponent onChange={this.handleChange} name="minutes" abbrev="Min" />
					 			<TimeComponent onChange={this.handleChange} name="seconds" abbrev="Sec"/>
					 			<TimeComponent onChange={this.handleChange} name="hundredths" abbrev="MS"/>
				 			</div>
			 			</form>
		 			</div>
	 		
	 		</div>
			 	
			 	
	 );
	}
}