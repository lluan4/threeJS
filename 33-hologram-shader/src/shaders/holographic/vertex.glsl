uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

float random2D(vec2 value){
    return fract(sin(dot(value ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch effect
    float glitchTime = uTime - modelPosition.y;
    float glitchStrenght = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitchStrenght /= 3.0;
    glitchStrenght = smoothstep(0.3, 0.5, glitchStrenght);
    glitchStrenght *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrenght;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrenght;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vPosition = modelPosition.xyz;
    vNormal =  modelNormal.xyz;
}