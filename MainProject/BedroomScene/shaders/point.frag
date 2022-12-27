#version 300 es

precision highp float;

in vec2 Tex;
in vec4 Color;
in vec3 N;
in vec3 P;

struct Material
{
    vec3 diffuseMat;
    vec3 specularMat;
    float shininess;
    float opacity;
};

struct Light {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};


struct Texture
{
    bool set;
    sampler2D texSampler;
};

uniform vec3 viewPos;

uniform Material material;
uniform Light light;

uniform Texture diffuseTex;
uniform Texture specularTex;
uniform Texture normalTex;
uniform Texture alphaTex;

out vec4 color;

void main(void) {

    // ambient

    vec3 ambient = light.ambient * material.diffuseMat;
    
    // diffuse

	vec3 normal = normalize(N);
	vec3 lightDir = normalize(light.direction - P);
    vec3 diffuse = light.diffuse * max(dot(normal,lightDir),0.0) * material.diffuseMat;

    // specular

	vec3 viewDir = normalize(viewPos - P);
	vec3 reflectVec = reflect(-lightDir, normal);
    vec3 specular = light.specular * pow(max(dot(viewDir, reflectVec),0.0), material.shininess) * material.specularMat;

    if(diffuseTex.set)
    {
        diffuse *= texture(diffuseTex.texSampler,Tex).rgb;
    }

    if(specularTex.set)
    {
        specular *= texture(specularTex.texSampler,Tex).rgb;
    }

    // attenuation
    float dist = length(light.direction - P);
    // attenuation = constant + linear * distance + quadratic * distance * distance
    float attenuation = 1.0 / (1.0 + 0.0014 * dist + 0.00007 * (dist * dist));

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
	color = vec4((ambient + diffuse + specular),material.opacity);
}
