var programForDeepFire
var programForDeepFullscreen
var vaoForDeepFire
var woodTextureForDeepFire

var mUniform
var vUniform
var pUniform
var resolutionUniform
var timeUniform
var woodTextureUniform
var fboForDeepFire
var texFireForDeepFire
var time = 0.0

function initForDeepFire() {
	var vertShader = createShader("fire.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("fire.frag", gl.FRAGMENT_SHADER)

	programForDeepFire = createProgram([vertShader, fragShader])
	
	resolutionUniform = gl.getUniformLocation(programForDeepFire, "resolution")
	timeUniform = gl.getUniformLocation(programForDeepFire, "time")

	deleteShader(vertShader)
	deleteShader(fragShader)

	vertShader = createShader("fullscreenquad.vert", gl.VERTEX_SHADER)
	fragShader = createShader("fullscreenquad.frag", gl.FRAGMENT_SHADER)
	
	programForDeepFullscreen = createProgram([vertShader, fragShader])
	
	mUniform = gl.getUniformLocation(programForDeepFullscreen, "mMat")
	vUniform = gl.getUniformLocation(programForDeepFullscreen, "vMat")
	pUniform = gl.getUniformLocation(programForDeepFullscreen, "pMat")
	woodTextureUniform = gl.getUniformLocation(programForDeepFullscreen, "woodTex")
	fireTextureUniform = gl.getUniformLocation(programForDeepFullscreen, "fireTex")
	
	deleteShader(vertShader)
	deleteShader(fragShader)

	vaoForDeepFire = gl.createVertexArray()

	woodTextureForDeepFire = loadTexture("wood.png")

	fboForDeepFire = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, fboForDeepFire)

	texFireForDeepFire = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texFireForDeepFire)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texFireForDeepFire, 0)

	gl.drawBuffers([gl.COLOR_ATTACHMENT0])
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

function renderFireForDeepFire() {
	gl.viewport(0, 0, 1024, 1024)
	gl.useProgram(programForDeepFire)
	gl.uniform2f(resolutionUniform, 1024, 1024)
	gl.uniform1f(timeUniform, time)

	gl.bindVertexArray(vaoForDeepFire)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	time += 0.005
}

function renderQuad(perspectiveMatrix, viewMatrix) {
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.useProgram(programForDeepFullscreen)
	var mMat = mat4.create()
	gl.uniformMatrix4fv(pUniform, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vUniform, false, viewMatrix)
	gl.uniformMatrix4fv(mUniform, false, mMat)
	gl.bindVertexArray(vaoForDeepFire)
	gl.uniform1i(woodTextureUniform, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, woodTextureForDeepFire)
	gl.uniform1i(fireTextureUniform, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, texFireForDeepFire)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function renderForDeepFire(perspectiveMatrix, viewMatrix) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, fboForDeepFire)
	renderFireForDeepFire()

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	renderQuad(perspectiveMatrix, viewMatrix)
}

function uninitForDeepFire() {
	gl.deleteVertexArray(vao)
	gl.deleteBuffer(vbo)
	gl.deleteProgram(program)
}