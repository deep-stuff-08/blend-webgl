#version 300 es

precision highp float; 

layout(location = 0)out vec4 FragColor;

uniform vec2 resolution;
uniform float time;

float hash(in vec3 p) {
	return fract(sin(dot(p, vec3(12.9898, 39.1215, 78.233))) * 43758.5453);
}

float noise(in vec3 p) {
	vec3 i = floor(p);
	vec3 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
			mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
		mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
			mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}

float fBm(in vec3 p) {
	float sum = 0.0;
	float amp = 1.0;
	for (int i = 0; i < 6; i++) {
		sum += amp * noise(p);
		amp *= 0.5;
		p *= 2.0;
	}
	return sum;
}

void main(void) {
	vec2 p = ((gl_FragCoord.xy / resolution) * 2.0 - 1.0) / 4.0;
	vec4 texColor = vec4(0.5, 0.5, 0.5, 1.0);
	vec3 rd = normalize(vec3(p.xy, 1.0));
	vec3 pos = vec3(0.0, -1.0, 0.0) * time + rd * 20.0;
	vec3 color = vec3(0.3 * fBm(pos));
	if(texColor.r + texColor.g + texColor.b < 0.2) {
		discard;
	}
	FragColor = texColor * vec4(color, 0.7);
}