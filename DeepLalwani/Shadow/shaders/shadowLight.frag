#version 300 es
precision highp float;

layout(location = 0)out vec4 FragColor;

uniform bool isSwitch;
uniform vec3 lightPos;

in vec4 fragpos;

void main(void) {
	if(isSwitch) {
		FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
		gl_FragDepth = gl_FragCoord.z;
	} else {
		float lightDist = length(fragpos.xyz - lightPos);
		lightDist = lightDist / 40.0;
		gl_FragDepth = lightDist;
		FragColor = vec4(lightDist, lightDist, lightDist, 1.0);
	}
}