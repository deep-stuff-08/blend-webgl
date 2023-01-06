#version 300 es
precision highp float;

in vec2 texcoords;

uniform sampler2D fireTex;

layout(location = 0)out vec4 FragColor;
layout(location = 1)out vec4 EmitColor;

void main(void) {
	vec4 color = texture(fireTex, texcoords);
	FragColor = vec4(color.rgba);
	EmitColor = vec4(color.rgb * 4.0, 1.0);
}