var blurProg = {
	program: null,
	emptyVao: null,

	pingFbo: null,
	pongFbo: null,
	pingTex: null,
	pongTex: null,

	imageSamplerUniform: null,
	horizontalUniform: null,
}

function setupProgramForDeepBlur() {
	var vertShader = createShader("common/shaders/blur.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("common/shaders/blur.frag", gl.FRAGMENT_SHADER)
	
	blurProg.program = createProgram([vertShader, fragShader])
	
	blurProg.imageSamplerUniform = gl.getUniformLocation(blurProg.program, "imageSampler")
	blurProg.horizontalUniform = gl.getUniformLocation(blurProg.program, "horizontal")

	deleteShader(vertShader)
	deleteShader(fragShader)
}

function initForDeepBlur() {
	blurProg.emptyVao = gl.createVertexArray()
	blurProg.pingFbo = gl.createFramebuffer()
	blurProg.pingTex = gl.createTexture()

	blurProg.pongFbo = gl.createFramebuffer()
	blurProg.pongTex = gl.createTexture()
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, blurProg.pingFbo)
	gl.bindTexture(gl.TEXTURE_2D, blurProg.pingTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, 2048, 2048)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurProg.pingTex, 0)
	gl.drawBuffers([gl.COLOR_ATTACHMENT0])	

	gl.bindFramebuffer(gl.FRAMEBUFFER, blurProg.pongFbo)
	gl.bindTexture(gl.TEXTURE_2D, blurProg.pongTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, 2048, 2048)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurProg.pongTex, 0)
	gl.drawBuffers([gl.COLOR_ATTACHMENT0])

	gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

function blurImage(tex) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, blurProg.pingFbo)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0])
	gl.viewport(0, 0, 2048, 2048)
	gl.useProgram(blurProg.program)
	gl.bindVertexArray(blurProg.emptyVao)
	gl.uniform1i(blurProg.imageSamplerUniform, 0)
	gl.uniform1i(blurProg.horizontalUniform, 1)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tex)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	gl.bindTexture(gl.TEXTURE_2D, null)

	gl.bindFramebuffer(gl.FRAMEBUFFER, blurProg.pongFbo)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0])
	gl.viewport(0, 0, 2048, 2048)
	gl.useProgram(blurProg.program)
	gl.bindVertexArray(blurProg.emptyVao)
	gl.uniform1i(blurProg.imageSamplerUniform, 0)
	gl.uniform1i(blurProg.horizontalUniform, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, blurProg.pingTex)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	gl.bindTexture(gl.TEXTURE_2D, null)

	gl.bindVertexArray(null)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.enable(gl.DEPTH_TEST)

	return blurProg.pongTex
}
