var tvDeep = {
	program: null,
	programScreen: null,
	uniforms: null,
	cubeObj: null,
	texWood: null,
	uniformsScreen: {
		pMat: null,
		vMat: null,
		mMat: null,
		diffuseTextureSampler: null
	}
}

function setupProgramForTVDeep() {
	tvDeep.program = progPhongLightWithTexture.program
	tvDeep.uniforms = progPhongLightWithTexture.uniforms
	
	//Phong Light with Texture Support
	var vertShader = createShader('shaders/screen.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('shaders/screen.frag', gl.FRAGMENT_SHADER)
	tvDeep.programScreen = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	tvDeep.uniformsScreen.pMat = gl.getUniformLocation(tvDeep.programScreen, "pMat")
	tvDeep.uniformsScreen.vMat = gl.getUniformLocation(tvDeep.programScreen, "vMat")
	tvDeep.uniformsScreen.mMat = gl.getUniformLocation(tvDeep.programScreen, "mMat")
	tvDeep.uniformsScreen.diffuseTextureSampler = gl.getUniformLocation(tvDeep.programScreen, "samplerDiffuse")
}

function initForTVDeep() {
	tvDeep.cubeObj = initCubeForShapesDeep()
	tvDeep.texWood = loadTexture("resources/textures/wood.png")
}

function renderForTVDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPos, texObj) {
	var localMatrix = mat4.create()
	gl.useProgram(tvDeep.program)
	gl.uniformMatrix4fv(tvDeep.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(tvDeep.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(tvDeep.uniforms.lightPos, lightPos)
	gl.uniform1i(tvDeep.uniforms.isInvertNormals, 0)
	gl.uniform1i(tvDeep.uniforms.diffuseTextureSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tvDeep.texWood)

	mat4.translate(localMatrix, modelMatrix, [0.0, 1.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tvDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [0.0, -1.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tvDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [1.03, 0.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [0.05, 1.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tvDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [-1.03, 0.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [0.05, 1.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tvDeep.cubeObj)

	gl.useProgram(tvDeep.programScreen)
	gl.bindTexture(gl.TEXTURE_2D, texObj)
	mat4.translate(localMatrix, modelMatrix, [0.0, 0.0, -0.01])
	mat4.scale(localMatrix, localMatrix, [1.0, 1.0, 0.01])
	gl.uniformMatrix4fv(tvDeep.uniformsScreen.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(tvDeep.uniformsScreen.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(tvDeep.uniformsScreen.mMat, false, localMatrix)
	gl.uniform1i(tvDeep.uniformsScreen.diffuseTextureSampler, 0)
	renderCubeForShapesDeep(tvDeep.cubeObj)
	gl.useProgram(null)
}