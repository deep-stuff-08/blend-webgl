"use strict"
var fireDeep = {
	vao: null,
	program: null,
	time: null,
	uniforms: {
		resolution: null,
		time: null
	}
}

function setupProgramForFireDeep() {
	var vertShader = createShader("Scene5/shaders/fire.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("Scene5/shaders/fire.frag", gl.FRAGMENT_SHADER)

	fireDeep.program = createProgram([vertShader, fragShader])
	
	fireDeep.uniforms.resolution = gl.getUniformLocation(fireDeep.program, "resolution")
	fireDeep.uniforms.time = gl.getUniformLocation(fireDeep.program, "time")

	deleteShader(vertShader)
	deleteShader(fragShader)
}

function initForFireDeep() {
	fireDeep.vao = gl.createVertexArray()
	fireDeep.time = 0.0
}

function renderForFireDeep(resolution) {
	gl.useProgram(fireDeep.program)
	gl.uniform2fv(fireDeep.uniforms.resolution, resolution)
	gl.uniform1f(fireDeep.uniforms.time, fireDeep.time)

	gl.bindVertexArray(fireDeep.vao)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	fireDeep.time += 0.005
}
