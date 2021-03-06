import React, { Component } from 'react';
import JSZip from "jszip"
import Nav from './Nav'


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
      imageSize: {width: 1024, height: 720},
      defaultStrokeWidth: 2
    }

    this.lc = this.LC.init(document.getElementsByClassName('literally core')[0], ops);

    this.resetImage()
    this.lc.setColor("background", "transparent")
    this.lc.setColor("secondary", "rgba(255, 0, 0, 0.1)")
    this.lc.setImageSize(1024, 720)

    this.tools = {
      "segmentation": new this.LC.tools.Polygon(this.lc),
      "detection": new this.LC.tools.Rectangle(this.lc)
    };

    this.keyboardListener = this.handleKeyboard.bind(this);
    window.addEventListener("keydown", this.keyboardListener, false);

    this.setState({active: true})
  }

  prepareDetection() {
    var zip = new JSZip();
    var js = []
    for (var i = 0; i < this.state.snapshots.length; i++) {
      const snap = this.state.snapshots[i]
      var cur = {"image_path": snap.filename, "rects": []}
      for (var j = 0; j < snap.shapes.length; j++) {
        var shape = snap.shapes[j]
        shape.data.fillColor="hsla(0, 0%, 0%, 1)";
        var rect = {
          "x1": shape.data.x,
          "x2": shape.data.x + shape.data.width,
          "y1": shape.data.y,
          "y2": shape.data.y + shape.data.height
        }
        cur["rects"].push(rect)
      }
      this.lc.loadSnapshot(snap);
      this.lc.getImage({"includeWatermark": false}).toBlob((blob) => {
        const maskFilename = snap.filename.replace(/\.[^.]+$/, "-mask.png");
        zip.file(maskFilename, blob);
      });
      js.push(cur)
    }
    return {"js": js, "zip": zip};
  }

  prepareSegmentation() {
    var zip = new JSZip();
    var js = []

    for (var i = 0; i < this.state.snapshots.length; i++) {
      const snap = this.state.snapshots[i];
      const polygons = [];
      const cur = {"name": snap.filename, "polygons": []};

      for (var j = 0; j < snap.shapes.length; j++) {
        snap.shapes[j].data.fillColor="hsla(0, 0%, 0%, 1)"
        polygons.push(snap.shapes[j].data.pointCoordinatePairs);
      }
      cur["polygons"] = polygons;

      this.lc.loadSnapshot(snap);
      this.lc.getImage({"includeWatermark": false}).toBlob((blob) => {
        const maskFilename = snap.filename.replace(/\.[^.]+$/, "-mask.png");
        zip.file(maskFilename, blob);
      });

      js.push(cur);
    }
    return {"js": js, "zip": zip};
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
      this.props.finish(data);
    }

    else {
      const file = this.props.files[this.state.image_index]
      var reader = new FileReader()
      reader.onload = ((lc) => {
        return (e) => {
          var img = new Image()
          img.src = e.target.result;
          img.onload = () => {
            const canvas_width = document.getElementById('canvas').clientWidth;
            const canvas_height = document.getElementById('canvas').clientHeight;
            const width_scale = canvas_width / img.width;
            const height_scale = canvas_height / img.height;
            const scale = Math.min(width_scale, height_scale);
            this.lc.watermarkScale = scale;
            this.lc.setImageSize(img.width, img.height);
            this.lc.setZoom(scale);
          }
        lc.setWatermarkImage(img);
        }
      })(this.lc)

      reader.readAsDataURL(file)

      this.lc.clear()

      this.setState({image_name: file.name})
      this.setState({image_index: this.state.image_index + 1})
    }
  }

  next () {
    const rawData = this.lc.getSnapshot(["shapes", "colors"])
    rawData.filename = this.state.image_name
    var allSnapshots = JSON.parse(JSON.stringify(this.state.snapshots))
    allSnapshots.push(rawData)
    this.setState({snapshots: allSnapshots})
    this.resetImage()
  }

  handleKeyboard(e) {
    if (e.key === "ArrowRight") {
      this.next()
    }
  }

  handleNavAction(a) {
    if (a === 'n') {
      this.next();
    }
    if (a === 'c') {
      this.lc.clear();
    }
    if (a === 'u') {
      this.lc.undo();
    }
  }


  render() {
    if (this.state.active) {
      this.lc.setTool(this.tools[this.props.mode]);
      this.lc.setColor("secondary", this.props.color);
    }

    return (
      <div>
      <div className="literally core" id="canvas"></div>
      <Nav actionEventHandler={(a) => this.handleNavAction(a)} image_name={this.state.image_name}
      image_index={this.state.image_index} total_images={this.props.files.length}/>
      </div>
    )
  }
}


export default Canvas;
