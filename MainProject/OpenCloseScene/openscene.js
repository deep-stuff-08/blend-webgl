var opensceneDeep = {
	objQuad: null,
	objCube: null,
	texFootpath: null,
	texRoad: null,
	texFootpathBorder: null,
	texCementWall: null,
}

function setupProgramForOpenSceneDeep() {
}

function initForOpenSceneDeep() {
	opensceneDeep.objQuad = dshapes.initQuad()
	opensceneDeep.objCube = dshapes.initCube()
	opensceneDeep.texFootpath = loadTexture("resources/textures/marble.png", false)
	opensceneDeep.texRoad = loadTexture("resources/textures/marble.png", false)
	opensceneDeep.texFootpathBorder = loadTexture("resources/textures/wood.png", false)
	opensceneDeep.texCementWall = loadTexture("resources/textures/wood.png", false)
}

function renderForOpenSceneDeep(perspectiveMatrix, viewMatrix) {
	var modelMatrix
	var texMatrix

	gl.useProgram(progPhongLightWithTexture.program)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.vMat, false, viewMatrix)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isInvertNormals, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isBlend, 0)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isLight, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.isTexture, 1)
	gl.uniform1i(progPhongLightWithTexture.uniforms.diffuseTextureSampler, 0)
	gl.uniform3f(progPhongLightWithTexture.uniforms.lightPos, 0.0, 10.0, 0.0)

	//FootPath
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-8.0, -2.5, -15.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [2.0, 20.0, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 10.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpath)
	opensceneDeep.objQuad.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [8.0, -2.5, -15.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [2.0, 20.0, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	opensceneDeep.objQuad.render()
	
	//Road
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -3.0, -15.0])
	mat4.rotate(modelMatrix, modelMatrix, Math.PI / 2.0, [-1.0, 0.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [6.0, 20.0, 1.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [1.0, 10.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texRoad)
	opensceneDeep.objQuad.render()
	
	//Railing
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-10.3, -2.0, -15.0])
	mat4.scale(modelMatrix, modelMatrix, [0.3, 0.5, 20.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 10.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texFootpathBorder)
	opensceneDeep.objCube.render()
	
	//FootPathBorder
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [-5.75, -2.75, -15.0])
	mat4.scale(modelMatrix, modelMatrix, [0.25, 0.25, 20.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	texMatrix = mat2.create()
	mat2.scale(texMatrix, texMatrix, [0.2, 10.0])
	gl.uniformMatrix2fv(progPhongLightWithTexture.uniforms.texMat, false, texMatrix)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, opensceneDeep.texCementWall)
	opensceneDeep.objCube.render()
	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [5.75, -2.75, -15.0])
	mat4.scale(modelMatrix, modelMatrix, [0.25, 0.25, 20.0])
	gl.uniformMatrix4fv(progPhongLightWithTexture.uniforms.mMat, false, modelMatrix)
	opensceneDeep.objCube.render()
}