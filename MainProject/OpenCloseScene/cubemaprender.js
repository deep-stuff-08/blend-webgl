var progCubemap = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null,
		isEvening: null
	},
	cube: null
}

function setupProgramForCubemapRendererDeep() {
	vertShader = createShader('OpenCloseScene/shaders/cubemap.vert', gl.VERTEX_SHADER)
	fragShader = createShader('OpenCloseScene/shaders/noisecubemap.frag', gl.FRAGMENT_SHADER)
	progCubemap.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progCubemap.uniforms.pMat = gl.getUniformLocation(progCubemap.program, "pMat")
	progCubemap.uniforms.vMat = gl.getUniformLocation(progCubemap.program, "vMat")
	progCubemap.uniforms.isEvening = gl.getUniformLocation(progCubemap.program, "isEvening")

}

function initForCubemapRendererDeep() {
	progCubemap.cube = dshapes.initCube()
}

var f = 0.0

function renderCubemapDeep(perspectiveMatrix, viewMatrix, isEvening) {
	var vMat = mat4.clone(viewMatrix)
	mat4.rotate(vMat, vMat, -f, [0.0, 1.0, 0.0])

	vMat[12] = 0.0
	vMat[13] = 0.0
	vMat[14] = 0.0

	gl.disable(gl.DEPTH_TEST)
	gl.useProgram(progCubemap.program)
	gl.uniformMatrix4fv(progCubemap.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progCubemap.uniforms.vMat, false, vMat)
	gl.uniform1i(progCubemap.uniforms.isEvening, isEvening)
	progCubemap.cube.render()
	gl.useProgram(null)
	gl.enable(gl.DEPTH_TEST)

	f += 0.001
}