#version 300 es

precision highp float;

in vec3 inN;
in vec3 inP;
in vec3 viewPos;
in vec2 tex;

uniform vec3 lightPos;
uniform sampler2D texDiffuseEarthLight;
uniform sampler2D texDiffuseEarthNight;

out vec4 FragColor;

void main(void) {
	vec3 N = normalize(inN);
	vec3 L = normalize(lightPos - inP);
	vec3 V = normalize(viewPos - inP);
	vec3 R = reflect(-L, N);
	float diffuse = max(dot(N, L), 0.0);
	// specular = pow(max(dot(V, R), 0.0), shininess);
	FragColor = mix(texture(texDiffuseEarthNight, tex), texture(texDiffuseEarthLight, tex), diffuse);
}