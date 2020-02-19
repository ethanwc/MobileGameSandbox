import React, {Component} from 'react';
import Svg from 'react-native-svg';

class DrawLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const x1 = this.props.body.position.x1
    const y1 = this.props.body.position.y1
    const x2 = this.props.body.position.x2
    const y2 = this.props.body.position.y2

    return (
      <Svg height="100" width="100">
        <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="2" />
      </Svg>
    );
  }
}

export {DrawLine};
