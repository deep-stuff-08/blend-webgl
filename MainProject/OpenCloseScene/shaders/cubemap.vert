#version 300 es

layout(location = 0)in vec4 vPos;

uniform mat4 pMat;
uniform mat4 vMat;

out vec3 tex;

void main(void) {
	tex = vec3(vPos.x, vPos.y, vPos.z);
	vec4 pos = pMat * vMat * vec4(vPos);
	gl_Position = pos.xyzw;
}