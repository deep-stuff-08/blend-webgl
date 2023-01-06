#version 300 es

precision highp float;

in vec2 v_coordinates;
in vec3 v_position;

uniform sampler2D u_displacementMap;
uniform sampler2D u_normalMap;

uniform vec3 u_cameraPosition;

uniform vec3 u_oceanColor;
uniform vec3 u_skyColor;
uniform float u_exposure;

uniform vec3 u_sunDirection;

layout(location = 0)out vec4 FragColor;
layout(location = 1)out vec4 EmitColor;

vec3 hdr (vec3 color, float exposure) {
	return 1.0 - exp(-color * exposure);
}

void main (void) {
	vec3 normal = texture(u_normalMap, v_coordinates).rgb;

	vec3 view = normalize(u_cameraPosition - v_position);
	float fresnel = 0.02 + 0.98 * pow(1.0 - dot(normal, view), 5.0);
	vec3 sky = fresnel * u_skyColor;

	float diffuse = clamp(dot(normal, normalize(u_sunDirection)), 0.0, 1.0);
	vec3 water = (1.0 - fresnel) * u_oceanColor * u_skyColor * diffuse;

	vec3 color = sky + water;

	FragColor = vec4(hdr(color, 0.5), 1.0);
	EmitColor = vec4(0.0, 0.0, 0.0, 1.0);
}
