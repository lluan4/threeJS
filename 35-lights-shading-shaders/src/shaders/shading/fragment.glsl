uniform vec3 uColor;

vec3 ambientLight(vec3 lightColor, float lightIntensity){

    return lightColor * lightIntensity;
}

void main()
{
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 0.2);
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}