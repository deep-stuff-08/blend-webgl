var tableDeep = {
	program: null,
	uniforms: null,
	cubeObj: null,
	texWood: null
}

function setupProgramForTableDeep() {
	tableDeep.program = progPhongLightWithTexture.program
	tableDeep.uniforms = progPhongLightWithTexture.uniforms
}

function initForTableDeep() {
	tableDeep.cubeObj = initCubeForShapesDeep()
	tableDeep.texWood = loadTexture("wood.png")
}

function renderForTableDeep(perspectiveMatrix, viewMatrix, modelMatrix) {
	var localMatrix = mat4.create()
	gl.useProgram(tableDeep.program)
	gl.uniformMatrix4fv(tableDeep.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(tableDeep.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(tableDeep.uniforms.lightPos, [0.0, 10.0, 10.0])
	gl.uniform1i(tableDeep.uniforms.isInvertNormals, 0)
	gl.uniform1i(tableDeep.uniforms.diffuseTextureSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tableDeep.texWood)

	mat4.translate(localMatrix, modelMatrix, [0.0, 1.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.03, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tableDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [0.0, -1.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.03, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tableDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [1.03, 0.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [0.03, 1.03, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tableDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [-1.03, 0.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [0.03, 1.03, 0.03])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tableDeep.cubeObj)

	mat4.translate(localMatrix, modelMatrix, [0.0, 0.0, -0.01])
	mat4.scale(localMatrix, localMatrix, [1.0, 1.0, 0.01])
	gl.uniformMatrix4fv(tableDeep.uniforms.mMat, false, localMatrix)
	renderCubeForShapesDeep(tableDeep.cubeObj)
}