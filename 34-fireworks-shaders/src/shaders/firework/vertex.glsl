uniform float uSize;
uniform float uPixelRatio;
uniform vec2 uResolution;

void main(){
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    // Point size
    // uResolution.y to keep size consistent regardless of aspect ratio
    gl_PointSize = uSize * uResolution.y;
    // Fix size depending on depth (Solution by Three.js)
    gl_PointSize *= 1.0 / - viewPosition.z;
}