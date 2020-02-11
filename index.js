import {AppRegistry} from 'react-native';
import Physics from './physics/rigid-bodies';
import STouch from './touch-events/single-touch';
import MTouch from './touch-events/multi-touch';
import GameOfLifeExample from './opengl/game-of-life'

AppRegistry.registerComponent('Sandbox', () => GameOfLifeExample);
