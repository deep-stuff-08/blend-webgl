"use strict"
var tableDeep = {
	program: null,
	uniforms: null,
	cubeObj: null,
	cylinderObj: null,
	texWood: null
}

function setupProgramForTableDeep() {
	tableDeep.program = progPhongLightWithTexture.program
	tableDeep.uniforms = progPhongLightWithTexture.uniforms
}

function initForTableDeep() {
	tableDeep.cubeObj = initCubeForShapesDeep()
	tableDeep.cylinderObj = initCylinderForShapesDeep(50)
	tableDeep.texWood = loadTexture("resources/textures/wood.png")
}

function renderForTableDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition) {
	var localMatrix = mat4.create()
	gl.useProgram(tableDeep.program)
	gl.uniformMatrix4fv(tableDeep.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(tableDeep.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(tableDeep.uniforms.lightPos, lightPosition)
	gl.uniform1i(tableDeep.uniforms.isInvertNormals, 0)
	gl.uniform1i(tableDeep.uniforms.isLight, 1)
	gl.uniform1i(tableDeep.uniforms.isTexture, 1)
	gl.uniform1i(tableDeep.uniforms.diffuseTextureSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tableDeep.texWood)

	mat4.translate(localMatrix, modelMatrix, [0.0, 0.45, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.03, 0.5])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tableDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [0.75, -0.05, 0.25])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [-1.0, 0.0, 0.0])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [0.0, 0.0, 1.0])
	mat4.scale(localMatrix, localMatrix, [0.03, 0.5, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCylinderForShapesDeep(tableDeep.cylinderObj)

	mat4.translate(localMatrix, modelMatrix, [-0.75, -0.05, 0.25])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [-1.0, 0.0, 0.0])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [0.0, 0.0, -1.0])
	mat4.scale(localMatrix, localMatrix, [0.03, 0.5, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCylinderForShapesDeep(tableDeep.cylinderObj)

	mat4.translate(localMatrix, modelMatrix, [-0.75, -0.05, -0.25])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [1.0, 0.0, 0.0])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [0.0, 0.0, -1.0])
	mat4.scale(localMatrix, localMatrix, [0.03, 0.5, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCylinderForShapesDeep(tableDeep.cylinderObj)

	mat4.translate(localMatrix, modelMatrix, [0.75, -0.05, -0.25])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [1.0, 0.0, 0.0])
	mat4.rotate(localMatrix, localMatrix, glMatrix.toRadian(10.0), [0.0, 0.0, 1.0])
	mat4.scale(localMatrix, localMatrix, [0.03, 0.5, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCylinderForShapesDeep(tableDeep.cylinderObj)
	gl.useProgram(null)
}