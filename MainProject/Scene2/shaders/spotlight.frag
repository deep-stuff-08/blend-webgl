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
};

struct Light {
    vec3 position;
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform int textureAvailable;
uniform vec3 viewPos;

uniform Material material;
uniform Light light;

uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;

out vec4 color;

void main(void) {

	vec3 lightDir = normalize(light.position - P);

    // ambient
    vec3 ambient = light.ambient * material.diffuseMat;
    // diffuse
	vec3 normal = normalize(N);
    vec3 diffuse = light.diffuse * max(dot(normal,lightDir),0.0) * material.diffuseMat;

    // specular

	vec3 viewDir = normalize(viewPos - P);
	vec3 reflectVec = reflect(-lightDir, normal);
    vec3 specular = light.specular * pow(max(dot(viewDir, reflectVec),0.0), material.shininess) * material.specularMat;

	if(textureAvailable == 1)
	{
		diffuse *= texture(diffuseTexture,Tex).rgb;
		specular *= texture(specularTexture,Tex).rgb;
	}

    float theta = dot(lightDir,normalize(-light.direction));
    float epsilon = (radians(12.5) - radians(17.5));
    float intensity = clamp((theta - radians(17.5)) / epsilon,0.0,1.0);

    diffuse *= intensity;
    specular *= intensity;

    // attenuation
    float dist = length(light.direction - P);
    // attenuation = constant + linear * distance + quadratic * distance * distance
    float attenuation = 1.0 / (1.0 + 0.09 * dist + 0.032 * (dist * dist));
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    
	color = vec4((ambient + diffuse + specular),1.0);
}
