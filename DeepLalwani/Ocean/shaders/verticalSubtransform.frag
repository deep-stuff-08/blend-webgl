precision highp float;

const float PI = 3.14159265359;

uniform sampler2D u_input;

uniform float u_transformSize;
uniform float u_subtransformSize;

varying vec2 v_coordinates;

vec2 multiplyComplex (vec2 a, vec2 b) {
	return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);
}

void main (void) {

	#ifdef HORIZONTAL
	float index = v_coordinates.x * u_transformSize - 0.5;
	#else
	float index = v_coordinates.y * u_transformSize - 0.5;
	#endif

	float evenIndex = floor(index / u_subtransformSize) * (u_subtransformSize * 0.5) + mod(index, u_subtransformSize * 0.5);
	
	//transform two complex sequences simultaneously
	#ifdef HORIZONTAL
	vec4 even = texture2D(u_input, vec2(evenIndex + 0.5, gl_FragCoord.y) / u_transformSize).rgba;
	vec4 odd = texture2D(u_input, vec2(evenIndex + u_transformSize * 0.5 + 0.5, gl_FragCoord.y) / u_transformSize).rgba;
	#else
	vec4 even = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + 0.5) / u_transformSize).rgba;
	vec4 odd = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + u_transformSize * 0.5 + 0.5) / u_transformSize).rgba;
	#endif

	float twiddleArgument = -2.0 * PI * (index / u_subtransformSize);
	vec2 twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));

	vec2 outputA = even.xy + multiplyComplex(twiddle, odd.xy);
	vec2 outputB = even.zw + multiplyComplex(twiddle, odd.zw);

	gl_FragColor = vec4(outputA, outputB);
}