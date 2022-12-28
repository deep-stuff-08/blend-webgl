#version 300 es

layout(location = 0)in vec4 vPos;
layout(location = 1)in vec2 vLoc;

uniform mat4 pMat;
uniform mat4 mMat;
uniform float time;

out vec2 tex;

void main(void) {
	vec2 direction = vec2(vLoc);
	vec2 offset = vLoc + (direction * time);
	gl_Position = pMat * mMat * (vPos + vec4(offset, 0.0, 0.0));
	tex = (vPos.xy + vLoc) * 0.5 + 0.5;
}
