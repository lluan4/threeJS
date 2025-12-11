#include "./noise3d.glsl"

uniform float uTime;

uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    // Elevation
    float elevationX = sin((modelPosition.x * uBigWavesFrequency.x) + uTime * uBigWavesSpeed);
    float elevationZ = sin((modelPosition.z * uBigWavesFrequency.y) + uTime * uBigWavesSpeed);

    float elevation = elevationX * elevationZ * uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++){
        float frequency = i * uSmallWavesFrequency;
        float amplitude = uSmallWavesElevation / i;
       elevation -= abs(cnoise(vec3(modelPosition.xz * frequency , uTime * uSmallWavesSpeed)) * amplitude);
    }

  

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
}