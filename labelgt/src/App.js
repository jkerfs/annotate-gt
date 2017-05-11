import React, { Component } from 'react';
import './App.css';
import Opening from './Opening'
import Canvas from './Canvas'
import Finalize from './Finalize'
import JSZip from "jszip"

class App extends Component {
  constructor() {
    super()
    this.state = {
      comp: "Opening",
      text: ""
    }
  }

  handleStart(state) {
    this.setState({comp: "Canvas"})
    this.setState({color: state.color})
    this.setState({mode: state.mode})
    this.setState({files: state.files})
  }

  handleFinish(o) {
    this.setState({text: o})
    this.setState({comp: "Finish"})
  }

  handleRestart() {
    this.setState({comp: "Opening"})
  }

  render() {
    var body;
    if (this.state.comp === "Canvas") {
      console.log("Starting Canvas")
      body = <Canvas mode={this.state.mode} color={this.state.color}
        files={this.state.files} finish={(txt) => this.handleFinish(txt)}/>
    }
    else if (this.state.comp === "Finish") {
      body = <Finalize restart={() => this.handleRestart()} text={this.state.text}/>
    }
    else {
      body = <Opening onSubmit={(state) => this.handleStart(state)} />
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>Strawberry Image Labeler</h2>
        </div>
        <div className="ui-holder">
        { body }
        </div>
      </div>
    );
  }
}

export default App;
