#version 300 es

layout(location = 0)in vec4 vPos;

void main(void) {
	gl_PointSize = 10.0;
	gl_Position = vec4(vPos.xy, 0.0, 1.0);
}