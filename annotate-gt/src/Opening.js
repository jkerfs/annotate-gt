import React, { Component } from 'react';


class Opening extends Component {
  constructor() {
    super()
    this.state = {
      color: "rgba(255, 0, 0, 0.1)",
      mode: "detection",
      files: []
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
      this.props.onSubmit(this.state)
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
    return (
      <form>
        <div className="form-group">
          <label htmlFor="exampleSelect1">Color</label>
          <select className="form-control" id="color-select"
            value={this.state.color} onChange={(e) => this.handleColorChange(e)}>
            <option value="rgba(255, 0, 0, 0.1)">Red</option>
            <option value="rgba(0, 255, 0, 0.1)">Green</option>
            <option value="rgba(0, 0, 255, 0.1)">Blue</option>
            <option value="rgba(255, 180, 0, 0.1)">Orange</option>
            <option value="rgba(255, 255, 0, 0.1)">Yellow</option>
            <option value="rgba(255, 0, 255, 0.1)">Purple</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="exampleSelect1">Mode</label>
          <select className="form-control" id="type-select"
            value={this.state.mode} onChange={(e) => this.handleModeChange(e)}>
            <option value="detection">Detection</option>
            <option value="segmentation">Segmentation</option>
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
