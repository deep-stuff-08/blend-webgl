#version 300 es
precision highp float;

layout(location = 0)out vec4 FragColor0;
layout(location = 1)out vec4 FragColor1;

void main(void) {
	FragColor0 = vec4(0.5, 0.25, 1.0, 1.0);
	FragColor1 = vec4(0.25, 1.0, 0.5, 1.0);
}