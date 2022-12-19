var progLightSource = {
	program: null,
	cube: null,
	uniforms: {
		pMat: null,
		vMat: null,
		lightPos: null,
		lightColor: null
	}
}

function setupProgramForLightSourceRendererDeep() {
	var vertShader = createShader('common/shaders/lightsource.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('common/shaders/lightsource.frag', gl.FRAGMENT_SHADER)
	progLightSource.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progLightSource.uniforms.pMat = gl.getUniformLocation(progLightSource.program, "pMat")
	progLightSource.uniforms.vMat = gl.getUniformLocation(progLightSource.program, "vMat")
	progLightSource.uniforms.lightPos = gl.getUniformLocation(progLightSource.program, "lightPos")
	progLightSource.uniforms.lightColor = gl.getUniformLocation(progLightSource.program, "lightColor")
}

function initForLightSourceRendererDeep() {
	progLightSource.cube = dshapes.initCube()
}

function renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPos, lightColor) {
	gl.useProgram(progLightSource.program)
	gl.uniformMatrix4fv(progLightSource.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progLightSource.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(progLightSource.uniforms.lightPos, lightPos)
	gl.uniform3fv(progLightSource.uniforms.lightColor, lightColor)
	progLightSource.cube.render()
	gl.useProgram(null)
}