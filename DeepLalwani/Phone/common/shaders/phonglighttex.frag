#version 300 es

precision highp float;

in vec2 Tex;
in vec3 N;
in vec3 P;
in vec3 viewPos;

uniform vec3 lightPos;

uniform bool isLight;
uniform bool isTexture;
uniform bool isBlend;

uniform sampler2D samplerDiffuse;

out vec4 color;

void main(void) {
	vec3 matColor = vec3(0.0);
	float alpha;
	if(isTexture) {
		vec4 t = texture(samplerDiffuse, Tex);
		matColor = t.rgb;
		alpha = t.a;
	} else {
		matColor = vec3(1.0);
		alpha = 1.0;
	}
	if(isLight) {
		vec3 N = normalize(N);
		vec3 L = normalize(lightPos - P);
		vec3 V = normalize(viewPos - P);
		vec3 R = reflect(-L, N);
		matColor = 0.1 * matColor + max(dot(N, L), 0.0) * matColor + pow(max(dot(R, V), 0.0), 129.0) * vec3(0.7);
	}
	color = vec4(matColor, alpha);
}
