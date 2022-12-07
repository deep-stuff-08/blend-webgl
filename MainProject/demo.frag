#version 300 es

precision highp float;

in vec2 Tex;
in vec4 Color;
in vec3 N;
in vec3 P;

uniform vec3 viewPos;

uniform sampler2D diffuse;

out vec4 color;

void main(void) {
	vec3 normal = normalize(N);
	vec3 lightDir = normalize(vec3(0.0, 0.0, 10.0) - P);
	vec3 viewDir = normalize(viewPos - P);
	vec3 reflectVec = reflect(-lightDir, normal);
	vec3 matcolor = vec3(Color * texture(diffuse, Tex));
	color = vec4(0.1 * matcolor + max(dot(normal, lightDir), 0.0) * matcolor + pow(max(dot(reflectVec, viewDir), 0.0), 129.0) * vec3(0.7), 1.0);
}
