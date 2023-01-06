var streelampDeep = {
	objCylinder: null,
	objSphere: null,
	texConcrete: null,
	texSteel: null
}

function setupProgramForStreetLamp() {
}

function initForStreetLamp() {
	streelampDeep.objCylinder = dshapes.initCylinder(20)
	streelampDeep.objSphere = dshapes.initSphere(20, 20)
	streelampDeep.texConcrete = loadTexture("resources/textures/concretebase.jpg", false)
	streelampDeep.texSteel = loadTexture("resources/textures/steel.jpg", false)

}

function renderForStreetLamp(localModelMatrix) {
	var modelMatrix = mat4.create()
	
	//base
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, streelampDeep.texConcrete)
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.15, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.08, 0.15, 0.08])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objCylinder.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.3, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.08, 0.14, 0.08])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objSphere.render()

	//pole
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, streelampDeep.texSteel)
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, 1.2, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.02, 0.9, 0.02])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objCylinder.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.0, 2.1, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.02, 0.02, 0.02])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objSphere.render()
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.3, 2.07, 0.0])
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(80.0), [0.0, 0.0, -1.0])
	mat4.scale(modelMatrix, modelMatrix, [0.02, 0.3, 0.02])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objCylinder.render()

	//lamphead
	modelMatrix = mat4.clone(localModelMatrix)
	mat4.translate(modelMatrix, modelMatrix, [0.7, 2.12, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.13, 0.052, 0.052])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objSphere.render()

	setEmissiveCompleteLight(5.0)
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.7, 0.7, 0.7], 10.0, 1.0)
	setFlagsCompleteLight(false, false, false, false)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, streelampDeep.texConcrete)
	mat4.translate(modelMatrix, modelMatrix, [0.09, -0.5, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.8, 0.8, 0.8])
	setModelMatrixCompleteLight(modelMatrix)
	texMatrix = mat2.create()
	setTextureMatrixCompleteLight(texMatrix)
	streelampDeep.objSphere.render()
	setMaterialCompleteLight([0.1, 0.1, 0.1], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 1.0, 1.0)
	setFlagsCompleteLight(false, false, true, true)
	unsetEmissiveCompleteLight()
}