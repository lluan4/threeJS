struct DirectionalLight {
    vec3 lightColor;
    float lightIntensity;
    vec3 normal;            
    vec3 lightPosition;     
    vec3 viewDir;
    float specularPower;          
};

vec3 directionalLight(DirectionalLight dirLight){
    vec3 lightDir = normalize(dirLight.lightPosition);
    vec3 reflectDir = reflect(-lightDir, dirLight.normal);

    // Shading
    float shading = dot(dirLight.normal, lightDir);
    shading = max(0.0, shading);
    
    // Specular
    float specular = - dot(reflectDir, dirLight.viewDir);
    specular = max(0.0, specular);
    specular = pow(specular, dirLight.specularPower);
    
    return dirLight.lightColor * dirLight.lightIntensity * (shading + specular); ;

}