#version 300 es

precision highp float;

in vec2 Tex;

uniform sampler2D samplerDiffuseEarth;
uniform sampler2D samplerDiffuseFire;

out vec4 color;

void main(void) {
	vec4 fire = texture(samplerDiffuseFire, Tex);
	color = vec4(mix(texture(samplerDiffuseEarth, Tex).rgb, fire.rgb, fire.a), 1.0);
}