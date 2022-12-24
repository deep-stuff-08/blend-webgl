var progCubemap = {
	program: null,
	uniforms: {
		vMat: null,
		diffuseCubeTexture: null
	},
	vao: null
}

function setupProgramForCubemapRendererDeep() {
	vertShader = createShader('common/shaders/cubemap.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/cubemap.frag', gl.FRAGMENT_SHADER)
	progCubemap.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progCubemap.uniforms.vMat = gl.getUniformLocation(progCubemap.program, "viewMat")
	progCubemap.uniforms.diffuseCubeTexture = gl.getUniformLocation(progCubemap.program, "texCube")
}

function initForCubemapRendererDeep() {
	progCubemap.vao = gl.createVertexArray()
}

function renderCubemapDeep(viewMatrix, cubemapTexture) {
	gl.disable(gl.DEPTH_TEST)
	gl.useProgram(progCubemap.program)
	gl.uniformMatrix4fv(progCubemap.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progCubemap.uniforms.diffuseCubeTexture, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture)
	gl.bindVertexArray(progCubemap.vao)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	gl.bindVertexArray(null)
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
	gl.useProgram(null)
	gl.enable(gl.DEPTH_TEST)
}