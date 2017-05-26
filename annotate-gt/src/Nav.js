import React, { Component } from 'react';

class Nav extends Component {

  render() {
    return (
      <nav>
        <ul className="pager">
          <li className="previous"><a href="#" onClick={() => this.props.actionEventHandler('p')}><span aria-hidden="true">&larr;</span> Previous</a></li>
          <li className="other"><a href="#" onClick={() => this.props.actionEventHandler('c')}>Clear</a></li>
          <li className="other"><a href="#" onClick={() => this.props.actionEventHandler('u')}>Undo</a></li>
          <li className="next"><a href="#" onClick={() => this.props.actionEventHandler('n')}>Next <span aria-hidden="true">&rarr;</span></a></li>
        </ul>
      </nav>
    )
  }
}

export default Nav;
