var programForDeepFullscreen
var programForDeepBlur
var woodTextureForDeepFire
var vaoForDeepFire

var pingFbo
var pongFbo
var pingTex
var pongTex

var mUniform
var vUniform
var pUniform
var woodTextureUniform

var imageSampler

function initForDeepFire() {
	var vertShader = createShader("fullscreenquad.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("fullscreenquad.frag", gl.FRAGMENT_SHADER)
	
	programForDeepFullscreen = createProgram([vertShader, fragShader])
	
	mUniform = gl.getUniformLocation(programForDeepFullscreen, "mMat")
	vUniform = gl.getUniformLocation(programForDeepFullscreen, "vMat")
	pUniform = gl.getUniformLocation(programForDeepFullscreen, "pMat")
	woodTextureUniform = gl.getUniformLocation(programForDeepFullscreen, "woodTex")
	
	deleteShader(vertShader)
	deleteShader(fragShader)

	var vertShader = createShader("blur.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("blur.frag", gl.FRAGMENT_SHADER)
	
	programForDeepBlur = createProgram([vertShader, fragShader])
	
	imageSampler = gl.getUniformLocation(programForDeepBlur, "imageSampler")

	deleteShader(vertShader)
	deleteShader(fragShader)

	woodTextureForDeepFire = loadTexture("jd.jpg")

	vaoForDeepFire = gl.createVertexArray()

	initForBlurDeep()
}

function initForBlurDeep() {
	pingFbo = gl.createFramebuffer()
	pingTex = gl.createTexture()

	pongFbo = gl.createFramebuffer()
	pongTex = gl.createTexture()
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, pingFbo)
	gl.bindTexture(gl.TEXTURE_2D, pingTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, 2048, 2048)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pingTex, 0)
	gl.drawBuffers([gl.COLOR_ATTACHMENT0])	

	gl.bindFramebuffer(gl.FRAMEBUFFER, pongFbo)
	gl.bindTexture(gl.TEXTURE_2D, pongTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, 2048, 2048)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pongTex, 0)
	gl.drawBuffers([gl.COLOR_ATTACHMENT0])

	gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

function blurImage(tex) {
	gl.disable(gl.DEPTH_TEST)
	gl.bindFramebuffer(gl.FRAMEBUFFER, pingFbo)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0])
	gl.viewport(0, 0, 2048, 2048)
	gl.useProgram(programForDeepBlur)
	gl.bindVertexArray(vaoForDeepFire)
	gl.uniform1i(imageSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tex) 
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	gl.bindFramebuffer(gl.FRAMEBUFFER, pongFbo)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0])
	gl.viewport(0, 0, 2048, 2048)
	gl.useProgram(programForDeepBlur)
	gl.bindVertexArray(vaoForDeepFire)
	gl.uniform1i(imageSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, pingTex) 
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	gl.bindVertexArray(null)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.enable(gl.DEPTH_TEST)

	return pongTex
}

function renderQuad(perspectiveMatrix, viewMatrix) {
	var blur = blurImage(woodTextureForDeepFire)
	gl.useProgram(programForDeepFullscreen)
	var mMat = mat4.create()
	gl.uniformMatrix4fv(pUniform, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vUniform, false, viewMatrix)
	gl.uniformMatrix4fv(mUniform, false, mMat)
	gl.bindVertexArray(vaoForDeepFire)
	gl.uniform1i(woodTextureUniform, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, blur)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function renderForDeepFire(perspectiveMatrix, viewMatrix) {
	renderQuad(perspectiveMatrix, viewMatrix)
}