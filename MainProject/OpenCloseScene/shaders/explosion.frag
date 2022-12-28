#version 300 es

precision highp float;

uniform sampler2D samplerDiffuse;

uniform float time;

in vec2 tex;

out vec4 FragColor;

void main(void) {
	vec3 color = texture(samplerDiffuse, tex).rgb;
	float alpha = clamp(pow(clamp(color.r + color.g  + color.b, 0.0, 1.0), 2.0) - pow(time * 0.7, 8.0), 0.0, 1.0);
	FragColor = vec4(color, alpha);
}
