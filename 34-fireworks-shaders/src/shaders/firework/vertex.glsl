uniform float uSize;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

#include ../includes/remap.glsl

void main(){
    float progress = uProgress * aTimeMultiplier;
    vec3 pos = position;

    // Explodion effect
    float explodeProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explodeProgress = 1.0 - pow(1.0 - explodeProgress, 3.0); 
    pos *= clamp(explodeProgress, 0.0, 1.0);

    // Falling effect
    float fallProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallProgress = clamp(fallProgress, 0.0, 1.0);
    fallProgress = 1.0 - pow(1.0 - fallProgress, 3.0); 
    pos.y -= fallProgress * 0.2;

    // Scaling effect
    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    sizeOpeningProgress = clamp(sizeOpeningProgress, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.15, 1.0, 1.0, 0.0);
    sizeClosingProgress = clamp(sizeClosingProgress, 0.0, 1.0);
    float sizeProgress = min(sizeOpeningProgress , sizeClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0, 1.0);

    // Twinkling effect
    float twinkleProgress = remap(progress, 0.2, 1.0, 0.0, 1.0);
    twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
    float sizeTwinkle = sin(progress * 30.0) * 0.5 + 0.5; 
    sizeTwinkle = 1.0 -  sizeTwinkle * twinkleProgress;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    // Point size
    // uResolution.y to keep size consistent regardless of aspect ratio
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkle;

    // Fix size depending on depth (Solution by Three.js)
    gl_PointSize *= 1.0 / - viewPosition.z;

    if(gl_PointSize < 1.0) gl_Position = vec4(9999.9);
    
}