"use strict"
var scene5Deep = {
	programPhongLight: null,
	uniformsPhongLight: null,
	cubeRoom: null,
	quad: null,
	fboEarth: null,
	texEarth: null,
	fboFire: null,
	texFire: null,
	fboSmoke: null,
	texSmoke: null,
	texWall: null,
	texSpace: null,
	programFireEarth: null,
	uniformsFireEarth: {
		pMat: null,
		vMat: null,
		mMat: null,
		diffuseTextureSamplerEarth: null,
		diffuseTextureSamplerFire: null
	}
}

function setupProgramForScene5Deep() {
	scene5Deep.programPhongLight = progPhongLightWithTexture.program
	scene5Deep.uniformsPhongLight = progPhongLightWithTexture.uniforms

	setupProgramForEarthDeep()
	setupProgramForPCDeep()
	setupProgramForTableDeep()
	setupProgramForTVDeep()
	setupProgramForFireDeep()
	setupProgramForSmokeDeep()

	var vertShader = createShader('Scene5/shaders/fireonearth.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('Scene5/shaders/fireonearth.frag', gl.FRAGMENT_SHADER)
	scene5Deep.programFireEarth = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	scene5Deep.uniformsFireEarth.pMat = gl.getUniformLocation(scene5Deep.programFireEarth, "pMat")
	scene5Deep.uniformsFireEarth.vMat = gl.getUniformLocation(scene5Deep.programFireEarth, "vMat")
	scene5Deep.uniformsFireEarth.mMat = gl.getUniformLocation(scene5Deep.programFireEarth, "mMat")
	scene5Deep.uniformsFireEarth.diffuseTextureSamplerEarth = gl.getUniformLocation(scene5Deep.programFireEarth, "samplerDiffuseEarth")
	scene5Deep.uniformsFireEarth.diffuseTextureSamplerFire = gl.getUniformLocation(scene5Deep.programFireEarth, "samplerDiffuseFire")
}

function initForScene5Deep() {
	scene5Deep.cubeRoom = dshapes.initCube()
	scene5Deep.quad = dshapes.initQuad()
	scene5Deep.texWall = loadTexture("resources/textures/whitewall.jpg", false)
	scene5Deep.texSpace = loadTexture("resources/textures/space.jpg", false)

	initForEarthDeep()
	initForPCDeep()
	initForTableDeep()
	initForTVDeep()
	initForFireDeep()
	initForSmokeDeep()

	scene5Deep.fboEarth = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboEarth)

	scene5Deep.texEarth = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texEarth)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene5Deep.texEarth, 0)

	var rbo = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	scene5Deep.fboFire = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboFire)

	scene5Deep.texFire = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texFire)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene5Deep.texFire, 0)

	rbo = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	scene5Deep.fboSmoke = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboSmoke)

	scene5Deep.texSmoke = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texSmoke)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene5Deep.texSmoke, 0)

	rbo = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

const monitorScale = [0.44, 0.37]

function renderForScene5Deep(perspectiveMatrix, viewMatrix) {
	var currentFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
	var currentViewport = gl.getParameter(gl.VIEWPORT)

	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboEarth)
	gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.1, 0.1, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])
	gl.viewport(0, 0, 1024, 1024)
	gl.disable(gl.DEPTH_TEST)
	gl.useProgram(scene5Deep.programPhongLight)
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.pMat, false, mat4.create())
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.vMat, false, mat4.create())
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.mMat, false, mat4.create())
	gl.uniform1i(scene5Deep.uniformsPhongLight.diffuseTextureSampler, 0)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isLight, 0)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isTexture, 1)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isBlend, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texSpace)
	scene5Deep.quad.render()
	gl.enable(gl.DEPTH_TEST)
	gl.useProgram(null)
	var projMatrixEarth = mat4.create()
	mat4.perspective(projMatrixEarth, glMatrix.toRadian(45.0), monitorScale[0] / monitorScale[1], 0.1, 100.0)
	var viewMatrixEarth = mat4.create()
	mat4.lookAt(viewMatrixEarth, [0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])
	renderForEarthDeep(projMatrixEarth, viewMatrixEarth)
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboFire)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.1, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])
	gl.viewport(0, 0, 1024, 1024)
	renderForFireDeep([1024, 1024])

	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboSmoke)
	gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.1, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])
	gl.viewport(0, 0, 1024, 1024)
	renderForSmokeDeep([1024, 1024])

	gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo)
	gl.viewport(currentViewport[0], currentViewport[1], currentViewport[2], currentViewport[3])
	var modelMatrix = mat4.create()
	var lightPosition = [0.0, 3.9, 0.0]
	mat4.scale(modelMatrix, modelMatrix, [8.0, 4.0, 8.0])
	gl.useProgram(scene5Deep.programPhongLight)
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.mMat, false, modelMatrix)
	gl.uniform3fv(scene5Deep.uniformsPhongLight.lightPos, lightPosition)
	gl.uniform1i(scene5Deep.uniformsPhongLight.diffuseTextureSampler, 0)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isInvertNormals, 1)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isLight, 1)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isTexture, 1)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isBlend, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texWall)
	scene5Deep.cubeRoom.render()
	
	// renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 0.0, 0.0])

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -2.325, -5.75])
	renderForPCDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, scene5Deep.texEarth, scene5Deep.texFire)
	
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -3.2, -5.9])
	mat4.scale(modelMatrix, modelMatrix, [1.5, 1.5, 1.5])
	renderForTableDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition)

	const tvCount = [9, 5]
	const tvLimit = [15.5, 7.5]

	for(var k = 0; k < 3; k++) {
		var rot = (-Math.PI / 2.0) + (k * Math.PI / 2.0)
		for(var i = 0; i < tvCount[0]; i++) {
			var tx = i * (tvLimit[0] / tvCount[0])
			for(var j = 0; j < tvCount[1]; j++) {
				var ty = j * (tvLimit[1] / tvCount[1])
				modelMatrix = mat4.create()
				mat4.rotate(modelMatrix, modelMatrix, rot, [0.0, 1.0, 0.0])
				mat4.translate(modelMatrix, modelMatrix, [-(tvLimit[0] / 2.0) + (16.0 / tvCount[0] / 2.0) + tx, (tvLimit[1] / 2.0) - (8.0 / tvCount[1] / 2.0) - ty, -7.95])
				mat4.scale(modelMatrix, modelMatrix, [monitorScale[0] * 1.6, monitorScale[1] * 1.6, 1.0])
				renderForTVDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, scene5Deep.texEarth, scene5Deep.texFire)
			}
		}
	}

	gl.useProgram(scene5Deep.programPhongLight)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -2.5, 0.0])
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.mMat, false, modelMatrix)
	gl.uniform1i(scene5Deep.uniformsPhongLight.diffuseTextureSampler, 0)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isLight, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texSmoke)
	gl.uniform1i(scene5Deep.uniformsPhongLight.isBlend, 1)
	gl.enable(gl.BLEND)
	scene5Deep.quad.render()
	modelMatrix = mat4.create()
	
	mat4.translate(modelMatrix, modelMatrix, [0.0, -3.0, 0.01])
	gl.uniformMatrix4fv(scene5Deep.uniformsPhongLight.mMat, false, modelMatrix)
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texFire)
	scene5Deep.quad.render()
	gl.disable(gl.BLEND)
	gl.useProgram(null)
}