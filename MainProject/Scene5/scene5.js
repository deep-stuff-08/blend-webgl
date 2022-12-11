var scene5Deep = {
	programPhongLight: null,
	uniformsPhongLight: null,
	cubeRoom: null,
	fboScreen: null,
	texScreen: null,
	wallTexture: null
}

function setupProgramForScene5Deep() {
	scene5Deep.programPhongLight = progPhongLightWithTexture.program
	scene5Deep.uniformsPhongLight = progPhongLightWithTexture.uniforms

	setupProgramForEarthDeep()
	setupProgramForPCDeep()
	setupProgramForTableDeep()
	setupProgramForTVDeep()
}

function initForScene5Deep() {
	scene5Deep.cubeRoom = initCubeForShapesDeep()
	scene5Deep.wallTexture = loadTexture("resources/textures/whitewall.jpg", false)

	initForEarthDeep()
	initForPCDeep()
	initForTableDeep()
	initForTVDeep()

	scene5Deep.fboScreen = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboScreen)

	scene5Deep.texScreen = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.texScreen)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene5Deep.texScreen, 0)

	var rbo = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, 1024, 1024)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	cameraPosition = [ 0.0, -2.0, 7.9 ]
}

const monitorScale = [0.44, 0.37]

function renderForScene5Deep(perspectiveMatrix, viewMatrix) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, scene5Deep.fboScreen)
	gl.clearBufferfv(gl.COLOR, 0, [0.1, 0.1, 0.1, 1.0])
	gl.clearBufferfv(gl.DEPTH, 0, [1.0])
	gl.viewport(0, 0, 1024, 1024)
	var projMatrixEarth = mat4.create()
	mat4.perspective(projMatrixEarth, glMatrix.toRadian(45.0), monitorScale[0] / monitorScale[1], 0.1, 100.0)
	var viewMatrixEarth = mat4.create()
	mat4.lookAt(viewMatrixEarth, [0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])
	renderForEarthDeep(projMatrixEarth, viewMatrixEarth)

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.viewport(0, 0, canvas.width, canvas.height)
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
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, scene5Deep.wallTexture)
	renderCubeForShapesDeep(scene5Deep.cubeRoom)
	gl.useProgram(null)
	
	// renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 0.0, 0.0])

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -2.325, -5.75])
	renderForPCDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, scene5Deep.texScreen, monitorScale)

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
				renderForTVDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, scene5Deep.texScreen)
			}
		}
	}
}