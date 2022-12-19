#version 300 es

precision highp float;
precision highp sampler2DShadow;

in vec2 Tex;
in vec3 N;
in vec3 P;
in vec3 viewPos;
in vec4 lightFragPos;

uniform vec3 lightPos;

uniform bool isLight;
uniform bool isTexture;
uniform bool isBlend;
uniform bool isShadow;

uniform sampler2D samplerDiffuse;
// uniform sampler2DShadow samplerShadow;
uniform sampler2DShadow samplerShadow;

out vec4 color;

float calcShadowPCF(sampler2DShadow shadowTex, vec4 fragPos) {
	float shadow = 0.0;
	const float texelSize = 1.0 / 700.0;
	for(int x = -1; x <= 1; x++) {
		for(int y = -1; y <= 1; y++) {
			shadow += textureProj(samplerShadow, fragPos + vec4(vec2(x, y) * vec2(texelSize), 0.0, 0.0));
		}
	}
	return shadow /= 9.0;
}

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
	if(isShadow) {
		matColor = 0.1 * matColor + matColor * calcShadowPCF(samplerShadow, lightFragPos);
	}
	color = vec4(matColor, alpha);
}
