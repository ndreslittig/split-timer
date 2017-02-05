import React from 'react';

function milliToTime(t) {
    return new Date(t).toISOString().slice(15, -1);
  // var mils = t % 1000;
  // t = (t - mils) / 1000;
  // var secs = t % 60;
  // t = (t - secs) / 60
}

function successOrDanger(t) {
	return  t < 0 ? "list-group-item-success" : "list-group-item-danger";
}

function splitMilliToTime(t) {
    var out = "";
    if(t < 0) {
      out += "-"
      t*=-1;
    } else out += "+";
    return out+new Date(t).toISOString().slice(15, -1);
}

// function milliToTime(t) {
// 	var factors = [60000, 1000, 10]
// 	var out = "";
// 	for(var i = 0; i < factors.length; i++) {
// 		out += t%factors[i];
// 		t/=factors[i];
// 		out += ":";
// 	}

// }

function Split(props) { //stateless functional component yo
	return (
		<tr>
			<th scope="row">{props.index}</th>
			<td className={successOrDanger(props.splitDifference)}>{milliToTime(props.splitTime)}</td>
			<td className={successOrDanger(props.splitDifference)}>{splitMilliToTime(props.splitDifference)}</td>
			<td className={successOrDanger(props.elapsedDifference)}>{milliToTime(props.elapsedTime)}</td>
			<td className={successOrDanger(props.elapsedDifference)}>{splitMilliToTime(props.elapsedDifference)}</td>
		</tr>
	);
}

export default class SplitTable extends React.Component {

	 render() {
	 	return (
	 			<div className="panel panel-default">
	 			<div className="panel-heading">Splits</div>
	 			<table className="table">
	 			
	 			<thead>
		 			<tr>
		 				<th></th>
		 				<th>Split Time</th>
			 			<th>Split Difference</th>
			 			<th>Total Time</th>
			 			<th>Total Difference</th>	
		 			</tr>
	 			</thead>
	 			<tbody>
			 		{this.props.splits.map(item => {
			 		//<li key={item.index}>{item.time}</li>
			 			//we do math for things that can change, everything else passed down from app
			 			return <Split index={item.index}  splitTime={item.splitTime} splitDifference={item.splitTime-item.pace} elapsedTime={item.elapsedTime} elapsedDifference={item.elapsedDifference} pace={item.pace} />
			 		})}
			 	</tbody>
			 	</table>
			 	</div>
			 	
			 	
	 );
	}
}