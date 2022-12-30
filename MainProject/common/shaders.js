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
		diffuseTextureSampler: null,
		isInvertNormals: null,
		numLights: null,
		isTexture: null,
		isBlend: null,
		material: {
			ambient: null,
			diffuse: null,
			specular: null,
			shininess: null,
			opacity: null
		},
		light: [],
	},
	currentLight: 0,
	isLight: false
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

	vertShader = createShader('common/shaders/complete.vert', gl.VERTEX_SHADER)
	fragShader = createShader('common/shaders/complete.frag', gl.FRAGMENT_SHADER)
	progCompleteLight.program = createProgram([vertShader, fragShader])
	deleteShader(vertShader)
	deleteShader(fragShader)

	progCompleteLight.uniforms.pMat = gl.getUniformLocation(progCompleteLight.program, "pMat")
	progCompleteLight.uniforms.vMat = gl.getUniformLocation(progCompleteLight.program, "vMat")
	progCompleteLight.uniforms.mMat = gl.getUniformLocation(progCompleteLight.program, "mMat")
	progCompleteLight.uniforms.texMat = gl.getUniformLocation(progCompleteLight.program, "texMat")
	progCompleteLight.uniforms.viewPos = gl.getUniformLocation(progCompleteLight.program, "viewPos")
	
	progCompleteLight.uniforms.diffuseTextureSampler = gl.getUniformLocation(progCompleteLight.program, "samplerDiffuse")
	
	progCompleteLight.uniforms.isInvertNormals = gl.getUniformLocation(progCompleteLight.program, "isInvertNormal")
	progCompleteLight.uniforms.numLights = gl.getUniformLocation(progCompleteLight.program, "numOfLights")
	progCompleteLight.uniforms.isTexture = gl.getUniformLocation(progCompleteLight.program, "isTexture")
	progCompleteLight.uniforms.isBlend = gl.getUniformLocation(progCompleteLight.program, "isBlend")
	
	progCompleteLight.uniforms.material.ambient = gl.getUniformLocation(progCompleteLight.program, "material.ambient")
	progCompleteLight.uniforms.material.diffuse = gl.getUniformLocation(progCompleteLight.program, "material.diffuse")
	progCompleteLight.uniforms.material.specular = gl.getUniformLocation(progCompleteLight.program, "material.specular")
	progCompleteLight.uniforms.material.shininess = gl.getUniformLocation(progCompleteLight.program, "material.shininess")
	progCompleteLight.uniforms.material.opacity = gl.getUniformLocation(progCompleteLight.program, "material.opacity")
	
	for(var i = 0; i < 13; i++) {
		var light = {}
		light.ambient = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].ambient")
		light.diffuse = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].diffuse")
		light.specular = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].specular")
		light.position = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].position")
		light.attenuation = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].attenuation")
		light.cutoff = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].cutoff")
		light.direction = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].direction")
		light.isDirectional = gl.getUniformLocation(progCompleteLight.program, "light[" + i + "].isDirectional")
		progCompleteLight.uniforms.light.push(light)
	}
	
	gl.useProgram(progCompleteLight.program)
	resetCompleteLight()
	gl.useProgram(null)
}

function resetCompleteLight() {
	gl.uniformMatrix4fv(progCompleteLight.uniforms.pMat, false, mat4.create())
	gl.uniformMatrix4fv(progCompleteLight.uniforms.vMat, false, mat4.create())
	gl.uniformMatrix4fv(progCompleteLight.uniforms.mMat, false, mat4.create())
	gl.uniformMatrix2fv(progCompleteLight.uniforms.texMat, false, mat2.create())
	gl.uniform3f(progCompleteLight.uniforms.viewPos, 0.0, 0.0, 0.0)
	
	gl.uniform1i(progCompleteLight.uniforms.diffuseTextureSampler, 0)

	gl.uniform1i(progCompleteLight.uniforms.isBlend, 0)
	gl.uniform1i(progCompleteLight.uniforms.isInvertNormals, 0)
	gl.uniform1i(progCompleteLight.uniforms.numLights, 0)
	progCompleteLight.currentLight = 0
	gl.uniform1i(progCompleteLight.uniforms.isTexture, 0)

	gl.uniform3f(progCompleteLight.uniforms.material.ambient, 0.0, 0.0, 0.0)
	gl.uniform3f(progCompleteLight.uniforms.material.diffuse, 0.0, 0.0, 0.0)
	gl.uniform3f(progCompleteLight.uniforms.material.specular, 0.0, 0.0, 0.0)
	gl.uniform1f(progCompleteLight.uniforms.material.shininess, 0.0)
	gl.uniform1f(progCompleteLight.uniforms.material.opacity, 0.0)
	
	for(var i = 0; i < 13; i++) {
		gl.uniform3f(progCompleteLight.uniforms.light[i].ambient, 0.0, 0.0, 0.0)
		gl.uniform3f(progCompleteLight.uniforms.light[i].diffuse, 0.0, 0.0, 0.0)
		gl.uniform3f(progCompleteLight.uniforms.light[i].specular, 0.0, 0.0, 0.0)
		gl.uniform3f(progCompleteLight.uniforms.light[i].position, 0.0, 0.0, 0.0)
		gl.uniform3f(progCompleteLight.uniforms.light[i].attenuation, 0.0, 0.0, 0.0)
		gl.uniform2f(progCompleteLight.uniforms.light[i].cutoff, 0.0, 0.0)
		gl.uniform3f(progCompleteLight.uniforms.light[i].direction, 0.0, 0.0, 0.0)
		gl.uniform1i(progCompleteLight.uniforms.light[i].isDirectional, 0)
	}
}

function setProjectionAndViewCompleteLight(perspectiveMatrix, viewMatrix, viewPos) {
	gl.uniformMatrix4fv(progCompleteLight.uniforms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(progCompleteLight.uniforms.vMat, false, viewMatrix)
	gl.uniform3fv(progCompleteLight.uniforms.viewPos, viewPos)
}

function setModelMatrixCompleteLight(modelMatrix) {
	gl.uniformMatrix4fv(progCompleteLight.uniforms.mMat, false, modelMatrix)
}

function setTextureMatrixCompleteLight(textureMatrix) {
	gl.uniformMatrix2fv(progCompleteLight.uniforms.texMat, false, textureMatrix)
}

function setTextureSamplersCompleteLight(diffuseTexture) {
	gl.uniform1i(progCompleteLight.uniforms.isTexture, 1)
	gl.uniform1i(progCompleteLight.uniforms.diffuseTextureSampler, diffuseTexture)
}

function setFlagsCompleteLight(isInvertNormals, isBlend, isTexture, isLight) {
	gl.uniform1i(progCompleteLight.uniforms.isBlend, isBlend ? 1 : 0)
	gl.uniform1i(progCompleteLight.uniforms.isInvertNormals, isInvertNormals ? 1 : 0)
	gl.uniform1i(progCompleteLight.uniforms.numLights, isLight ? progCompleteLight.currentLight : 0)
	gl.uniform1i(progCompleteLight.uniforms.isTexture, isTexture ? 1 : 0)
	progCompleteLight.isLight = isLight
}

function setMaterialCompleteLight(matAmbient, matDiffuse, matSpecular, matShininess, matOpacity) {
	gl.uniform3fv(progCompleteLight.uniforms.material.ambient, matAmbient)
	gl.uniform3fv(progCompleteLight.uniforms.material.diffuse, matDiffuse)
	gl.uniform3fv(progCompleteLight.uniforms.material.specular, matSpecular)
	gl.uniform1f(progCompleteLight.uniforms.material.shininess, matShininess)
	gl.uniform1f(progCompleteLight.uniforms.material.opacity, matOpacity)
}

function addLightCompleteLight(lightPosition, lightAmbient, lightDiffuse, lightSpecular) {
	if(progCompleteLight.isLight) {
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].ambient, lightAmbient)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].diffuse, lightDiffuse)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].specular, lightSpecular)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].position, lightPosition)
		progCompleteLight.currentLight++
		gl.uniform1i(progCompleteLight.uniforms.numLights, progCompleteLight.currentLight)
	}
}

function addPointLightCompleteLight(lightPosition, lightAmbient, lightDiffuse, lightSpecular, lightAttenuation) {
	if(progCompleteLight.isLight) {
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].ambient, lightAmbient)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].diffuse, lightDiffuse)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].specular, lightSpecular)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].position, lightPosition)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].attenuation, lightAttenuation)
		progCompleteLight.currentLight++
		gl.uniform1i(progCompleteLight.uniforms.numLights, progCompleteLight.currentLight)
	}
}

function addSpotLightCompleteLight(lightPosition, lightAmbient, lightDiffuse, lightSpecular, lightAttenuation, lightCutoff, lightDirection) {
	if(progCompleteLight.isLight) {
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].ambient, lightAmbient)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].diffuse, lightDiffuse)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].specular, lightSpecular)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].position, lightPosition)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].attenuation, lightAttenuation)
		gl.uniform2fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].cutoff, lightCutoff)
		gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].direction, lightDirection)
		progCompleteLight.currentLight++
		gl.uniform1i(progCompleteLight.uniforms.numLights, progCompleteLight.currentLight)
	}
}

function addDirectionalCompleteLight(lightDirection, lightAmbient, lightDiffuse, lightSpecular) {
	gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].ambient, lightAmbient)
	gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].diffuse, lightDiffuse)
	gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].specular, lightSpecular)
	gl.uniform3fv(progCompleteLight.uniforms.light[progCompleteLight.currentLight].direction, lightDirection)
	gl.uniform1i(progCompleteLight.uniforms.light[progCompleteLight.currentLight].isDirectional, 1)
	progCompleteLight.currentLight++
	gl.uniform1i(progCompleteLight.uniforms.numLights, progCompleteLight.currentLight)
}