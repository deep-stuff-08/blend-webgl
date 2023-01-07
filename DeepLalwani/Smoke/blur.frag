#version 300 es

precision highp float;

uniform sampler2D imageSampler;

layout(location = 0)out vec4 FragColor;

in vec2 texcoord;

const float weights[] = float[](
	0.0024499299678342,
	0.0043538453346397,
	0.0073599963704157,
	0.0118349786570722,
	0.0181026699707781,
	0.0263392293891488,
	0.0364543006660986,
	0.0479932050577658,
	0.0601029809166942,
	0.0715974486241365,
	0.0811305381519717,
	0.0874493212267511,
	0.0896631113333857,
	0.0874493212267511,
	0.0811305381519717,
	0.0715974486241365,
	0.0601029809166942,
	0.0479932050577658,
	0.0364543006660986,
	0.0263392293891488,
	0.0181026699707781,
	0.0118349786570722,
	0.0073599963704157,
	0.0043538453346397,
	0.0024499299678342
);

void main(void) {
	vec4 c = vec4(0.0);
	for(int i = -weights.length() >> 1; i <= weights.length() >> 1; i++) {
		c += texture(imageSampler, texcoord.yx + vec2(0, float(i) * (1.0 / 400.0))) * weights[i];
	}
	FragColor = c;
}