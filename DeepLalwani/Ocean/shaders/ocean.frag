#version 300 es

precision highp float;

in vec2 Tex;
in vec4 C;
in vec3 N;
in vec3 P;
in vec3 viewPos;

uniform vec3 lightPos;

uniform sampler2D samplerDiffuse;

out vec4 color;

void main(void) {
	vec3 matColor = vec3(0.0);
	float alpha;
	vec2 uv = (C.xy / C.w) * 0.5 + 0.5;
	vec4 t = texture(samplerDiffuse, vec2(uv.x, -uv.y));
	matColor = t.rgb;
	alpha = t.a;
	vec3 N = normalize(N);
	vec3 L = normalize(lightPos - P);
	vec3 V = normalize(viewPos - P);
	vec3 R = reflect(-L, N);
	matColor = 0.1 * matColor + max(dot(N, L), 0.0) * matColor + pow(max(dot(R, V), 0.0), 129.0) * vec3(0.7);
	color = t;
}
