var opensceneDeep = {
	objQuad: null,
	texFootpath: null,
	texRoad: null
}

function setupProgramForOpenSceneDeep() {
}

function initForOpenSceneDeep() {
	opensceneDeep.objQuad = dshapes.initQuad()
	opensceneDeep.texFootpath = loadTexture("resources/textures/marble.png", false)
	opensceneDeep.texRoad = loadTexture("resources/textures/wood.png", false)
}

function renderForOpenSceneDeep(perspectiveMatrix, viewMatrix) {
	var modelMatrix

	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.diffuseTextureSampler, 0)
	gl.uniform3f(progPhongLightWithTexture.uniforms.lightPos, 10.0, 10.0, 10.0)

	//FootPath
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -1.0, -5.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [1.0, 10.0, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpath)
	opensceneDeep.objQuad.render()

	//Road
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [2.5, -1.5, -5.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [1.0, 10.0, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texRoad)
	opensceneDeep.objQuad.render()
}