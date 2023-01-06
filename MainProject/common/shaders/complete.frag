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
	vec3 attenuation;
	vec2 cutoff;
	vec3 direction;
};

uniform vec3 viewPos;

uniform bool isTexture;
uniform bool isBlend;

uniform material_t material;
uniform light_t light[13];
uniform int numOfLights;

uniform bool isEmissive;

uniform sampler2D samplerDiffuse;

layout(location = 0)out vec4 FragColor;
layout(location = 1)out vec4 EmitColor;

void main(void) {
	vec3 color = vec3(0.0);
	float alpha;
	if(isTexture) {
		vec4 t = texture(samplerDiffuse, Tex);
		color = t.rgb * material.diffuse;
		alpha = t.a * material.opacity;
	} else {
		color = material.diffuse;
		alpha = material.opacity;
	}
	if(!isBlend) {
		alpha = 1.0;
	}
	if(numOfLights > 0) {
		vec3 fcolor = vec3(0.0, 0.0, 0.0);
		vec3 N = normalize(N);
		vec3 V = normalize(viewPos - P);
		for(int i = 0; i < numOfLights; i++) {
			vec3 L = normalize(light[i].position - P);
			vec3 R = reflect(-L, N);
			float attenuation = 1.0;
			float intensity = 1.0;
			if(light[i].attenuation.x != 0.0) {
				float dist = length(light[i].position - P);
				attenuation = 1.0 / (light[i].attenuation.x + light[i].attenuation.y * dist + light[i].attenuation.z * (dist * dist));
			}
			if(light[i].cutoff.x != 0.0) {
				float theta = dot(L, normalize(-light[i].direction));
				float epsilon = (cos(radians(light[i].cutoff.x)) - cos(radians(light[i].cutoff.y)));
				intensity = clamp((theta - cos(radians(light[i].cutoff.y))) / epsilon, 0.0, 1.0);
			}
			vec3 ambient = attenuation * color * light[i].ambient * material.ambient;
			vec3 diffuse = intensity * attenuation * max(dot(N, L), 0.0) * color * light[i].diffuse;
			vec3 specular = intensity * attenuation * pow(max(dot(R, V), 0.0), material.shininess) * light[i].specular * material.specular;
			fcolor +=  ambient + diffuse + specular;
		}
		color = fcolor;
	}
	FragColor = vec4(color, alpha);
	if(isEmissive) {
		EmitColor = vec4(color, 1.0) * 1.2;
	}
}
