var scene5Deep = {
	programPhongLight: null,
	uniformsPhongLight: null,
	cubeRoom: null,
	wallTexture: null
}

function setupProgramForScene5Deep() {
	scene5Deep.programPhongLight = progPhongLightWithTexture.program
	scene5Deep.uniformsPhongLight = progPhongLightWithTexture.uniforms

	setupProgramForEarthDeep()
	setupProgramForPCDeep()
}

function initForScene5Deep() {
	scene5Deep.cubeRoom = initCubeForShapesDeep()
	scene5Deep.wallTexture = loadTexture("resources/textures/whitewall.jpg", false)

	initForEarthDeep()
	initForPCDeep()

	cameraPosition = [ 0.0, 0.0, 5.9 ]
}

function renderForScene5Deep(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create()
	var lightPosition = [0.0, 3.9, 0.0]
	mat4.scale(modelMatrix, modelMatrix, [6.0, 4.0, 6.0])
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
	
	renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightPosition, [1.0, 0.0, 0.0])

	modelMatrix = mat4.create()
	trans[2] = -4.75
	mat4.translate(modelMatrix, modelMatrix, trans)
	renderForPCDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition)
}