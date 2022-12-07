#version 300 es

precision highp float;

in vec2 Tex;
in vec3 N;
in vec3 P;

uniform vec3 viewPos;

uniform sampler2D diffuse;
uniform sampler2D normal;
uniform sampler2D displacement;
uniform vec4 lightColor;
uniform vec3 lightPos;

layout (location = 0) out vec4 color;
layout (location = 1) out vec4 BloomColor;

void main(void) {
	vec3 normal = normalize(texture(normal,Tex).xyz * 2.0 - 1.0);
	vec3 lightDir = normalize(lightPos - P);
	vec3 viewDir = normalize(viewPos - P);

	vec3 reflectVec = reflect(-lightDir, normal);
	vec3 matcolor = vec3(texture(diffuse, Tex).xyz);
	color = vec4(0.1 * matcolor + max(dot(normal, lightDir), 0.0) * matcolor + pow(max(dot(reflectVec, viewDir), 0.0), 129.0) * vec3(0.7), 1.0);
	color *= lightColor;
	if(color.r > 0.5)
		color.r *= 5.0;

	float brightness = dot(color.rgb,vec3(0.2126,0.7152,0.0722));

	if(brightness > 1.0)
		BloomColor = color;
	else
		BloomColor = vec4(0.0,0.0,0.0,1.0);
}
