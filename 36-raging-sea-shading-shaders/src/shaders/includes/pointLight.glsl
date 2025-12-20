struct PointLight {
    vec3 lightColor;
    float lightIntensity;
    vec3 normal;            
    vec3 lightPosition;     
    vec3 viewDir;
    float specularPower;
    vec3 position;
    float decay;       
};

vec3 pointLight(PointLight dirLight){
    vec3 deltaPos = dirLight.lightPosition - dirLight.position;
    float lightDistance = length(deltaPos);
    vec3 lightDir = normalize(deltaPos);
    vec3 reflectDir = reflect(-lightDir, dirLight.normal);

    // Shading
    float shading = dot(dirLight.normal, lightDir);
    shading = max(0.0, shading);
    
    // Specular
    float specular = - dot(reflectDir, dirLight.viewDir);
    specular = max(0.0, specular);
    specular = pow(specular, dirLight.specularPower);

    // Decay
    float decay = 1.0  - lightDistance * dirLight.decay;
    decay = max(0.0, decay);

    return dirLight.lightColor * dirLight.lightIntensity * decay * (shading + specular);

}

