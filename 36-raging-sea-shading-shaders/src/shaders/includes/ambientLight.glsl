struct AmbientLight {
    vec3 lightColor;
    float lightIntensity;
};


vec3 ambientLight(AmbientLight ambLight){
    return ambLight.lightColor * ambLight.lightIntensity;
}