import _ from 'lodash';
import {Box} from './renderers';
import Matter from 'matter-js';
import {Cir} from '../../CircleBox';
import {Rec} from '../../RectBox';
import {Sun} from '../../SunBox';
import MatterAttractor from 'matter-attractors';

let boxIds = 0;

const distance = ([x1, y1], [x2, y2]) =>
  Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const Physics = (state, {touches, time}) => {
  let engine = state['physics'].engine;

  Matter.Engine.update(engine, time.delta);

  return state;
};

const CreateBox = (state, {touches, screen}) => {
  let world = state['physics'].world;
  let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.0975);
  MatterAttractor.Attractors.gravityConstant = 0.00000002;

  touches
    .filter(t => t.type === 'press')
    .forEach(t => {
      if (boxIds < 1) {
        var attractiveBody = Matter.Bodies.circle(
          t.event.pageX,
          t.event.pageY,
          boxSize / 2,
          {
            isStatic: true,

            plugin: {
              attractors: [
                MatterAttractor.Attractors.gravity,
                // function(bodyA, bodyB) {
                //   return {
                //     x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                //     y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                //   };
                // },
              ],
            },
          },
        );

        Matter.Body.setMass(attractiveBody, 1000000000);

        Matter.World.add(world, [attractiveBody]);

        state[++boxIds] = {
          body: attractiveBody,
          size: [boxSize, boxSize],
          color: boxIds % 2 == 0 ? 'orange' : 'orange',
          renderer: Sun,
        };
      } else {
        let body = Matter.Bodies.circle(
          t.event.pageX,
          t.event.pageY,
          boxSize / 8,
          {
            frictionAir: 0,
          },
        );
        Matter.World.add(world, [body]);

        Matter.Body.setVelocity(body, {x: 5, y: -5});

        Matter.Body.setMass(body, .5);

        state[++boxIds] = {
          body: body,
          size: [boxSize / 4, boxSize / 4],
          color: boxIds % 2 == 0 ? 'black' : 'black',
          renderer: Cir,
        };
      }
    });

  return state;
};

const MoveBox = (state, {touches}) => {
  let constraint = state['physics'].constraint;

  //-- Handle start touch
  let start = touches.find(x => x.type === 'start');

  if (start) {
    let startPos = [start.event.pageX, start.event.pageY];

    let boxId = Object.keys(state).find(key => {
      let body = state[key].body;

      return (
        body && distance([body.position.x, body.position.y], startPos) < 25
      );
    });

    if (boxId) {
      constraint.pointA = {x: startPos[0], y: startPos[1]};
      constraint.bodyB = state[boxId].body;
      constraint.pointB = {x: 0, y: 0};
      constraint.angleB = state[boxId].body.angle;
    }
  }

  //-- Handle move touch
  let move = touches.find(x => x.type === 'move');

  if (move) {
    constraint.pointA = {x: move.event.pageX, y: move.event.pageY};
  }

  //-- Handle end touch
  let end = touches.find(x => x.type === 'end');

  if (end) {
    constraint.pointA = null;
    constraint.bodyB = null;
    constraint.pointB = null;
  }

  return state;
};

const CleanBoxes = (state, {touches, screen}) => {
  let world = state['physics'].world;

  Object.keys(state)
    .filter(
      key => state[key].body && state[key].body.position.y > screen.height * 2,
    )
    .forEach(key => {
      Matter.Composite.remove(world, state[key].body);
      delete state[key];
    });

  return state;
};

export {Physics, CreateBox, MoveBox, CleanBoxes};
