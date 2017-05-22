import React, { Component } from 'react';
import URLSearchParams from 'url-search-params';


class Opening extends Component {
  constructor() {
    super()
    const params = new URLSearchParams(window.location.search);
    this.colors = new Map();
    this.colors.set("red", "rgba(255, 0, 0, 0.1)");
    this.colors.set("green", "rgba(0, 255, 0, 0.1)");
    this.colors.set("blue", "rgba(0, 0, 255, 0.1)");
    this.colors.set("orange", "rgba(255, 180, 0, 0.1)");
    this.colors.set("yellow", "rgba(255, 255, 0, 0.1)");
    this.colors.set("purple", "rgba(255, 0, 255, 0.1)");
    this.modes = ["detection", "segmentation"];

    var color_disabled = false;
    var start_color = "red";
    if (params.has("color") && this.colors.has(params.get("color"))) {
      start_color = params.get("color");
      color_disabled = true;
    }

    var mode_disabled = false;
    var start_mode = "detection";
    if (params.has("mode") && this.modes.indexOf(params.get("mode")) >= 0) {
      start_mode = params.get("mode");
      mode_disabled = true;
    }

    this.state = {
      color: start_color,
      mode: start_mode,
      files: [],
      mode_disabled: mode_disabled,
      color_disabled: color_disabled
    }
  }

  handleModeChange(e) {
    this.setState({mode: e.target.value})
  }

  handleColorChange(e) {
    this.setState({color: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.files.length < 1) {
      alert("You must select one or more files")
    }
    else {
      const data = {
        "color": this.colors.get(this.state.color),
        "mode": this.state.mode,
        "files": this.state.files
      }
      this.props.onSubmit(data);
    }
  }

  handleFileChange(e) {
    const imageType = /^image\//
    const files = e.target.files

    var farr = [];
    for (var i = 0; i < files.length; i++) {
      if (!imageType.test(files[i].type)) {
        console.warn(files[i].name + " is not an image");
        continue
      }
      farr.push(files[i])
    }

    this.setState({files: farr})
  }

  render() {
    const color_lis = [];
    for (let val of this.colors.entries()) {
      color_lis.push(<option key={val[0]} value={val[0]}>{val[0]}</option>)
    }

    const mode_lis = this.modes.map((v) => <option key={v} value={v}>{v}</option>);

    return (
      <form>
        <div className="form-group">
          <label htmlFor="color-select">Color</label>
          <select disabled={this.state.color_disabled} className="form-control" id="color-select"
            value={this.state.color} onChange={(e) => this.handleColorChange(e)}>
            {color_lis}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="mode-select">Mode</label>
          <select disabled={this.state.mode_disabled} className="form-control" id="mode-select"
            value={this.state.mode} onChange={(e) => this.handleModeChange(e)}>
            {mode_lis}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="exampleSelect1">Files</label>
          <input type="file" id="input" multiple onChange={(e) => this.handleFileChange(e)}/>
        </div>
            <button type="submit" className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>Submit</button>
      </form>
    )
  }
}

export default Opening
