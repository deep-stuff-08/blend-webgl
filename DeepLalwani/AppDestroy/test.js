var testQuad
var testFbo
var testTex

function testInit() {
	setupProgramForAppDestroyDeep()
	initForAppDestroyDeep()

	testQuad = dshapes.initQuad()

	testFbo = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, testFbo)
	testTex = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, testTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, testTex, 0)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

function testForAppDestroyDeep(perspectiveMatrix, viewMatrix) {
	var currentFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
	var currentViewport = gl.getParameter(gl.VIEWPORT)

	gl.bindFramebuffer(gl.FRAMEBUFFER, testFbo)
	gl.clearBufferfv(gl.COLOR, 0, [0.5, 1.0, 0.25, 1.0])
	gl.viewport(0, 0, 1024, 1024)
	renderForAppDestroyDeep()
	gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo)
	gl.viewport(currentViewport[0], currentViewport[1], currentViewport[2], currentViewport[3])

	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.diffuseTextureSampler, 0)
	gl.uniform3fv(progPhongLightWithTexture.uniforms.lightPos, [0.0, 0.0, 5.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, mat2.create())
	var model = mat4.create()
	mat4.scale(model, model, [0.6, 1.0, 0.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, model)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, testTex)
	testQuad.render()
}