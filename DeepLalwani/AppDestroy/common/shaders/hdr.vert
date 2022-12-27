#version 300 es

vec2 quadVertices[4] = vec2[](
	vec2(-1.0, -1.0),
	vec2(1.0, -1.0),
	vec2(-1.0, 1.0),
	vec2(1.0, 1.0)
);

out vec2 texCoord;

void main(void) {
	gl_Position = vec4(quadVertices[gl_VertexID], 0.0, 1.0);
	texCoord = clamp(quadVertices[gl_VertexID], 0.0, 1.0);
}