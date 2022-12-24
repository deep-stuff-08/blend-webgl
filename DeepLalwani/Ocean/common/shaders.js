"use strict"
var progPhongLightWithTexture = {
	program: null,
	uniforms: {
		pMat: null,
		vMat: null,
		mMat: null,
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
	var vertShader = createShader('common/shaders/phonglighttex.vert', gl.VERTEX_SHADER)
	var fragShader = createShader('common/shaders/phonglighttex.frag', gl.FRAGMENT_SHADER)
	progPhongLightWithTexture.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progPhongLightWithTexture.uniforms.pMat = gl.getUniformLocation(progPhongLightWithTexture.program, "pMat")
	progPhongLightWithTexture.uniforms.vMat = gl.getUniformLocation(progPhongLightWithTexture.program, "vMat")
	progPhongLightWithTexture.uniforms.mMat = gl.getUniformLocation(progPhongLightWithTexture.program, "mMat")
	progPhongLightWithTexture.uniforms.lightPos = gl.getUniformLocation(progPhongLightWithTexture.program, "lightPos")
	progPhongLightWithTexture.uniforms.diffuseTextureSampler = gl.getUniformLocation(progPhongLightWithTexture.program, "samplerDiffuse")
	progPhongLightWithTexture.uniforms.isInvertNormals = gl.getUniformLocation(progPhongLightWithTexture.program, "isInvertNormal")
	progPhongLightWithTexture.uniforms.isLight = gl.getUniformLocation(progPhongLightWithTexture.program, "isLight")
	progPhongLightWithTexture.uniforms.isTexture = gl.getUniformLocation(progPhongLightWithTexture.program, "isTexture")
	progPhongLightWithTexture.uniforms.isBlend = gl.getUniformLocation(progPhongLightWithTexture.program, "isBlend")
}
