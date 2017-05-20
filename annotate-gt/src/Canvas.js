import React, { Component } from 'react';


class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      active: false,
      image_index: 0,
      image_name: "",
      done: false,
      snapshots: []
    }
  }

  componentDidMount() {
    this.LC = window.LC;

    var ops = {
      imageSize: {width: 1000, height: 750}
    }

    this.lc = this.LC.init(document.getElementsByClassName('literally core')[0], ops);

    this.resetImage()
    this.lc.setColor("background", "transparent")
    this.lc.setColor("secondary", "rgba(255, 0, 0, 0.1)")
    this.lc.setImageSize(1000, 750)

    this.tools = {
      "segmentation": new this.LC.tools.Polygon(this.lc),
      "detection": new this.LC.tools.Rectangle(this.lc)
    };

    this.keyboardListener = this.handleKeyboard.bind(this),
    window.addEventListener("keydown", this.keyboardListener, false);

    this.setState({active: true})
  }

  prepareDetection() {
    var data = []
    for (var i = 0; i < this.state.snapshots.length; i++) {
      var snap = this.state.snapshots[i]
      var cur = {"name": snap.filename, "rects": []}
      for (var j = 0; j < snap.shapes.length; j++) {
        var shape = snap.shapes[j]
        var rect = {
          "x1": shape.data.x,
          "x2": shape.data.x + shape.data.width,
          "y1": shape.data.y,
          "y2": shape.data.y + shape.data.height
        }
        cur["rects"].push(rect)
      }
      data.push(cur)
    }
    return data;
  }

  prepareSegmentation() {
    var data = []
    for (var i = 0; i < this.state.snapshots.length; i++) {
      const snap = this.state.snapshots[i]
      var cur = {"name": snap.filename, "polygons": []}
      for (var j = 0; j < snap.shapes.length; j++) {
        const shape = snap.shapes[j]
        var polygon = []
        for (var k = 0; k < shape.data.pointCoordinatePairs.length; k++) {
          const pair = shape.data.pointCoordinatePairs[k]
          polygon.push({"x": pair[0], "y": pair[1]})
        }
        cur["polygons"].push(polygon)
      }
      data.push(cur)
    }
    return data;
  }

  resetImage() {
    if (this.state.image_index >= this.props.files.length) {
      var data;

      if (this.props.mode === "detection") {
        data = this.prepareDetection()
      }
      else {
        data = this.prepareSegmentation()
      }

      window.removeEventListener("keydown", this.keyboardListener, false);
      this.lc.teardown()
      this.props.finish(JSON.stringify(data, null, '\t'));
    }

    else {
      const file = this.props.files[this.state.image_index]

      var reader = new FileReader()
      reader.onload = (function(lc) {
        return function(e) {
          var img = new Image()
          img.src = e.target.result;
          lc.setWatermarkImage(img)
        }
      })(this.lc)

      reader.readAsDataURL(file)

      this.lc.clear()

      this.setState({image_name: file.name})
      this.setState({image_index: this.state.image_index + 1})
    }
  }

  handleKeyboard(e) {
    if (e.key === "ArrowRight") {
        const rawData = this.lc.getSnapshot(["shapes", "colors"])
        rawData.filename = this.state.image_name
        var allSnapshots = JSON.parse(JSON.stringify(this.state.snapshots))
        allSnapshots.push(rawData)
        console.log(this.state)
        this.setState({snapshots: allSnapshots})
        this.resetImage()
    }
  }

  render() {
    if (this.state.active) {
      this.lc.setTool(this.tools[this.props.mode]);
      this.lc.setColor("secondary", this.props.color)
    }

    return (
      <div className="literally core"></div>
    )
  }
}


export default Canvas;
