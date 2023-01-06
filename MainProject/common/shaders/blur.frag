#version 300 es

precision highp float;

uniform sampler2D imageSampler;

layout(location = 0)out vec4 FragColor;

in vec2 TexCoords;

uniform bool horizontal;
float weight[5] = float[] (0.2270270270, 0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162);

void main() {
	vec2 tex_offset = 1.0 / vec2(1024.0);
	vec3 result = texture(imageSampler, TexCoords).rgb * weight[0];
	if(horizontal) {
		for(int i = 1; i < 5; ++i) {
			result += texture(imageSampler, TexCoords + vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
			result += texture(imageSampler, TexCoords - vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
		}
	}
	else {
		for(int i = 1; i < 5; ++i) {
			result += texture(imageSampler, TexCoords + vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
			result += texture(imageSampler, TexCoords - vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
		}
	}
	FragColor = vec4(result, 1.0);
}