"use strict"
var progPhongLightWithTexture = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null,
		mMat: null,
		texMat: null,
		lightPos: null,
		diffuseTextureSampler: null,
		isInvertNormals: null,
		isLight: null,
		isTexture: null,
		isBlend: null
	}
}

var progPhongLightWithTextureForModel = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null,
		mMat: null,
		bMat: [],
		lightPos: null,
		diffuseTextureSampler: null,
		isLight: null,
		isTexture: null,
		isBlend: null
	}
}

var progCompleteLight = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null,
		mMat: null,
		texMat: null,
		viewPos: null,
		lightPos: null,
		diffuseTextureSampler: null,
		isInvertNormals: null,
		isLight: null,
		isTexture: null,
		isBlend: null
	}
}

function setupCommonPrograms() {
	//Phong Light with Texture Support
	var vertShader, fragShader
	vertShader = createShader('common/shaders/phonglighttex.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/phonglighttex.frag', gl.FRAGMENT_SHADER)
	progPhongLightWithTexture.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progPhongLightWithTexture.uniforms.pMat = gl.getUniformLocation(progPhongLightWithTexture.program, "pMat")
	progPhongLightWithTexture.uniforms.vMat = gl.getUniformLocation(progPhongLightWithTexture.program, "vMat")
	progPhongLightWithTexture.uniforms.mMat = gl.getUniformLocation(progPhongLightWithTexture.program, "mMat")
	progPhongLightWithTexture.uniforms.texMat = gl.getUniformLocation(progPhongLightWithTexture.program, "texMat")
	progPhongLightWithTexture.uniforms.lightPos = gl.getUniformLocation(progPhongLightWithTexture.program, "lightPos")
	progPhongLightWithTexture.uniforms.diffuseTextureSampler = gl.getUniformLocation(progPhongLightWithTexture.program, "samplerDiffuse")
	progPhongLightWithTexture.uniforms.isInvertNormals = gl.getUniformLocation(progPhongLightWithTexture.program, "isInvertNormal")
	progPhongLightWithTexture.uniforms.isLight = gl.getUniformLocation(progPhongLightWithTexture.program, "isLight")
	progPhongLightWithTexture.uniforms.isTexture = gl.getUniformLocation(progPhongLightWithTexture.program, "isTexture")
	progPhongLightWithTexture.uniforms.isBlend = gl.getUniformLocation(progPhongLightWithTexture.program, "isBlend")

	vertShader = createShader('common/shaders/model.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/phonglighttex.frag', gl.FRAGMENT_SHADER)
	progPhongLightWithTextureForModel.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progPhongLightWithTextureForModel.uniforms.pMat = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "pMat")
	progPhongLightWithTextureForModel.uniforms.vMat = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "vMat")
	progPhongLightWithTextureForModel.uniforms.mMat = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "mMat")
	for(var i = 0; i < 100; i++) {
		progPhongLightWithTextureForModel.uniforms.bMat.push(gl.getUniformLocation(progPhongLightWithTextureForModel.program, "bMat["+i+"]"))
	}
	progPhongLightWithTextureForModel.uniforms.lightPos = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "lightPos")
	progPhongLightWithTextureForModel.uniforms.diffuseTextureSampler = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "samplerDiffuse")
	progPhongLightWithTextureForModel.uniforms.isLight = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "isLight")
	progPhongLightWithTextureForModel.uniforms.isTexture = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "isTexture")
	progPhongLightWithTextureForModel.uniforms.isBlend = gl.getUniformLocation(progPhongLightWithTextureForModel.program, "isBlend")

	vertShader = createShader('common/shaders/phonglighttex.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/phonglighttex.frag', gl.FRAGMENT_SHADER)
	progCompleteLight.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progCompleteLight.uniforms.pMat = gl.getUniformLocation(progCompleteLight.program, "pMat")
	progCompleteLight.uniforms.vMat = gl.getUniformLocation(progCompleteLight.program, "vMat")
	progCompleteLight.uniforms.mMat = gl.getUniformLocation(progCompleteLight.program, "mMat")
	progCompleteLight.uniforms.texMat = gl.getUniformLocation(progCompleteLight.program, "texMat")
	progCompleteLight.uniforms.lightPos = gl.getUniformLocation(progCompleteLight.program, "lightPos")
	progCompleteLight.uniforms.viewPos = gl.getUniformLocation(progCompleteLight.program, "viewPos")
	progCompleteLight.uniforms.diffuseTextureSampler = gl.getUniformLocation(progCompleteLight.program, "samplerDiffuse")
	progCompleteLight.uniforms.isInvertNormals = gl.getUniformLocation(progCompleteLight.program, "isInvertNormal")
	progCompleteLight.uniforms.isLight = gl.getUniformLocation(progCompleteLight.program, "isLight")
	progCompleteLight.uniforms.isTexture = gl.getUniformLocation(progCompleteLight.program, "isTexture")
	progCompleteLight.uniforms.isBlend = gl.getUniformLocation(progCompleteLight.program, "isBlend")
	gl.useProgram(progCompleteLight.program)
	resetCompleteLight()
	gl.useProgram(null)
}

function resetCompleteLight() {
	gl.uniformMatrix4fv(progCompleteLight.uniforms.pMat, false, mat4.create())
	gl.uniformMatrix4fv(progCompleteLight.uniforms.vMat, false, mat4.create())
	gl.uniformMatrix4fv(progCompleteLight.uniforms.mMat, false, mat4.create())
	gl.uniformMatrix2fv(progCompleteLight.uniforms.texMat, false, mat2.create())
	gl.uniform3f(progCompleteLight.uniforms.lightPos, 0.0, 0.0, 0.0)
	gl.uniform3f(progCompleteLight.uniforms.viewPos, 0.0, 0.0, 0.0)
	gl.uniform1i(progCompleteLight.uniforms.diffuseTextureSampler, 0)
	gl.uniform1i(progCompleteLight.uniforms.isBlend, 0)
	gl.uniform1i(progCompleteLight.uniforms.isInvertNormals, 0)
	gl.uniform1i(progCompleteLight.uniforms.isLight, 0)
	gl.uniform1i(progCompleteLight.uniforms.isTexture, 0)
}

function setPerojectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, viewPos) {
	gl.uniformMatrix4fv(progCompleteLight.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progCompleteLight.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(progCompleteLight.uniforms.viewPos, viewPos)
}

function setModelMatrix(modelMatrix) {
	gl.uniformMatrix4fv(progCompleteLight.uniforms.mMat, false, modelMatrix)
}

function setTextureMatrix(textureMatrix) {
	gl.uniformMatrix2fv(progCompleteLight.uniforms.texMat, false, textureMatrix)
}

function setTextureSamplers(diffuseTexture) {
	gl.uniform1i(progCompleteLight.uniforms.isTexture, 1)
	gl.uniform1i(progCompleteLight.uniforms.diffuseTextureSampler, diffuseTexture)
}

function setFlags(isInvertNormals, isBlend, isTexture, isLight) {
	gl.uniform1i(progCompleteLight.uniforms.isBlend, isBlend)
	gl.uniform1i(progCompleteLight.uniforms.isInvertNormals, isInvertNormals)
	gl.uniform1i(progCompleteLight.uniforms.isLight, isLight)
	gl.uniform1i(progCompleteLight.uniforms.isTexture, isTexture)
}

function addLight(lightPos, lightColor) {
	gl.uniform3fv(progCompleteLight.uniforms.lightPos, lightPos)
}