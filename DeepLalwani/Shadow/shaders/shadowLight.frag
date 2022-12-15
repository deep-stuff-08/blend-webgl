#version 300 es
precision highp float;

layout(location = 0)out vec4 FragColor;

void main(void) {
	FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
}