uniform float uSize;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

float easeOutPow(float t, float k) {
  return  1.0 - pow(1.0 - t, k); 
}

float growEase(float t) {
    return sin((t * 5.0) - 1.5) + 1.0; 
}


void main(){
    vec3 pos = position;
    // Apply progress (from 0 to 1)
    float p = easeOutPow(uProgress, 6.0);

    pos *= p;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    // Point size
    // uResolution.y to keep size consistent regardless of aspect ratio
    gl_PointSize = uSize * uResolution.y * aSize * growEase(uProgress);

    // Fix size depending on depth (Solution by Three.js)
    gl_PointSize *= 1.0 / - viewPosition.z;
}