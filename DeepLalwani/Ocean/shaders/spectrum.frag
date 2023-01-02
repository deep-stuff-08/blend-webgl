#version 300 es

precision highp float;

const float PI = 3.14159265359;
const float G = 9.81;
const float KM = 370.0;

in vec2 v_coordinates;

uniform float u_size;
uniform float u_resolution;

uniform sampler2D u_phases;
uniform sampler2D u_initialSpectrum;

uniform float u_choppiness;

out vec4 FragColor;

vec2 multiplyComplex (vec2 a, vec2 b) {
	return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);
}

vec2 multiplyByI (vec2 z) {
	return vec2(-z[1], z[0]);
}

float omega (float k) {
	return sqrt(G * k * (1.0 + k * k / KM * KM));
}

void main (void) {
	vec2 coordinates = gl_FragCoord.xy - 0.5;
	float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;
	float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;
	vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;

	float phase = texture(u_phases, v_coordinates).r;
	vec2 phaseVector = vec2(cos(phase), sin(phase));

	vec2 h0 = texture(u_initialSpectrum, v_coordinates).rg;
	vec2 h0Star = texture(u_initialSpectrum, vec2(1.0 - v_coordinates + 1.0 / u_resolution)).rg;
	h0Star.y *= -1.0;

	vec2 h = multiplyComplex(h0, phaseVector) + multiplyComplex(h0Star, vec2(phaseVector.x, -phaseVector.y));

	vec2 hX = -multiplyByI(h * (waveVector.x / length(waveVector))) * u_choppiness;
	vec2 hZ = -multiplyByI(h * (waveVector.y / length(waveVector))) * u_choppiness;

	//no DC term
	if (waveVector.x == 0.0 && waveVector.y == 0.0) {
		h = vec2(0.0);
		hX = vec2(0.0);
		hZ = vec2(0.0);
	}

	FragColor = vec4(hX + multiplyByI(h), hZ);
}
