#version 300 es

vec2 quadVertices[4] = vec2[](
	vec2(-1.0, -1.0),
	vec2(1.0, -1.0),
	vec2(-1.0, 1.0),
	vec2(1.0, 1.0)
);

out vec2 TexCoords;

void main(void) {
	TexCoords = quadVertices[gl_VertexID] * 0.5 + 0.5;
	gl_Position = vec4(quadVertices[gl_VertexID], 0.5, 1.0);
}