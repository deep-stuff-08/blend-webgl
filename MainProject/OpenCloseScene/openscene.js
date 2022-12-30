"use strict"
var opensceneDeep = {
	objQuad: null,
	objCube: null,
	objBrian: null,
	objCars: null,
	objSphere: null,
	vaoCylinderPart: null,
	countCylinderPart: null,
	texFootpath: null,
	texRoad: null,
	texFootpathBorder: null,
	texCementWall: null,
	texBuilding1: null,
	texBuilding2: null,
	phoneScreenFbo: null,
	phoneScreenTex: null,
}

const opensceneDeepConsts = {
	footpathWidth: 2.0, // 2.0 * 2.0
	footpathborderWidth: 0.25, // 0.25 * 2.0
	footpathborderHeight: 0.25, // 0.25 * 2.0
	roadWidth: 6.0, // 2.0 * 6.0
	railingWidth: 0.3, // 2.0 * 0.3
	railingHeight: 0.5, // 2.0 * 0.5
	sceneY: -3.0,
	sceneZ: -95.0,
	footpathRigthDepth: 100.0,
	footpathLeftDepth: 100.0,
	groundWidth: 30.0,
	wallHeight: 1.5,
	wallWidth: 0.2,
	buildingXTrans: 10.0,
	buildingZTrans: 12.5,
	buildingZSpace: 30.0,
	oceanWidth: 1000.0,
	oceanDepth: 100.0,
	lampCount: 8,
	lampDelta: 0
}

var testProgram;

function setupProgramForOpenSceneDeep() {
	setupProgramForCubemapRendererDeep()
	setupProgramForStreetLamp()
	setupProgramForOceanDeep()
	setupProgramForAppDestroyDeep()
}

function initForOpenSceneDeep() {
	initForCubemapRendererDeep()
	initForStreetLamp()
	initForOceanDeep()
	initForAppDestroyDeep()

	opensceneDeepConsts.lampDelta = (opensceneDeepConsts.footpathLeftDepth * 2.0) / (opensceneDeepConsts.lampCount - 1)

	opensceneDeep.objQuad = dshapes.initQuad()
	opensceneDeep.objCube = dshapes.initCube()
	opensceneDeep.objSphere = dshapes.initSphere(30, 30)
	
	opensceneDeep.texFootpath = loadTexture("resources/textures/footpath.jpg", false)
	opensceneDeep.texRoad = loadTexture("resources/textures/road.jpg", false)
	opensceneDeep.texFootpathBorder = loadTexture("resources/textures/footpathborder.jpg", false)
	opensceneDeep.texCementWall = loadTexture("resources/textures/concretestone.jpg", false)
	opensceneDeep.texCity = loadTextureCubemap("resources/textures/sky.jpg", false)
	opensceneDeep.texBuilding1 = loadTexture("resources/textures/building1.png", true)
	opensceneDeep.texBuilding2 = loadTexture("resources/textures/building2.png", true)

	opensceneDeep.phoneScreenFbo = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, opensceneDeep.phoneScreenFbo)
	opensceneDeep.phoneScreenTex = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.phoneScreenTex)
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, opensceneDeep.phoneScreenTex, 0)
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)

	const slices = 10
	var vertexData = []
	for(var j = 0; j <= slices; j++) {
		var theta = ((Math.PI / 2.0) * j / slices) + Math.PI
		vertexData.push(Math.sin(theta) * 2.0 + 1.0)
		vertexData.push(1.0)
		vertexData.push(Math.cos(theta) * 2.0 + 1.0)
		
		vertexData.push(Math.sin(theta))
		vertexData.push(0.0)
		vertexData.push(Math.cos(theta))

		vertexData.push(j / slices)
		vertexData.push(1.0)
	
		vertexData.push(Math.sin(theta) * 2.0 + 1.0)
		vertexData.push(-1.0)
		vertexData.push(Math.cos(theta) * 2.0 + 1.0)
		
		vertexData.push(Math.sin(theta))
		vertexData.push(0.0)
		vertexData.push(Math.cos(theta))

		vertexData.push(j / slices)
		vertexData.push(0.0)
	}
	vertexData.push(1.0)
	vertexData.push(1.0)
	vertexData.push(1.0)
	
	vertexData.push(0.0)
	vertexData.push(1.0)
	vertexData.push(0.0)

	vertexData.push(1.0)
	vertexData.push(0.0)

	for(var j = 0; j <= slices; j++) {
		var theta = ((Math.PI / 2.0) * j / slices) + Math.PI
		vertexData.push(Math.sin(theta) * 2.0 + 1.0)
		vertexData.push(1.0)
		vertexData.push(Math.cos(theta) * 2.0 + 1.0)
		
		vertexData.push(0.0)
		vertexData.push(1.0)
		vertexData.push(0.0)

		vertexData.push(Math.cos(theta) + 1.0)
		vertexData.push(-Math.sin(theta))
	}
	var elements = []
	for(var j = 0; j < slices; j++) {
		elements.push(j * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)

		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push((j + 1) * 2 + 1)
	}
	for(var firstCircle = slices * 2 + 3, j = 0; j < slices; j++) {
		elements.push(firstCircle - 1)
		elements.push(firstCircle + j)
		elements.push(firstCircle + j + 1)
	}
	var elementIndices = Uint16Array.from(elements)
	var vertexArray = Float32Array.from(vertexData)

	opensceneDeep.vaoCylinderPart = gl.createVertexArray()
	opensceneDeep.countCylinderPart = elementIndices.length
	gl.bindVertexArray(opensceneDeep.vaoCylinderPart)

	var vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	
	var eabo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eabo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementIndices, gl.STATIC_DRAW)

	gl.bindVertexArray(null)

	opensceneDeep.objBrian = initalizeModel('Brian')
	opensceneDeep.objCars = []
	opensceneDeep.objCars.push(initalizeModel('BlueCar'))
	opensceneDeep.objCars.push(initalizeModel('BlackCar'))
	opensceneDeep.objCars.push(initalizeModel('SilverCar'))
}

function renderToPhoneTexture() {
	var currentFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
	var currentViewport = gl.getParameter(gl.VIEWPORT)

	gl.bindFramebuffer(gl.FRAMEBUFFER, opensceneDeep.phoneScreenFbo)
	gl.clearBufferfv(gl.COLOR, 0, [0.5, 1.0, 0.25, 1.0])
	gl.viewport(0, 0, 1024, 1024)
	renderForAppDestroyDeep()
	gl.bindFramebuffer(gl.FRAMEBUFFER, currentFbo)
	gl.viewport(currentViewport[0], currentViewport[1], currentViewport[2], currentViewport[3])
}

function renderForCitySceneStaticDeep() {
	//Road
	var texMatrix
	var modelMatrix

	modelMatrix= mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, opensceneDeepConsts.sceneY, opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.roadWidth, opensceneDeepConsts.footpathRigthDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 10.0])
	setTextureMatrixCompleteLight(texMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texRoad)
	opensceneDeep.objQuad.render()

	//Railing
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texCementWall)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathborderWidth + opensceneDeepConsts.footpathWidth) * 2.0) + opensceneDeepConsts.railingWidth), opensceneDeepConsts.sceneY + ((opensceneDeepConsts.footpathborderHeight * 2.0) + (opensceneDeepConsts.railingHeight * 2.0)), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.railingWidth, opensceneDeepConsts.footpathLeftDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 60.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathborderWidth + opensceneDeepConsts.footpathWidth) * 2.0)), opensceneDeepConsts.sceneY + ((opensceneDeepConsts.footpathborderHeight * 2.0) + opensceneDeepConsts.railingHeight), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathLeftDepth, opensceneDeepConsts.railingHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.rotate(texMatrix, texMatrix, Math.PI / 2.0)
	mat2.scale(texMatrix, texMatrix, [60.0, 0.3])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()

	//FootPath
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpath)
	//FootPathLeft
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.roadWidth + opensceneDeepConsts.footpathWidth + (opensceneDeepConsts.footpathborderWidth * 2.0)), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathWidth, opensceneDeepConsts.footpathLeftDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 50.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	//FootPathRight
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + opensceneDeepConsts.footpathWidth + (opensceneDeepConsts.footpathborderWidth * 2.0)), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathWidth, opensceneDeepConsts.footpathRigthDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 50.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()

	//FootPathBorder
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpathBorder)
	//FootPathBorderLeft
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.roadWidth + opensceneDeepConsts.footpathborderWidth), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathborderWidth, opensceneDeepConsts.footpathLeftDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 50.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.roadWidth), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathLeftDepth, opensceneDeepConsts.footpathborderHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.rotate(texMatrix, texMatrix, Math.PI / 2.0)
	mat2.scale(texMatrix, texMatrix, [50.0, 1.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	//FootPathBorderRight
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + opensceneDeepConsts.footpathborderWidth), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathborderWidth, opensceneDeepConsts.footpathLeftDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 50.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, -1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathLeftDepth, opensceneDeepConsts.footpathborderHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.rotate(texMatrix, texMatrix, 3.0 * Math.PI / 2.0)
	mat2.scale(texMatrix, texMatrix, [50.0, 1.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()

	//Ground
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathWidth + opensceneDeepConsts.footpathborderWidth) * 2.0) + opensceneDeepConsts.groundWidth), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.groundWidth, opensceneDeepConsts.footpathLeftDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [30.0, 50.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()

	//Wall
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpath)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathWidth + opensceneDeepConsts.footpathborderWidth) * 2.0)), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0) + opensceneDeepConsts.wallHeight, opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, -1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathLeftDepth, opensceneDeepConsts.wallHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [50.0, 1.5])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathWidth + opensceneDeepConsts.footpathborderWidth) * 2.0) + opensceneDeepConsts.wallWidth), opensceneDeepConsts.sceneY + ((opensceneDeepConsts.footpathborderWidth + opensceneDeepConsts.wallHeight) * 2.0), opensceneDeepConsts.sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.wallWidth, opensceneDeepConsts.footpathLeftDepth, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.1, 50.0])
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()

	//Building
	for(var i = 0; i < 6; i++) {
	modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathWidth + opensceneDeepConsts.footpathborderWidth) * 2.0)) + opensceneDeepConsts.buildingXTrans, opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ + opensceneDeepConsts.footpathLeftDepth - ((opensceneDeepConsts.buildingZSpace * i) + opensceneDeepConsts.buildingZTrans)])
		mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0])
		renderForBuildingDeep(modelMatrix, [2.0, 3.0], opensceneDeep.texBuilding1)
	}

	for(var i = 0; i < 6; i++) {
	modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + ((opensceneDeepConsts.footpathWidth + opensceneDeepConsts.footpathborderWidth) * 2.0)) + opensceneDeepConsts.buildingXTrans, opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth * 2.0), opensceneDeepConsts.sceneZ + opensceneDeepConsts.footpathLeftDepth - ((opensceneDeepConsts.buildingZSpace * i) + opensceneDeepConsts.buildingZTrans + (opensceneDeepConsts.buildingZSpace / 2.0))])
		mat4.scale(modelMatrix, modelMatrix, [5.0, 6.0, 5.0])
		renderForBuildingDeep(modelMatrix, [2.0, 3.0], opensceneDeep.texBuilding2)
	}

	//Lamps
	for(var j = 0; j < 2; j++) {
		modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, [0.0, opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderHeight * 2.0), opensceneDeepConsts.sceneZ])
		mat4.rotate(modelMatrix, modelMatrix, j * Math.PI, [0.0, 1.0, 0.0])
		for(var i = 0; i < opensceneDeepConsts.lampCount; i++) {
			var lmodelMatrix = mat4.clone(modelMatrix)
			mat4.translate(lmodelMatrix, lmodelMatrix, [-(opensceneDeepConsts.roadWidth + opensceneDeepConsts.footpathborderWidth + 0.1), 0.0, opensceneDeepConsts.footpathLeftDepth - (i * opensceneDeepConsts.lampDelta)])
			mat4.scale(lmodelMatrix, lmodelMatrix, [3.4, 3.4, 3.4])
			renderForStreetLamp(lmodelMatrix)
		}
	}
}

function renderForCarDeep(z, dir, i) {
	var modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [2.7 * dir, -1.76, z])
	if(dir == 1) {
		mat4.rotate(modelMatrix, modelMatrix, Math.PI, [0.0, 1.0, 0.0])
	}
	mat4.scale(modelMatrix, modelMatrix, [0.32, 0.32, 0.32])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	renderModel(opensceneDeep.objCars[i])
}

function renderForManSadWalkingDeep(perspectiveMatrix, viewMatrix, z, lightSource) {
	var modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-8.86, -2.5, z])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [1.4, 1.4, 1.4])
	gl.useProgram(progPhongLightWithTextureForModel.program)
	gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isLight, 1)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.diffuseTextureSampler, 0)
	gl.uniform3fv(progPhongLightWithTextureForModel.uniforms.lightPos, lightSource)
	gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.mMat, false, modelMatrix)
	updateModel(opensceneDeep.objBrian, 0, 0.01)
	var boneMat = getBoneMatrixArray(opensceneDeep.objBrian, 0)
	for(var i = 0; i < boneMat.length; i++) {
		gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.bMat[i], false, boneMat[i])
	}
	renderModel(opensceneDeep.objBrian)
}

function renderForBuildingDeep(localModelMatrix, texScale, tex) {
	var modelMatrix
	var texMatrix

	const buildingHeight = 3.0
	const buildingWidth = 1.0
	const buildingDepth = 1.0
	const roofHeight = 0.1
	const roofWidthDepthInc = 0.05
	
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tex)
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [-buildingWidth, buildingHeight, 0.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, -1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [buildingDepth, buildingHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, buildingHeight, buildingDepth])
	mat4.scale(modelMatrix, modelMatrix, [buildingWidth, buildingHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, buildingHeight, -buildingDepth])
	mat4.scale(modelMatrix, modelMatrix, [buildingWidth, buildingHeight, 1.0])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objQuad.render()

	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texCementWall)
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, buildingHeight * 2.0 + roofHeight, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [buildingWidth + roofWidthDepthInc, roofHeight, buildingDepth + roofWidthDepthInc])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	setTextureMatrixCompleteLight(texMatrix)
	opensceneDeep.objCube.render()
}

function renderForOpenSceneDeep(perspectiveMatrix, viewMatrix, viewPos) {
	var modelMatrix
	var lightSources = []
	var start = 5.0
	for(var i = 0; i < 6; i++) {
		lightSources.push([-4.0, 4.5, start])
		lightSources.push([4.0, 4.5, start])
		start -= opensceneDeepConsts.lampDelta
	}

	const spotCutoff = [50, 60]
	const spotDirection = [ 0.0, -1.0, 0.0 ]
	const lightOne = [1.0, 1.0, 1.0]
	const pointAttenuation = [1.0, 0.014, 0.0007]

	//Cubemap
	renderCubemapDeep(perspectiveMatrix, viewMatrix)

	gl.useProgram(progCompleteLight.program)
	resetCompleteLight()
	setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, viewPos)
	setFlagsCompleteLight(false, false, true, true)
	setTextureSamplersCompleteLight(0)
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 1.0, 1.0)
	// addLightCompleteLight(lightSource, [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0])
	// addPointLightCompleteLight(lightSource, [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 0.014, 0.0007])
	addLightCompleteLight([-100.0, 100.0, 0.0], [0.1, 0.1, 0.1], [1.0, 0.5, 0.0], [1.0, 0.0, 0.0])
	for(var i = 0; i < lightSources.length; i++) {
		addSpotLightCompleteLight(lightSources[i], lightOne, lightOne, lightOne, pointAttenuation, spotCutoff, spotDirection)
	}

	renderForCitySceneStaticDeep()
	
	setFlagsCompleteLight(false, false, false, false)
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.2, 0.6, 0.3], [0.7, 0.7, 0.7], 1.0, 1.0)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-500.0, 40.0, -500.0])
	mat4.scale(modelMatrix, modelMatrix, [40.0, 40.0, 40.0])
	setModelMatrixCompleteLight(modelMatrix)
	opensceneDeep.objSphere.render()

	//Cars
	setFlagsCompleteLight(false, false, true, true)
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 1.0, 1.0)
	renderForCarDeep(-10.0, 1, 0)
	renderForCarDeep(-20.0, -1, 1)
	renderForCarDeep(-30.0, 1, 2)

	renderForManSadWalkingDeep(perspectiveMatrix, viewMatrix, -10.0, lightSources[0])

	for(var i = 0; i < lightSources.length; i++) {
		// renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightSources[i], [1.0, 1.0, 1.0])
	}

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.oceanWidth + opensceneDeepConsts.roadWidth + (2.0 * (opensceneDeepConsts.footpathborderWidth + opensceneDeepConsts.footpathWidth + opensceneDeepConsts.railingWidth))), -4.0, -opensceneDeepConsts.oceanDepth])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.oceanWidth, 20.0, opensceneDeepConsts.oceanDepth])
	renderForOceanDeep(perspectiveMatrix, viewMatrix, modelMatrix)

	// // FootPathBorderTurn
	// modelMatrix = mat4.create()
	// mat4.translate(modelMatrix, modelMatrix, [(opensceneDeepConsts.roadWidth + opensceneDeepConsts.footpathborderWidth), opensceneDeepConsts.sceneY + (opensceneDeepConsts.footpathborderWidth), opensceneDeepConsts.sceneZ - (opensceneDeepConsts.footpathRigthDepth + opensceneDeepConsts.footpathborderWidth)])
	// mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.footpathborderWidth, opensceneDeepConsts.footpathborderHeight, opensceneDeepConsts.footpathborderWidth])
	// setModelMatrixCompleteLight(modelMatrix)
	// texMatrix = mat2.create()
	// mat2.scale(texMatrix, texMatrix, [1.0, 1.0])
	// setTextureMatrixCompleteLight(texMatrix)
	// gl.bindVertexArray(opensceneDeep.vaoCylinderPart)
	// gl.drawElements(gl.TRIANGLES, opensceneDeep.countCylinderPart, gl.UNSIGNED_SHORT, 0)
	// gl.bindVertexArray(null)
}

function renderForCloseSceneDeep(perspectiveMatrix, viewMatrix, viewPos) {
	var modelMatrix
	var lightSource = [0.0, 1.0, 6.5]

	//RenderToPhoneScreen
	renderToPhoneTexture()

	//Cubemap
	renderCubemapDeep(perspectiveMatrix, viewMatrix)

	gl.useProgram(progCompleteLight.program)
	resetCompleteLight()
	setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, viewPos)
	setFlagsCompleteLight(false, false, true, true)
	setTextureSamplersCompleteLight(0)
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.7, 0.7, 0.7], 100.0, 1.0)
	addLightCompleteLight(lightSource, [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0])
	
	renderForCitySceneStaticDeep()
	
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [ 0.0, 2.0, 2.0])
	renderForPhoneDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightSource, opensceneDeep.phoneScreenTex)

	renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightSource, [1.0, 1.0, 1.0])

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(opensceneDeepConsts.oceanWidth + opensceneDeepConsts.roadWidth + (2.0 * (opensceneDeepConsts.footpathborderWidth + opensceneDeepConsts.footpathWidth + opensceneDeepConsts.railingWidth))), -4.0, -opensceneDeepConsts.oceanDepth])
	mat4.scale(modelMatrix, modelMatrix, [opensceneDeepConsts.oceanWidth, 20.0, opensceneDeepConsts.oceanDepth])
	renderForOceanDeep(perspectiveMatrix, viewMatrix, modelMatrix)
}