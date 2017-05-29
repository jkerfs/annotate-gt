import React, { Component } from 'react';

class Nav extends Component {

  render() {
    return (
      <div>
      <nav>
        <ul className="pager">
          <li className="other"><a href="#" onClick={() => this.props.actionEventHandler('c')}>Clear</a></li>
          <li className="other"><a href="#" onClick={() => this.props.actionEventHandler('u')}>Undo</a></li>
          <li className="next"><a href="#" onClick={() => this.props.actionEventHandler('n')}>Next <span aria-hidden="true">&rarr;</span></a></li>
        </ul>
      </nav>
      <center><h2>{this.props.image_name} ({this.props.image_index} / {this.props.total_images})</h2></center>
      </div>
    )
  }
}

export default Nav;
