#version 300 es
precision highp float;

layout(location = 0)out vec4 FragColor;

in vec2 texCoord;

uniform sampler2D hdrTex;
uniform sampler2D bloomTex;
uniform float exposure;
uniform float fade;

void main(void) {
	vec3 color = texture(hdrTex, texCoord).rgb + texture(bloomTex, texCoord).rgb;
	vec3 result = vec3(1.0) - exp(-color * exposure);
	result = mix(result, vec3(0.0), fade);
	// FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
	FragColor = vec4(result, 1.0);
}