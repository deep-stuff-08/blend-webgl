var pcDeep = {
	programModel: null,
	programScreen: null,
	vaoScreen: null,
	fboScreen: null,
	texScreen: null,
	uniformsModel: {
		pMat: null,
		vMat: null,
		mMat: null,
		diffuseTexture: null
	}
}

function setupProgramForPCDeep() {
	var vertShader = createShader('shaders/phonglighttex.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('shaders/phonglighttex.frag', gl.FRAGMENT_SHADER)
	pcDeep.programModel = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	pcDeep.uniformsModel.pMat = gl.getUniformLocation(pcDeep.programModel, "pMat")
	pcDeep.uniformsModel.vMat = gl.getUniformLocation(pcDeep.programModel, "vMat")
	pcDeep.uniformsModel.mMat = gl.getUniformLocation(pcDeep.programModel, "mMat")
	pcDeep.uniformsModel.diffuseTexture = gl.getUniformLocation(pcDeep.programModel, "samplerDiffuse")
}

function initForPCDeep() {
	var screen = new Float32Array([ 
		1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
		-1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
		-1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,

		-1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
		1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
		1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
	])

	pcDeep.vaoScreen = gl.createVertexArray()
	var vbo = gl.createBuffer()
	gl.bindVertexArray(pcDeep.vaoScreen)
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, screen, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	gl.bindVertexArray(null)

	pcDeep.fboScreen = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, pcDeep.fboScreen)

	pcDeep.texScreen = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, pcDeep.texScreen)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pcDeep.texScreen, 0)

	var rbo = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	pcModelForTestModelLoadByDeep = initalizeModel("PC")
}

function renderForPCDeep(perspectiveMatrix, viewMatrix) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, pcDeep.fboScreen)
	gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.1, 0.1, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])
	gl.viewport(0, 0, 1024, 1024)
	var projMatrixEarth = mat4.create()
	mat4.perspective(projMatrixEarth, glMatrix.toRadian(45.0), 0.44 / 0.37, 0.1, 100.0)
	var viewMatrixEarth = mat4.create()
	mat4.lookAt(viewMatrixEarth, [0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])
	renderForEarthDeep(projMatrixEarth, viewMatrixEarth)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
	var modelMatrix = mat4.create()
	mat4.rotate(modelMatrix, modelMatrix, -Math.PI / 2, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5])
	
	gl.useProgram(pcDeep.programModel)
	gl.uniformMatrix4fv(pcDeep.uniformsModel.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(pcDeep.uniformsModel.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(pcDeep.uniformsModel.mMat, false, modelMatrix)
	gl.uniform1i(pcDeep.uniformsModel.diffuse, 0)
	renderModel(pcModelForTestModelLoadByDeep)

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-0.01, 0.525, 0.09])
	mat4.rotate(modelMatrix, modelMatrix, -0.14, [1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.44, 0.37, 1.0])
	gl.uniformMatrix4fv(pcDeep.uniformsModel.mMat, false, modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, pcDeep.texScreen)
	gl.bindVertexArray(pcDeep.vaoScreen)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}