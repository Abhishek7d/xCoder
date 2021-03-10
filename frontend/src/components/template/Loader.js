import React, { PureComponent } from 'react';

class Loader extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      type: this.props.type
    }
  }
  render() {
    if (this.state.type === "card") {
      return (
        <div className="d-flex flex-row justify-content-center align-items-center loaderClassCard">
          <div className="p-2">
            <div class="dot-pulse"></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-row justify-content-center align-items-center loaderClass">
          <div className="p-2">
            <div class="dot-pulse"></div>
          </div>
        </div>
      );
    }
  }
}

export default Loader;
