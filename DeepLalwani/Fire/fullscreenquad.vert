#version 300 es

vec2 quadVertices[4] = vec2[](
	vec2(-1.0, -1.0),
	vec2(1.0, -1.0),
	vec2(-1.0, 1.0),
	vec2(1.0, 1.0)
);

uniform mat4 pMat;
uniform mat4 vMat;
uniform mat4 mMat;

out vec2 texcoords;

void main(void) {
	texcoords = clamp(quadVertices[gl_VertexID], 0.0, 1.0);
	gl_Position = pMat * vMat * mMat * vec4(quadVertices[gl_VertexID], 0.0, 1.0);
}