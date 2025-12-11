// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;

uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main(){
    vec4 modelPosition = vec4(position, 1.0);

    float movimentX = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    float movimentY = sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

    float elevation = movimentX;
    elevation += movimentY;

    // modelPosition.z += aRandom * 0.1;
    modelPosition.z += movimentX;
    modelPosition.z += movimentY;

    vec4 viewPosotion = modelViewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosotion;

    gl_Position = projectedPosition;

    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}