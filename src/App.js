import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SplitTable from './components/SplitTable'
import TimeTable from './components/TimeTable'
import PaceTable from './components/PaceTable'
import $ from 'jquery'

function milliToTime(t) {
    return new Date(t).toISOString().slice(14, -1);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {displayTime : '00:00.00', 
                  elapsedTime : 0,
                  elapsedGoal : 0,
                  currentLap : 0,
                  numLaps : 0,
                  goalMillis : 0,
                  paceMillis : 0,
                  remainderPaceMillis : 0,
                  splits : [],
                  timing : false,
                  start : null,
                };
    this.setStateViaChild = this.setStateViaChild.bind(this)
  }

  setStateDebug(key) {
    console.log(this.state.goalMillis);
  }

  setStateViaChild(key, value) {
    this.setState(() => ({
      [key] : value 
    }), this.setStateDebug);
  }

  
  
  start() {
      this.setState((prevState) => ({
        start : Date.now(),
        elapsedTime : 0,
        timing : true,
      }), function() {
        $('#controls').hide("fast");
      });
    this.interval = setInterval(() => {
      if(this.state.timing) {
        this.tick();
      }
    }, 20);
  }

  tick() {
    this.setState((prevState) => ({
      elapsedTime : (Date.now() - this.state.start),
      displayTime : milliToTime(Date.now() - this.state.start)
    }));
  }

  split() {
    //var splitTime = (this.state.splits.length > 1) ? (this.state.elapsedTime-this.state.splits[this.state.splits.length-1].elapsedTime) : this.state.elapsedTime ;
    //var nextReadable = milliToTime(next);

    //assign paces for either bulk of splits or last lap (remainder)
    this.setState((prevState) => ({
      splits : this.state.splits.concat([{index : prevState.currentLap + 1, 
                                          elapsedTime : this.state.elapsedTime,
                                          elapsedDifference : this.state.elapsedTime - (prevState.elapsedGoal + (prevState.currentLap < prevState.numLaps ? this.state.paceMillis : this.state.remainderPaceMillis)),
                                          //elapsedDifference : this.state.elapsedTime - (this.state.paceMillis*Math.min(prevState.currentLap + 1, prevState.numLaps) + Math.floor(prevState.currentLap + 1/prevState.numLaps)*this.state.remainderPaceMillis),
                                          pace : prevState.currentLap < prevState.numLaps ? this.state.paceMillis : this.state.remainderPaceMillis, 
                                          splitTime : (this.state.splits.length > 0) ? this.state.elapsedTime-prevState.splits[prevState.splits.length-1].elapsedTime : this.state.elapsedTime}]),
      currentLap : prevState.currentLap + 1,
      elapsedGoal : prevState.elapsedGoal + (prevState.currentLap < prevState.numLaps ? this.state.paceMillis : this.state.remainderPaceMillis)
    }), this.reportSplit);
  }

  reportSplit() {
    if(this.state.currentLap  === this.state.numLaps + (this.state.remainderPaceMillis === 0 ? 0 : 1)) {
      this.stop();
    }
    console.log("splits registered");
    console.log("That was lap: "+this.state.currentLap+" of "+this.state.numLaps+", elapsed: "+milliToTime(this.state.elapsedGoal));
  }

  stop() {
    this.setState(() => ({
      timing : false
    }), function() {
      $('#controls').show("fast");
    });
  }

  clear() {
    $(':input').val('');
    this.setState(() => ({
      displayTime : '00:00.00', 
      elapsedTime : 0,
      elapsedGoal : 0,
      currentLap : 0,
      numLaps : 0,
      goalMillis : 0,
      paceMillis : 0,
      remainderPaceMillis : 0,
      splits : [],
      timing : false,
      start : null,
    }), function() {
      console.log("Should be cleared.");
      this.refs.paceTable.calculatePace();
      $('#controls').show("fast");
    })
  }

  action() {
    return this.state.timing ? this.split() : this.start();
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <img width="40px" alt="Brand" src="http://grfx.cstv.com/schools/geot/graphics/geot-16-logo.png" />
            </a>
          </div>
        </div>
      </nav>
      
      <div className="">
      

      <div id="controls" className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <TimeTable callback={this.setStateViaChild} />
          <div className="clearfix"></div>
          <PaceTable ref="paceTable" callback={this.setStateViaChild} totalTime={this.state.goalMillis} /> 
        
      </div>
      <div className="clearfix"></div>
      <div className="">
          <div className="stopwatch">
              <h2 className="clock">{this.state.displayTime}</h2>
              <div className="btn-group btn-group-lg">
                  <button disabled={this.state.paceMillis > 0 ? "" : "disabled"} className="btn btn-success" onClick={() => this.action()} >
                      {this.state.timing ? "Split" : "Start Timer"}
                  </button>
                  <button disabled={(this.state.paceMillis > 0 && this.state.timing) ? "" : "disabled"} className="btn btn-danger" onClick={() => this.stop()} >Stop</button>
              </div>
              <div className="btn-group btn-group-lg col-xs-offset-1">
                  <button className="btn btn-info" onClick={() => this.clear()}>Clear</button>
              </div>
          </div>
          <SplitTable splits={this.state.splits} />
      </div>
      </div>
      </div>
    );
  }
}

export default App;
