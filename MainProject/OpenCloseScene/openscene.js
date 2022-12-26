var opensceneDeep = {
	objQuad: null,
	objCube: null,
	objBrian: null,
	objCars: null,
	vaoCylinderPart: null,
	countCylinderPart: null,
	texFootpath: null,
	texRoad: null,
	texFootpathBorder: null,
	texCementWall: null,
	texCity: null,
	texBuilding1: null,
	texBuilding2: null
}

var testProgram;

function setupProgramForOpenSceneDeep() {
	setupProgramForCubemapRendererDeep()
	setupProgramForStreetLamp()
	setupProgramForOceanDeep()
}

function initForOpenSceneDeep() {
	initForCubemapRendererDeep()
	initForStreetLamp()
	initForOceanDeep()

	opensceneDeep.objQuad = dshapes.initQuad()
	opensceneDeep.objCube = dshapes.initCube()
	
	opensceneDeep.texFootpath = loadTexture("resources/textures/footpath.jpg", false)
	opensceneDeep.texRoad = loadTexture("resources/textures/road.jpg", false)
	opensceneDeep.texFootpathBorder = loadTexture("resources/textures/footpathborder.jpg", false)
	opensceneDeep.texCementWall = loadTexture("resources/textures/concretestone.jpg", false)
	opensceneDeep.texCity = loadTextureCubemap("resources/textures/sky.jpg", false)
	opensceneDeep.texBuilding1 = loadTexture("resources/textures/building1.png", true)
	opensceneDeep.texBuilding2 = loadTexture("resources/textures/building2.png", true)

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

function renderForOpenSceneDeep(perspectiveMatrix, viewMatrix) {
	var modelMatrix
	var texMatrix
	var lightSource = [0.0, 1.0, 6.5]

	const footpathWidth = 2.0 // 2.0 * 2.0
	const footpathborderWidth = 0.25 // 0.25 * 2.0
	const footpathborderHeight = 0.25 // 0.25 * 2.0
	const roadWidth = 6.0 // 2.0 * 6.0
	const railingWidth = 0.3 // 2.0 * 0.3
	const railingHeight = 0.5 // 2.0 * 0.5
	const sceneY = -3.0
	const sceneZ = -95.0
	const footpathRigthDepth = 100.0
	const footpathLeftDepth = 100.0
	const groundWidth = 30.0
	const wallHeight = 1.5
	const buildingXTrans = 10.0
	const buildingZTrans = 12.5
	const buildingZSpace = 30.0
	const oceanWidth = 1000.0
	const oceanDepth = 100.0

	//Cubemap
	renderCubemapDeep(perspectiveMatrix, viewMatrix)

	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.diffuseTextureSampler, 0)
	gl.uniform3fv(progPhongLightWithTexture.uniforms.lightPos, lightSource)

	// //City
	// gl.disable(gl.DEPTH_TEST)
	// modelMatrix = mat4.create()
	// gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 0)
	// mat4.translate(modelMatrix, modelMatrix, [0.0, 30.0, -700.0])
	// mat4.scale(modelMatrix, modelMatrix, [100.0, 50.0, 1.0])
	// gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	// texMatrix = mat2.create()
	// mat2.scale(texMatrix, texMatrix, [1.0, 1.0])
	// gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	// gl.activeTexture(gl.TEXTURE0)
	// gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texCity)
	// opensceneDeep.objQuad.render()
	// gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 1)
	// gl.enable(gl.DEPTH_TEST)
	
	//Road
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, sceneY, sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [roadWidth, footpathRigthDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 10.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texRoad)
	opensceneDeep.objQuad.render()
	
	//Railing
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texCementWall)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(roadWidth + ((footpathborderWidth + footpathWidth) * 2.0) + railingWidth), sceneY + ((footpathborderHeight * 2.0) + (railingHeight * 2.0)), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [railingWidth, footpathLeftDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 60.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(roadWidth + ((footpathborderWidth + footpathWidth) * 2.0)), sceneY + ((footpathborderHeight * 2.0) + railingHeight), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathLeftDepth, railingHeight, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.rotate(texMatrix, texMatrix, Math.PI / 2.0)
	mat2.scale(texMatrix, texMatrix, [60.0, 0.3])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	
	//FootPath
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpath)
	//FootPathLeft
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(roadWidth + footpathWidth + (footpathborderWidth * 2.0)), sceneY + (footpathborderWidth * 2.0), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathWidth, footpathLeftDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 50.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	//FootPathRight
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(roadWidth + footpathWidth + (footpathborderWidth * 2.0)), sceneY + (footpathborderWidth * 2.0), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathWidth, footpathRigthDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 50.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	
	//FootPathBorder
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpathBorder)
	//FootPathBorderLeft
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(roadWidth + footpathborderWidth), sceneY + (footpathborderWidth * 2.0), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathborderWidth, footpathLeftDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 50.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(roadWidth), sceneY + (footpathborderWidth), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathLeftDepth, footpathborderHeight, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.rotate(texMatrix, texMatrix, Math.PI / 2.0)
	mat2.scale(texMatrix, texMatrix, [50.0, 1.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	//FootPathBorderRight
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(roadWidth + footpathborderWidth), sceneY + (footpathborderWidth * 2.0), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathborderWidth, footpathLeftDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 50.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(roadWidth), sceneY + (footpathborderWidth), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, -1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathLeftDepth, footpathborderHeight, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.rotate(texMatrix, texMatrix, 3.0 * Math.PI / 2.0)
	mat2.scale(texMatrix, texMatrix, [50.0, 1.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	// // FootPathBorderTurn
	// modelMatrix = mat4.create()
	// mat4.translate(modelMatrix, modelMatrix, [(roadWidth + footpathborderWidth), sceneY + (footpathborderWidth), sceneZ - (footpathRigthDepth + footpathborderWidth)])
	// mat4.scale(modelMatrix, modelMatrix, [footpathborderWidth, footpathborderHeight, footpathborderWidth])
	// gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	// texMatrix = mat2.create()
	// mat2.scale(texMatrix, texMatrix, [1.0, 1.0])
	// gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	// gl.bindVertexArray(opensceneDeep.vaoCylinderPart)
	// gl.drawElements(gl.TRIANGLES, opensceneDeep.countCylinderPart, gl.UNSIGNED_SHORT, 0)
	// gl.bindVertexArray(null)
	
	//Lamps
	const lampCount = 6
	const lampDelta = (footpathLeftDepth * 2.0) / (lampCount - 1)
	for(var j = 0; j < 2; j++) {
		modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, [0.0, sceneY + (footpathborderHeight * 2.0), sceneZ])
		mat4.rotate(modelMatrix, modelMatrix, j * Math.PI, [0.0, 1.0, 0.0])
		for(var i = 0; i < lampCount; i++) {
			var lmodelMatrix = mat4.clone(modelMatrix)
			mat4.translate(lmodelMatrix, lmodelMatrix, [-(roadWidth + footpathborderWidth + 0.1), 0.0, footpathLeftDepth - (i * lampDelta)])
			mat4.scale(lmodelMatrix, lmodelMatrix, [3.4, 3.4, 3.4])
			renderForStreetLamp(lmodelMatrix)
		}
	}

	//Ground
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(roadWidth + ((footpathWidth + footpathborderWidth) * 2.0) + groundWidth), sceneY + (footpathborderWidth * 2.0), sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [groundWidth, footpathLeftDepth, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [30.0, 50.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()

	//Wall
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpath)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [(roadWidth + ((footpathWidth + footpathborderWidth) * 2.0)), sceneY + (footpathborderWidth * 2.0) + wallHeight, sceneZ])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [0.0, -1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [footpathLeftDepth, wallHeight, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [50.0, 1.5])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()

	//Building
	for(var i = 0; i < 6; i++) {
	modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, [(roadWidth + ((footpathWidth + footpathborderWidth) * 2.0)) + buildingXTrans, sceneY + (footpathborderWidth * 2.0), sceneZ + footpathLeftDepth - ((buildingZSpace * i) + buildingZTrans)])
		mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0])
		renderForBuildingDeep(modelMatrix, [2.0, 3.0], opensceneDeep.texBuilding1)
	}

	for(var i = 0; i < 6; i++) {
	modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, [(roadWidth + ((footpathWidth + footpathborderWidth) * 2.0)) + buildingXTrans, sceneY + (footpathborderWidth * 2.0), sceneZ + footpathLeftDepth - ((buildingZSpace * i) + buildingZTrans + (buildingZSpace / 2.0))])
		mat4.scale(modelMatrix, modelMatrix, [5.0, 6.0, 5.0])
		renderForBuildingDeep(modelMatrix, [2.0, 3.0], opensceneDeep.texBuilding2)
	}

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [2.7, -1.76, -10.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.32, 0.32, 0.32])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	renderModel(opensceneDeep.objCars[0])

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-2.7, -1.76, -20.0])
	mat4.scale(modelMatrix, modelMatrix, [0.32, 0.32, 0.32])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	renderModel(opensceneDeep.objCars[1])

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [2.7, -1.76, -30.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.32, 0.32, 0.32])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	renderModel(opensceneDeep.objCars[2])

	gl.useProgram(progPhongLightWithTextureForModel.program)
	gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isLight, 1)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTextureForModel.uniforms.diffuseTextureSampler, 0)
	gl.uniform3fv(progPhongLightWithTextureForModel.uniforms.lightPos, lightSource)
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-8.86, -2.5, 0.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI, [0.0, 1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [1.4, 1.4, 1.4])
	gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.mMat, false, modelMatrix)
	updateModel(opensceneDeep.objBrian, 0, 0.01)
	var boneMat = getBoneMatrixArray(opensceneDeep.objBrian, 0)
	for(var i = 0; i < boneMat.length; i++) {
		gl.uniformMatrix4fv(progPhongLightWithTextureForModel.uniforms.bMat[i], false, boneMat[i])
	}
	renderModel(opensceneDeep.objBrian);

	renderLightSourceDeep(perspectiveMatrix, viewMatrix, lightSource, [1.0, 1.0, 1.0])

	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-(oceanWidth + roadWidth + (2.0 * (footpathborderWidth + footpathWidth + railingWidth))), -4.0, -oceanDepth])
	mat4.scale(modelMatrix, modelMatrix, [oceanWidth, 20.0, oceanDepth])
	renderForOceanDeep(perspectiveMatrix, viewMatrix, modelMatrix)
}

function renderForBuildingDeep(localModelMatrix, texScale, tex) {
	var modelMatrix
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
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, buildingHeight, buildingDepth])
	mat4.scale(modelMatrix, modelMatrix, [buildingWidth, buildingHeight, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, buildingHeight, -buildingDepth])
	mat4.scale(modelMatrix, modelMatrix, [buildingWidth, buildingHeight, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objQuad.render()

	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texCementWall)
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, buildingHeight * 2.0 + roofHeight, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [buildingWidth + roofWidthDepthInc, roofHeight, buildingDepth + roofWidthDepthInc])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, texScale)
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	opensceneDeep.objCube.render()
}