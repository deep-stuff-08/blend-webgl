#version 300 es

vec3 quadVertices[4] = vec3[](
	vec3(-1.0, -1.0, 0.0),
	vec3(1.0, -1.0, 0.0),
	vec3(-1.0, 1.0, 0.0),
	vec3(1.0, 1.0, 0.0)
);

void main(void) {
	gl_Position = vec4(quadVertices[gl_VertexID], 1.0);
}