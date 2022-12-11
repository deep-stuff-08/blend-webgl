#version 300 es

precision highp float;

in vec2 Tex;
in vec3 N;
in vec3 P;
in vec3 viewPos;

uniform vec3 lightPos;

uniform sampler2D samplerDiffuse;

out vec4 color;

void main(void) {
	vec3 normal = normalize(N);
	vec3 lightDir = normalize(lightPos - P);
	vec3 viewDir = normalize(viewPos - P);
	vec3 reflectVec = reflect(-lightDir, normal);
	vec3 matcolor = vec3(texture(samplerDiffuse, Tex));
	color = vec4(0.1 * matcolor + max(dot(normal, lightDir), 0.0) * matcolor + pow(max(dot(reflectVec, viewDir), 0.0), 129.0) * vec3(0.7), 1.0);
}
