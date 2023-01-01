"use strict"
var smokeDeep = {
	vao: null,
	program: null,
	time: null,
	uniforms: {
		resolution: null,
		time: null
	}
}

function setupProgramForSmokeDeep() {
	var vertShader = createShader("Scene5/shaders/smoke.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("Scene5/shaders/smoke.frag", gl.FRAGMENT_SHADER)

	smokeDeep.program = createProgram([vertShader, fragShader])
	
	smokeDeep.uniforms.resolution = gl.getUniformLocation(smokeDeep.program, "resolution")
	smokeDeep.uniforms.time = gl.getUniformLocation(smokeDeep.program, "time")

	deleteShader(vertShader)
	deleteShader(fragShader)
}

function initForSmokeDeep() {
	smokeDeep.vao = gl.createVertexArray()
	smokeDeep.time = 0.0
}

function renderForSmokeDeep(resolution) {
	gl.useProgram(smokeDeep.program)
	gl.uniform2fv(smokeDeep.uniforms.resolution, resolution)
	gl.uniform1f(smokeDeep.uniforms.time, smokeDeep.time)

	gl.bindVertexArray(smokeDeep.vao)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	smokeDeep.time += 0.005
}
