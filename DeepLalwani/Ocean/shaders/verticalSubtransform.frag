#version 300 es

precision highp float;

const float PI = 3.14159265359;

uniform sampler2D u_input;

uniform float u_transformSize;
uniform float u_subtransformSize;

in vec2 v_coordinates;

out vec4 FragColor;

vec2 multiplyComplex (vec2 a, vec2 b) {
	return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);
}

void main (void) {
	float index = v_coordinates.y * u_transformSize - 0.5;
	
	float evenIndex = floor(index / u_subtransformSize) * (u_subtransformSize * 0.5) + mod(index, u_subtransformSize * 0.5);
	
	//transform two complex sequences simultaneously
	vec4 even = texture(u_input, vec2(gl_FragCoord.x, evenIndex + 0.5) / u_transformSize).rgba;
	vec4 odd = texture(u_input, vec2(gl_FragCoord.x, evenIndex + u_transformSize * 0.5 + 0.5) / u_transformSize).rgba;
	
	float twiddleArgument = -2.0 * PI * (index / u_subtransformSize);
	vec2 twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));

	vec2 outputA = even.xy + multiplyComplex(twiddle, odd.xy);
	vec2 outputB = even.zw + multiplyComplex(twiddle, odd.zw);

	FragColor = vec4(outputA, outputB);
}