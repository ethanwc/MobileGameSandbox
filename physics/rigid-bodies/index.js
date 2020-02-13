import React, {Component} from 'react';
import {StatusBar, Dimensions} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import {Physics, CreateBox, MoveBox, CleanBoxes} from './systems';
import {Box} from './renderers';
import Matter from 'matter-js';

import MatterAttractor from 'matter-attractors';

Matter.use(MatterAttractor);

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

export default class RigidBodies extends Component {
  constructor() {
    super();
  }

  render() {
    const {width, height} = Dimensions.get('window');
    const boxSize = Math.trunc(Math.max(width, height) * 0.075);

    const engine = Matter.Engine.create({enableSleeping: false});
    const world = engine.world;

    const constraint = Matter.Constraint.create({
      label: 'Drag Constraint',
      pointA: {x: 0, y: 0},
      pointB: {x: 0, y: 0},
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1,
    });

    engine.world.gravity.scale = 0;

    Matter.World.addConstraint(world, constraint);

    return (
      <GameEngine
        systems={[Physics, CreateBox, MoveBox, CleanBoxes]}
        entities={{
          physics: {engine: engine, world: world, constraint: constraint},
        }}>
        <StatusBar hidden={true} />
      </GameEngine>
    );
  }
}
