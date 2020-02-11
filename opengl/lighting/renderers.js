import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GLView } from "expo";
import REGL from "regl";
import mat4 from "gl-mat4";
import bunny from "bunny";
import normals from "angle-normals";

const t = 200;

class ReglView extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  onContextCreate = gl => {
    const regl = REGL(gl);
    const rngl = gl.getExtension("RN");
    const clear = this.props.clearCommand(regl, rngl);
    const draw = this.props.drawCommand(regl, rngl);

    this.setState({
      frame: props => {
        clear(props);
        draw(props);
        gl.endFrameEXP();
      }
    });
  };

  render() {
    if (this.state.frame) this.state.frame(this.props);

    return (
      <GLView
        style={this.props.style}
        onContextCreate={this.onContextCreate}
      />
    );
  }
}

class Bunny extends PureComponent {
  drawCommand = regl => {
    return regl({
      vert: `
        precision mediump float;
        attribute vec3 position, normal;
        uniform mat4 model, view, projection;
        varying vec3 fragNormal, fragPosition;
        void main() {
          fragNormal = normal;
          fragPosition = position;
          gl_Position =  projection * view * model * vec4(position, 1);
        }`,

      frag: `
        precision mediump float;
        struct Light {
          vec3 color;
          vec3 position;
        };
        uniform Light lights[4];
        varying vec3 fragNormal, fragPosition;
        void main() {
          vec3 normal = normalize(fragNormal);
          vec3 light = vec3(0, 0, 0);
          for (int i = 0; i < 4; ++i) {
            vec3 lightDir = normalize(lights[i].position - fragPosition);
            float diffuse = max(0.0, dot(lightDir, normal));
            light += diffuse * lights[i].color;
          }
          gl_FragColor = vec4(light, 1);
        }`,

      attributes: {
        position: bunny.positions,
        normal: normals(bunny.cells, bunny.positions)
      },

      elements: bunny.cells,

      uniforms: {
        model: (_, { yaw, pitch }) => {
          return mat4.translate(
            [],
            mat4.rotateY([], mat4.rotateX([], mat4.identity([]), pitch), yaw),
            [0, -2.5, 0]
          );
        },
        view: mat4.lookAt([], [0, 0, 30], [0, 0, 0], [0, 1, 0]),
        projection: ({ viewportWidth, viewportHeight }) =>
          mat4.perspective(
            [],
            Math.PI / 4,
            viewportWidth / viewportHeight,
            0.01,
            1000
          ),
        "lights[0].color": [1, 0, 0],
        "lights[1].color": [0, 1, 0],
        "lights[2].color": [0, 0, 1],
        "lights[3].color": [1, 1, 0],
        "lights[0].position": [
          10 * Math.cos(0.09 * t),
          10 * Math.sin(0.09 * (2 * t)),
          10 * Math.cos(0.09 * (3 * t))
        ],
        "lights[1].position": [
          10 * Math.cos(0.05 * (5 * t + 1)),
          10 * Math.sin(0.05 * (4 * t)),
          10 * Math.cos(0.05 * (0.1 * t))
        ],
        "lights[2].position": [
          10 * Math.cos(0.05 * (9 * t)),
          10 * Math.sin(0.05 * (0.25 * t)),
          10 * Math.cos(0.05 * (4 * t))
        ],
        "lights[3].position": [
          10 * Math.cos(0.1 * (0.3 * t)),
          10 * Math.sin(0.1 * (2.1 * t)),
          10 * Math.cos(0.1 * (1.3 * t))
        ]
      }
    });
  };

  clearCommand = regl => {
    return props => {
      regl.clear({
        depth: 1,
        color: [0, 0, 0, 1]
      });
    };
  };

  render() {
    return (
      <ReglView
        style={StyleSheet.absoluteFill}
        drawCommand={this.drawCommand}
        clearCommand={this.clearCommand}
        {...this.props}
      />
    );
  }
}

export { Bunny };
