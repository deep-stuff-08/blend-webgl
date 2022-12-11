#version 300 es

layout(location = 0)in vec4 vPos;

uniform mat4 pMat;
uniform mat4 vMat;
uniform vec3 lightPos;

void main(void) {
	gl_Position = pMat * vMat * vec4(vPos.xyz * 0.1 + lightPos, 1.0);
}
