#version 300 es
precision highp float;

layout(location = 0)out vec4 FragColor;

in vec2 texCoord;

uniform sampler2D hdrTex;
uniform float exposure;

void main(void) {
	vec3 color = texture(hdrTex, texCoord).rgb;
	vec3 result = vec3(1.0) - exp(-color * exposure);
	// FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
	FragColor = vec4(result, 1.0);
}