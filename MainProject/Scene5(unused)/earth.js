"use strict"
var earthDeep = {
	program: null,
	sphere: null,
	texDiffuseEarthLight: null,
	texDiffuseEarthNight: null,
	unifroms: {
		pMat: null,
		vMat: null,
		mMat: null,
		lightPos: null,
		samDiffuseEarthLight: null,
		samDiffuseEarthNight: null
	},
	time: null
}

function setupProgramForEarthDeep() {
	var vertShader = createShader("Scene5/shaders/earth.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("Scene5/shaders/earth.frag", gl.FRAGMENT_SHADER)

	earthDeep.program = createProgram([vertShader, fragShader], function(program) {
		gl.bindAttribLocation(program, 0, "vPos")
		gl.bindAttribLocation(program, 1, "vNor")
		gl.bindAttribLocation(program, 2, "vTex")
	})
	earthDeep.unifroms.pMat = gl.getUniformLocation(earthDeep.program, "pMat")
	earthDeep.unifroms.vMat = gl.getUniformLocation(earthDeep.program, "vMat")
	earthDeep.unifroms.mMat = gl.getUniformLocation(earthDeep.program, "mMat")
	earthDeep.unifroms.lightPos = gl.getUniformLocation(earthDeep.program, "lightPos")
	earthDeep.unifroms.samDiffuseEarthLight = gl.getUniformLocation(earthDeep.program, "texDiffuseEarthLight")
	earthDeep.unifroms.samDiffuseEarthNight = gl.getUniformLocation(earthDeep.program, "texDiffuseEarthNight")
}

function initForEarthDeep() {
	const stacks = 25, slices = 50

	earthDeep.time = 0.0
	earthDeep.sphere = dshapes.initSphere(stacks, slices)

	earthDeep.texDiffuseEarthLight = loadTexture("resources/textures/earthlight.jpg", true)
	earthDeep.texDiffuseEarthNight = loadTexture("resources/textures/earthnight.jpg", true)
}

function renderForEarthDeep(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create()
	mat4.rotate(modelMatrix, modelMatrix, earthDeep.time * 2.0, [0.0, 1.0, 0.3])

	gl.useProgram(earthDeep.program)
	gl.uniformMatrix4fv(earthDeep.unifroms.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(earthDeep.unifroms.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(earthDeep.unifroms.mMat, false, modelMatrix)
	gl.uniform3f(earthDeep.unifroms.lightPos, 10.0 * Math.sin(earthDeep.time), 0.0, 10.0 * Math.cos(earthDeep.time))

	gl.uniform1i(earthDeep.unifroms.samDiffuseEarthLight, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, earthDeep.texDiffuseEarthLight)
	
	gl.uniform1i(earthDeep.unifroms.samDiffuseEarthNight, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, earthDeep.texDiffuseEarthNight)
	
	earthDeep.sphere.render(0.0)
	gl.useProgram(null)

	earthDeep.time += 0.01
}
