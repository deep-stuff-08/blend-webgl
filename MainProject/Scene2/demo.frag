#version 300 es

precision highp float;

in vec2 Tex;
in vec4 Color;
in vec3 N;
in vec3 P;

uniform int textureAvailable;
uniform vec3 viewPos;

uniform vec3 diffuseMat;
uniform vec3 ambientMat ;
uniform vec3 specularMat;
uniform float shininess;

uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
uniform sampler2D normalTexture;
out vec4 color;

void main(void) {
	vec3 normal = normalize(N);
	vec3 lightDir = normalize(vec3(0.0, 0.0, 0.0) - P);
	vec3 viewDir = normalize(viewPos - P);
	vec3 reflectVec = reflect(-lightDir, normal);
	vec3 halfV = lightDir + viewDir;

	vec3 diffuse = max(dot(normal,lightDir),0.0) * diffuseMat;
	vec3 specular = pow(max(dot(normal,halfV),0.0),shininess) * specularMat;

	if(textureAvailable == 1)
	{
		diffuse *= texture(diffuseTexture,Tex).rgb;
		specular *= texture(specularTexture,Tex).rgb;
	}

	color = vec4((ambientMat + diffuse + specular),1.0);
}
