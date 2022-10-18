#include"colorshader.h"
#include<gl/glew.h>
#include"global.h"

GLuint basicColorProgram;
basicColorProgramUniforms basicColorUniforms;

void initColorShader() {
	const GLchar* vertexSrc = 
"#version 460 core\n"\
"\n"\
"in vec4 vPos;\n"\
"uniform mat4 mvpMatrix;\n"\
"\n"\
"void main(void) {\n"\
"	gl_Position = mvpMatrix * vPos;\n"\
"}\n";
	const GLchar* fragSrc = 
"#version 460 core\n"\
"\n"\
"out vec4 FragColor;\n"\
"uniform vec4 color;\n"\
"\n"\
"void main(void) {\n"\
"	FragColor = color;\n"\
"}\n";

	GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
	GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	basicColorProgram = glCreateProgram();
	compileShader(vertexShader, vertexSrc);
	compileShader(fragmentShader, fragSrc);
	glBindAttribLocation(basicColorProgram, BLEND_POSITION, "vPos");
	glAttachShader(basicColorProgram, vertexShader);
	glAttachShader(basicColorProgram, fragmentShader);
	linkProgram(basicColorProgram);
	basicColorUniforms.color = glGetUniformLocation(basicColorProgram, "color");
	basicColorUniforms.mvpMatrix = glGetUniformLocation(basicColorProgram, "mvpMatrix");
}

void uninitColorShader() {
	glDeleteProgram(basicColorProgram);
}