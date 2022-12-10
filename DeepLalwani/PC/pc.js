var pcModelForTestModelLoadByDeep
var vaoForPCScreenByDeep
var programForTestModelLoadByDeep
var earthTextureForScreen
var earthFBOForScreen

var uniformsForTestModelLoadByDeep = {
	pMat: null,
	vMat: null,
	mMat: null,
	diffuse: null,
}

function setupProgramForTestModelLoadByDeep() {
	var vertShader = createShader('demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('demo.frag', gl.FRAGMENT_SHADER);
	programForTestModelLoadByDeep = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	uniformsForTestModelLoadByDeep.pMat = gl.getUniformLocation(programForTestModelLoadByDeep, "pMat")
	uniformsForTestModelLoadByDeep.vMat = gl.getUniformLocation(programForTestModelLoadByDeep, "vMat")
	uniformsForTestModelLoadByDeep.mMat = gl.getUniformLocation(programForTestModelLoadByDeep, "mMat")
	uniformsForTestModelLoadByDeep.diffuse = gl.getUniformLocation(programForTestModelLoadByDeep, "diffuse")
}

function initForTestModelLoadByDeep() {
	var screen = new Float32Array([ 
		1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
		-1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
		-1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,

		-1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
		1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
		1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
	])
	vaoForPCScreenByDeep = gl.createVertexArray()
	var vboForPCScreenByDeep = gl.createBuffer()
	gl.bindVertexArray(vaoForPCScreenByDeep)
	gl.bindBuffer(gl.ARRAY_BUFFER, vboForPCScreenByDeep)
	gl.bufferData(gl.ARRAY_BUFFER, screen, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	gl.bindVertexArray(null)

	earthFBOForScreen = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, earthFBOForScreen)
	earthTextureForScreen = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, earthTextureForScreen)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	// gl.generateMipmap(gl.TEXTURE_2D)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, earthTextureForScreen, 0)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	pcModelForTestModelLoadByDeep = initalizeModel("PC")
}

{
var angle = 0.0
function renderForTestModelLoadByDeep(perspectiveMatrix, viewMatrix) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, earthFBOForScreen)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 0.0])

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	var modelMatrix = mat4.create()
	mat4.rotate(modelMatrix, modelMatrix, -Math.PI / 2, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5])
	
	gl.useProgram(programForTestModelLoadByDeep)
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.mMat, false, modelMatrix)
	gl.uniform1i(uniformsForTestModelLoadByDeep.diffuse, 0)
	renderModel(pcModelForTestModelLoadByDeep)
	
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-0.01, 0.525, 0.09])
	mat4.rotate(modelMatrix, modelMatrix, -0.14, [1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.44, 0.37, 1.0])
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.mMat, false, modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, earthTextureForScreen)
	gl.bindVertexArray(vaoForPCScreenByDeep)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
	angle += 0.01
}
}