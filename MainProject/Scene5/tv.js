"use strict"
var tvDeep = {
	program: null,
	uniforms: null,
	cubeObj: null,
	quadObj: null,
	texWood: null,
}

function setupProgramForTVDeep() {
	tvDeep.program = progPhongLightWithTexture.program
	tvDeep.uniforms = progPhongLightWithTexture.uniforms
}

function initForTVDeep() {
	tvDeep.cubeObj = dshapes.initCube()
	tvDeep.quadObj = dshapes.initQuad()
	tvDeep.texWood = loadTexture("resources/textures/wood.png")
}

function renderForTVDeep(perspectiveMatrix, viewMatrix, modelMatrix, lightPos, texObjEarth, texObjFire) {
	var localMatrix = mat4.create()
	gl.useProgram(tvDeep.program)
	gl.uniformMatrix4fv(tvDeep.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(tvDeep.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(tvDeep.uniforms.lightPos, lightPos)
	gl.uniform1i(tvDeep.uniforms.isInvertNormals, 0)
	gl.uniform1i(tvDeep.uniforms.isLight, 1)
	gl.uniform1i(tvDeep.uniforms.isTexture, 1)
	gl.uniform1i(tvDeep.uniforms.diffuseTextureSampler, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tvDeep.texWood)

	mat4.translate(localMatrix, modelMatrix, [0.0, 1.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	tvDeep.cubeObj.render()

	mat4.translate(localMatrix, modelMatrix, [0.0, -1.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [1.0, 0.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	tvDeep.cubeObj.render()
	
	mat4.translate(localMatrix, modelMatrix, [1.03, 0.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [0.05, 1.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	tvDeep.cubeObj.render()
	
	mat4.translate(localMatrix, modelMatrix, [-1.03, 0.0, 0.0])
	mat4.scale(localMatrix, localMatrix, [0.05, 1.05, 0.03])
	gl.uniformMatrix4fv(tvDeep.uniforms.mMat, false, localMatrix)
	tvDeep.cubeObj.render()
	
	gl.useProgram(scene5Deep.programFireEarth)
	mat4.translate(localMatrix, modelMatrix, [0.0, 0.0, -0.01])
	mat4.scale(localMatrix, localMatrix, [1.0, 1.0, 0.01])
	gl.uniformMatrix4fv(scene5Deep.uniformsFireEarth.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(scene5Deep.uniformsFireEarth.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(scene5Deep.uniformsFireEarth.mMat, false, localMatrix)
	gl.uniform1i(scene5Deep.uniformsFireEarth.diffuseTextureSamplerEarth, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texObjEarth)
	gl.uniform1i(scene5Deep.uniformsFireEarth.diffuseTextureSamplerFire, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, texObjFire)
	tvDeep.quadObj.render()
	gl.useProgram(null)
}