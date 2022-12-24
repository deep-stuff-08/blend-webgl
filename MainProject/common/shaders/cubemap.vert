#version 300 es

out vec3 tc;

uniform mat4 viewMat;

void main(void) {
	vec3[4] vertices = vec3[4](
		vec3(-1.0, -1.0, 1.0),
		vec3(1.0, -1.0, 1.0),
		vec3(-1.0, 1.0, 1.0),
		vec3(1.0, 1.0, 1.0)
	);
	tc = mat3(viewMat) * vertices[gl_VertexID];

	gl_Position = vec4(vertices[gl_VertexID], 1.0);
}