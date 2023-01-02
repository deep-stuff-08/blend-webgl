#version 300 es

precision highp float;

const float PI = 3.14159265359;
const float G = 9.81;
const float KM = 370.0;

in vec2 v_coordinates;

uniform sampler2D u_phases;

uniform float u_deltaTime;
uniform float u_resolution;
uniform float u_size;

out vec4 FragColor;

float omega (float k) {
	return sqrt(G * k * (1.0 + k * k / KM * KM));
}

void main (void) {
	float deltaTime = 1.0 / 60.0;
	vec2 coordinates = gl_FragCoord.xy - 0.5;
	float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;
	float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;
	vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;

	float phase = texture(u_phases, v_coordinates).r;
	float deltaPhase = omega(length(waveVector)) * u_deltaTime;
	phase = mod(phase + deltaPhase, 2.0 * PI);

	FragColor = vec4(phase, 0.0, 0.0, 0.0);
}
