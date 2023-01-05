#version 300 es

precision highp float; 

layout(location = 0)out vec4 FragColor;

uniform vec2 resolution;
uniform float time;

#define timeScale time * 1.0
#define fireMovement vec2(0.0, -0.5)
#define distortionMovement vec2(1.0, -0.3)
#define normalStrength 80.0
#define distortionStrength 0.01

float rand(vec2 co) {
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 hash( vec2 p ) {
	p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
	return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise( in vec2 p ) {
	const float K1 = 0.366025404;
	const float K2 = 0.211324865;
	vec2 i = floor(p + (p.x + p.y) * K1);
	vec2 a = p - i + (i.x + i.y) * K2;
	vec2 o = step(a.yx, a.xy);
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0 * K2;
	vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
	vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
	return dot(n, vec3(70.0));
}

float fbm (in vec2 p) {
	float f = 0.0;
	mat2 m = mat2(1.6,  1.2, -1.2,  1.6);
	f  = 0.5000*noise(p); p = m*p;
	f += 0.2500*noise(p); p = m*p;
	f += 0.1250*noise(p); p = m*p;
	f += 0.0625*noise(p); p = m*p;
	f = 0.5 + 0.5 * f;
	return f;
}

vec3 bumpMap(vec2 uv) { 
	vec2 s = 1.0 / resolution.xy;
	float p =  fbm(uv);
	float h1 = fbm(uv + s * vec2(1., 0));
	float v1 = fbm(uv + s * vec2(0, 1.));
	
	vec2 xy = (p - vec2(h1, v1)) * normalStrength;
	return vec3(xy + .5, 1.);
}

float mapRange(float val, float minVal, float maxVal) {
	return (val * (maxVal - minVal) + minVal);
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 normal = bumpMap(uv * vec2(1.0, 0.3) + distortionMovement * timeScale);
	vec2 displacement = clamp((normal.xy - .5) * distortionStrength, -1., 1.);
	uv += displacement;
	vec2 uvT = (uv * vec2(1.0, 0.5)) + timeScale * fireMovement;
	float n = fbm(12.0 * uvT);
	float gradient = pow(1.0 - uv.y, 2.0) * (1.0 - pow(mapRange(uv.x, -1.0, 1.0), 2.0))  * 4.0;
	float finalNoise = n * gradient;
	vec3 color = finalNoise * vec3(2.0*n, 2.0*n*n*n, n*n*n*n);
	FragColor = vec4(color, pow(dot(color, vec3(0.2126, 0.7152, 0.0722)) * 10.0, 20.0));
}