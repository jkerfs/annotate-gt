import React, { Component } from 'react';


class Finalize extends Component {
  constructor() {
    super()
    this.state = {
      filename: "",
      href: ""
    }
  }

  componentDidMount() {
    const filename = "results.txt"
    const href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.props.text)
    const download = filename
    this.setState({href: href, download:download});
  }

  render() {
    return (
      <div>
        <h1>Finished</h1>
        <a id="dl-link" href={this.state.href} download={this.state.download}>Download JSON</a><br/>
        <a id="restart-link" href="#" onClick={() => this.props.restart()}>Restart</a>
      </div>
    )
  }
}

export default Finalize;
