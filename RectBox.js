import React, {Component, PureComponent} from 'react';
import {StyleSheet, View, ART, Dimensions} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {Vector} from 'matter-js';

class Rec extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    const angle = this.props.body.angle;

    return (
      <View>
      </View>
    );
  }
}

export {Rec};
