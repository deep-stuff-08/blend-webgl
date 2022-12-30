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
	vec3 position;
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
uniform Light light[3];

uniform Texture diffuseTex;
uniform Texture specularTex;
uniform Texture normalTex;
uniform Texture alphaTex;

vec4 directionalLight(Light light, Material material,vec3 normal, vec3 viewDir)
{
	vec3 ambient = light.ambient * material.diffuseMat;

	vec3 lightDir = normalize(-light.direction);
	vec3 diffuse = light.diffuse * max(dot(normal,lightDir),0.0) * material.diffuseMat;

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

	return vec4((ambient+diffuse+specular),material.opacity);
}

vec3 pointLight(Light light, Material material,vec3 normal, vec3 viewDir)
{
	vec3 ambient = light.ambient * material.diffuseMat;

	vec3 lightDir = normalize(light.direction - P);
	vec3 diffuse = light.diffuse * max(dot(normal,lightDir),0.0) * material.diffuseMat;

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
    float attenuation = 1.0 / (1.0 + 0.022 * dist + 0.0019 * (dist * dist));

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

	return vec3((ambient+diffuse+specular));
}

vec4 spotLight(Light light, Material material,vec3 normal, vec3 viewDir)
{
	// Ambient
    vec3 ambient = light.ambient * material.diffuseMat;

	vec3 lightDir = normalize(vec3(0.0,0.0,0.0) - P);

	// Diffuse
	vec3 diffuse = light.diffuse * max(dot(normal,lightDir),0.0) * material.diffuseMat;

	// Specular
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

	return vec4((ambient+diffuse+specular),material.opacity);
}

out vec4 color;

void main(void) {
    color = vec4(0.0);
	vec3 normal = normalize(N);
	vec3 viewDir = normalize(viewPos - P);
    vec3 FragColor = pointLight(light[0],material,normal,viewDir);
	FragColor += pointLight(light[1],material,normal,viewDir);
    FragColor += pointLight(light[2],material,normal,viewDir);
    color = vec4(FragColor,material.opacity);
}
