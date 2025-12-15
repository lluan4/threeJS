uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl


void main()
{
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    AmbientLight ambLightData;
    ambLightData.lightColor = vec3(1.0);
    ambLightData.lightIntensity = 0.03;

    DirectionalLight dirLightData;
    dirLightData.lightColor = vec3(0.1, 0.1, 1.0);
    dirLightData.lightIntensity = 1.0;
    dirLightData.normal = normal;
    dirLightData.lightPosition = vec3(0.0, 0.0, 3.0);
    dirLightData.viewDir = viewDir;
    dirLightData.specularPower = 20.0;

    PointLight pointLightData;
    pointLightData.lightColor = vec3(1.0, 0.1, 0.1);
    pointLightData.lightIntensity = 1.0;
    pointLightData.normal = normal;
    pointLightData.lightPosition = vec3(0.0, 2.5, 0.0);
    pointLightData.viewDir = viewDir;
    pointLightData.specularPower = 20.0;
    pointLightData.position = vPosition;
    pointLightData.decay = 0.3;

    PointLight pointLightData2;
    pointLightData2.lightColor = vec3(0.1, 1.0, 0.5);
    pointLightData2.lightIntensity = 1.0;
    pointLightData2.normal = normal;
    pointLightData2.lightPosition = vec3(2.0, 2.0, 2.0);
    pointLightData2.viewDir = viewDir;
    pointLightData2.specularPower = 20.0;
    pointLightData2.position = vPosition;
    pointLightData2.decay = 0.2;

  

    // Light
    vec3 light = vec3(0.0);
    light += ambientLight(ambLightData);
    light += directionalLight(dirLightData);
    light += pointLight(pointLightData);
    light += pointLight(pointLightData2);
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}