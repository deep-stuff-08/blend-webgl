var progCubemap = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null
	},
	cube: null
}

function setupProgramForCubemapRendererDeep() {
	vertShader = createShader('common/shaders/cubemap.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/noisecubemap.frag', gl.FRAGMENT_SHADER)
	progCubemap.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progCubemap.uniforms.pMat = gl.getUniformLocation(progCubemap.program, "pMat")
	progCubemap.uniforms.vMat = gl.getUniformLocation(progCubemap.program, "vMat")
}

function initForCubemapRendererDeep() {
	progCubemap.cube = dshapes.initCube()
}

function renderCubemapDeep(perspectiveMatrix, viewMatrix) {
	var vMat = mat4.clone(viewMatrix)

	vMat[12] = 0.0
	vMat[13] = 0.0
	vMat[14] = 0.0

	gl.disable(gl.DEPTH_TEST)

	gl.useProgram(progCubemap.program)
	gl.uniformMatrix4fv(progCubemap.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progCubemap.uniforms.vMat, false, vMat)
	progCubemap.cube.render()
	gl.enable(gl.DEPTH_TEST)
}