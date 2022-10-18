#include"triangle.h"
#include"gl/glew.h"
#include"global.h"

#include"colorshader.h"

#include"vmath.h"

using namespace vmath;

GLuint vao;

void initTriangle() {
	float array[] = {
		0.0f, 1.0f, 0.0f,
		-1.0f, -1.0f, 0.0f,
		1.0f, -1.0f, 0.0f
	};

	GLuint vbo;

	glGenVertexArrays(1, &vao);
	glBindVertexArray(vao);
	glGenBuffers(1, &vbo);
	glBindBuffer(GL_ARRAY_BUFFER, vbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(array), array, GL_STATIC_DRAW);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, (void*)0);
}

void setupTriangle() {
}

void renderTriangle() {
	glUseProgram(basicColorProgram);
	glUniform4f(basicColorUniforms.color, 1.0f, 0.5f, 0.0f, 1.0f);
	glUniformMatrix4fv(basicColorUniforms.mvpMatrix, 1, GL_FALSE, perspectiveMatrix * translate(0.0f, 0.0f, -4.0f));
	glBindVertexArray(vao);
	glDrawArrays(GL_TRIANGLES, 0, 3);
	glBindVertexArray(0);
	glUseProgram(0);
}

void uninitTriangle() {
	glDeleteVertexArrays(1, &vao);
}