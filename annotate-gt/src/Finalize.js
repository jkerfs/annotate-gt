import React, { Component } from 'react';
import FileSaver from "file-saver"


class Finalize extends Component {
  constructor() {
    super()
  }

  getZip() {
    const zip = this.props.data.zip;
    zip.generateAsync({type:"blob"})
    .then((content) => {
        FileSaver.saveAs(content, "masks.zip");
    });
  }

  getJs() {
    const text = JSON.stringify(this.props.data.js, null, '\t');
    const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "results.json")
  }

  render() {
    return (
      <div>
        <h1>Finished</h1>
        <button className="btn btn-success" onClick={() => this.getJs()}>Download JSON</button><br/>
        <button className="btn btn-primary" onClick={() => this.getZip()}>Download ZIP</button><br/>
        <button className="btn btn-warning" onClick={() => this.props.restart()}>Restart</button>
      </div>
    )
  }
}

export default Finalize;
