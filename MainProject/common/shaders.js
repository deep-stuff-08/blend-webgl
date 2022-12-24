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

function setupCommonPrograms() {
	//Phong Light with Texture Support
	var vertShader = createShader('common/shaders/phonglighttex.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('common/shaders/phonglighttex.frag', gl.FRAGMENT_SHADER)
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
}
