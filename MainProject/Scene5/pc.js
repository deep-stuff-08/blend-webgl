"use strict"
var pcDeep = {
	programModel: null,
	quadScreen: null,
	objectPC: null,
	uniformsModel: null,
	uniformsScreen: {
		pMat: null,
		vMat: null,
		mMat: null,
		diffuseTextureSampler: null
	}
}

function setupProgramForPCDeep() {
	pcDeep.programModel = progPhongLightWithTexture.program
	pcDeep.uniformsModel = progPhongLightWithTexture.uniforms
}

function initForPCDeep() {
	pcDeep.quadScreen = dshapes.initQuad()
	pcDeep.objectPC = initalizeModel("PC")
}

function renderForPCDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPosition, texObjEarth, texObjFire) {
	var localModelMatrix = mat4.create()
	mat4.rotate(localModelMatrix, modelMatrix, -Math.PI / 2, [0.0, 1.0, 0.0])
	mat4.scale(localModelMatrix, localModelMatrix, [0.5, 0.5, 0.5])
	
	gl.useProgram(pcDeep.programModel)
	gl.uniformMatrix4fv(pcDeep.uniformsModel.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(pcDeep.uniformsModel.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(pcDeep.uniformsModel.mMat, false, localModelMatrix)
	gl.uniform3fv(pcDeep.uniformsModel.lightPos, lightPosition)
	gl.uniform1i(pcDeep.uniformsModel.diffuseTextureSampler, 0)
	gl.uniform1i(pcDeep.uniformsModel.isInvertNormals, 0)
	renderModel(pcDeep.objectPC)

	mat4.translate(localModelMatrix, modelMatrix, [-0.01, 0.53, 0.09])
	mat4.rotate(localModelMatrix, localModelMatrix, -0.14, [1.0, 0.0, 0.0])
	mat4.scale(localModelMatrix, localModelMatrix, [monitorScale[0], monitorScale[1], 1.0])
	gl.useProgram(scene5Deep.programFireEarth)
	gl.uniformMatrix4fv(scene5Deep.uniformsFireEarth.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(scene5Deep.uniformsFireEarth.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(scene5Deep.uniformsFireEarth.mMat, false, localModelMatrix)
	gl.uniform1i(scene5Deep.uniformsFireEarth.diffuseTextureSamplerEarth, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texObjEarth)
	gl.uniform1i(scene5Deep.uniformsFireEarth.diffuseTextureSamplerFire, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, texObjFire)
	pcDeep.quadScreen.render()
}