#version 300 es

precision highp float;

in vec2 Tex;
in vec4 C;
in vec3 N;
in vec3 P;
in vec3 viewPos;

uniform vec3 lightPos;


out vec4 color;

void main(void) {
	vec3 matColor = vec3(0.0, 0.5, 1.0);
	float alpha;
	vec3 N = normalize(N);
	vec3 L = normalize(lightPos - P);
	vec3 V = normalize(viewPos - P);
	vec3 R = reflect(-L, N);
	matColor = 0.1 * matColor + max(dot(N, L), 0.0) * matColor;
	color = vec4(matColor, 1.0);
}
