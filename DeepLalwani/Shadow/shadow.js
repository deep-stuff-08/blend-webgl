var shadowDeep = {
	programLight: null,
	uniformsLight: {
		lpMat: null,
		mMat: null
	},
	programCamera: null,
	uniformsCamera: null,
	quadObj: null,
	cubeObj: null,
	fboLight: null,
	texLightDepth: null,
	texLightColor: null,
	rotationCube: null
}

var lightColorUni

function setupProgramForShadowDeep() {
	var vertShader = createShader('shaders/shadowLight.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('shaders/shadowLight.frag', gl.FRAGMENT_SHADER)
	shadowDeep.programLight = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	shadowDeep.uniformsLight.lpMat = gl.getUniformLocation(shadowDeep.programLight, "lpMat")
	shadowDeep.uniformsLight.mMat = gl.getUniformLocation(shadowDeep.programLight, "mMat")
	lightColorUni = gl.getUniformLocation(shadowDeep.programLight, "lightColor")

	shadowDeep.programCamera = progPhongLightWithTexture.program
	shadowDeep.uniformsCamera = progPhongLightWithTexture.uniforms
}

function initForShadowDeep() {
	shadowDeep.cubeObj = dshapes.initCube()
	shadowDeep.quadObj = dshapes.initQuad()

	shadowDeep.fboLight = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, shadowDeep.fboLight)
	shadowDeep.texLightDepth = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, shadowDeep.texLightDepth)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LESS)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shadowDeep.texLightDepth, 0)
	shadowDeep.texLightColor = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, shadowDeep.texLightColor)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowDeep.texLightColor, 0)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	
	gl.polygonOffset(3.0, 3.0)

	rotationCube = 0.0

	cameraPosition = [0.0, 2.0, 5.0]
}

function renderForShadowDeep(perspectiveMatrix, viewMatrix) {
	var scaleBiasMatrix = new Float32Array([
		0.5, 0.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 0.0,
		0.0, 0.0, 0.5, 0.0,
		0.5, 0.5, 0.5, 1.0
	])

	var lightPos = [0.0, 2.0, 6.0]
	var projMatrix = mat4.create()
	mat4.ortho(projMatrix, -10.0, 10.0, -10.0, 10.0, 1.0, 40.0)
	// mat4.perspective(projMatrix, glMatrix.toRadian(45.0), canvas.width / canvas.height, 0.1, 100.0)
	var lightMatrix = mat4.create()
	mat4.lookAt(lightMatrix, lightPos, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])
	var lpMat = mat4.create()
	mat4.multiply(lpMat, projMatrix, lightMatrix)
	var slpMat = mat4.create()
	mat4.multiply(slpMat, scaleBiasMatrix, lpMat)
	// mat4.multiply(lpMat, perspectiveMatrix, viewMatrix)

	var renderScene = function(uniformmMat) {
		var mMat
		mMat = mat4.create()
		mat4.translate(mMat, mMat, [0.0, -1.0, -5.0])
		mat4.rotate(mMat, mMat, Math.PI / 2, [-1.0, 0.0, 0.0])
		mat4.scale(mMat, mMat, [5.0, 5.0, 5.0])
		gl.uniformMatrix4fv(uniformmMat, false, mMat)
		shadowDeep.quadObj.render()
	
		mMat = mat4.create()
		mat4.translate(mMat, mMat, [0.0, 4.0, -10.0])
		mat4.scale(mMat, mMat, [5.0, 5.0, 5.0])
		gl.uniformMatrix4fv(uniformmMat, false, mMat)
		shadowDeep.quadObj.render()
	
		mMat = mat4.create()
		mat4.translate(mMat, mMat, [0.0, 1.0, -5.0])
		mat4.rotate(mMat, mMat, shadowDeep.rotationCube, [0.0, 1.0, 0.0])
		gl.uniformMatrix4fv(uniformmMat, false, mMat)
		shadowDeep.cubeObj.render()
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, shadowDeep.fboLight)
	gl.clearBufferfv(gl.COLOR, 0, [1.0, 0.0, 1.0, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])
	gl.viewport(0, 0, 1024, 1024)
	gl.useProgram(shadowDeep.programLight)
	gl.uniformMatrix4fv(shadowDeep.uniformsLight.lpMat, false, lpMat)
	gl.enable(gl.POLYGON_OFFSET_FILL)
	renderScene(shadowDeep.uniformsLight.mMat)
	gl.disable(gl.POLYGON_OFFSET_FILL)

	//testDepthBuffer
	if(false) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.useProgram(shadowDeep.programCamera)
		gl.uniform1i(shadowDeep.uniformsCamera.isLight, 0)
		gl.uniform1i(shadowDeep.uniformsCamera.isTexture, 1)
		gl.uniform1i(shadowDeep.uniformsCamera.isBlend, 0)
		gl.uniform1i(shadowDeep.uniformsCamera.isShadow, 0)
		gl.uniformMatrix4fv(shadowDeep.uniformsCamera.pMat, false, mat4.create())
		gl.uniformMatrix4fv(shadowDeep.uniformsCamera.vMat, false, mat4.create())
		gl.uniformMatrix4fv(shadowDeep.uniformsCamera.mMat, false, mat4.create())
		gl.uniform1i(shadowDeep.uniformsCamera.diffuseTextureSampler, 0)
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, shadowDeep.texLightDepth)
		shadowDeep.quadObj.render()
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
	gl.useProgram(shadowDeep.programCamera)
	gl.uniform1i(shadowDeep.uniformsCamera.isLight, 1)
	gl.uniform1i(shadowDeep.uniformsCamera.isTexture, 0)
	gl.uniform1i(shadowDeep.uniformsCamera.isBlend, 0)
	gl.uniform1i(shadowDeep.uniformsCamera.isShadow, 1)
	gl.uniformMatrix4fv(shadowDeep.uniformsCamera.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(shadowDeep.uniformsCamera.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(shadowDeep.uniformsCamera.slpMat, false, slpMat)
	gl.uniform3fv(shadowDeep.uniformsCamera.lightPos, lightPos)
	gl.uniform1i(shadowDeep.uniformsCamera.diffuseTextureSampler, 0)
	gl.uniform1i(shadowDeep.uniformsCamera.shadowTextureSampler, 1)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, shadowDeep.texLightColor)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, shadowDeep.texLightDepth)
	renderScene(shadowDeep.uniformsCamera.mMat)

	renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPos, [0.5, 0.5, 0.5])

	shadowDeep.rotationCube += 0.01
}