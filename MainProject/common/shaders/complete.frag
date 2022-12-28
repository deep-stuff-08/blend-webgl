#version 300 es

precision highp float;

in vec2 Tex;
in vec3 N;
in vec3 P;

struct material_t {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
	float opacity;
};

struct light_t {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	vec3 position;
};

uniform vec3 viewPos;

uniform bool isLight;
uniform bool isTexture;
uniform bool isBlend;

uniform material_t material;
uniform light_t light;

uniform sampler2D samplerDiffuse;

out vec4 FragColor;

void main(void) {
	vec3 color = vec3(0.0);
	float alpha;
	if(isTexture) {
		vec4 t = texture(samplerDiffuse, Tex);
		color = t.rgb;
		alpha = t.a;
	} else {
		color = vec3(1.0);
		alpha = 1.0;
	}
	if(isLight) {
		vec3 N = normalize(N);
		vec3 L = normalize(light.position - P);
		vec3 V = normalize(viewPos - P);
		vec3 R = reflect(-L, N);
		vec3 ambient = color * light.ambient * material.ambient;
		vec3 diffuse = max(dot(N, L), 0.0) * color * light.diffuse * material.diffuse;
		vec3 specular = pow(max(dot(R, V), 0.0), material.shininess) * light.specular * material.specular;
		color =  ambient + diffuse + specular;
	}
	FragColor = vec4(color, alpha);
}
