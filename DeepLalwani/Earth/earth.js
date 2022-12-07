var programForDeepEarth
var sphereForDeepEarth
var texDiffuseEarthLightForDeepEarth
var texDiffuseEarthNightForDeepEarth
var unifromsForDeepEarth = {
	pMat: null,
	vMat: null,
	mMat: null,
	lightPos: null,
	texDiffuseEarthLight: null,
	texDiffuseEarthNight: null
}

function setupProgramForDeepEarth() {
	var vertShader = createShader("shaders/earth.vert", gl.VERTEX_SHADER)
	var fragShader = createShader("shaders/earth.frag", gl.FRAGMENT_SHADER)

	programForDeepEarth = createProgram([vertShader, fragShader], function(program) {
		gl.bindAttribLocation(program, 0, "vPos")
		gl.bindAttribLocation(program, 1, "vNor")
		gl.bindAttribLocation(program, 2, "vTex")
	})
	unifromsForDeepEarth.pMat = gl.getUniformLocation(programForDeepEarth, "pMat")
	unifromsForDeepEarth.vMat = gl.getUniformLocation(programForDeepEarth, "vMat")
	unifromsForDeepEarth.mMat = gl.getUniformLocation(programForDeepEarth, "mMat")
	unifromsForDeepEarth.lightPos = gl.getUniformLocation(programForDeepEarth, "lightPos")
	unifromsForDeepEarth.texDiffuseEarthLight = gl.getUniformLocation(programForDeepEarth, "texDiffuseEarthLight")
	unifromsForDeepEarth.texDiffuseEarthNight = gl.getUniformLocation(programForDeepEarth, "texDiffuseEarthNight")
}

function initForDeepEarth() {
	const stacks = 50, slices = 100
	const radius = 1.0

	sphereForDeepEarth = initSphereForDeepShapes(stacks, slices, radius)

	texDiffuseEarthLightForDeepEarth = loadTexture("resources/earthlight.jpg", true)
	texDiffuseEarthNightForDeepEarth = loadTexture("resources/earthnight.jpg", true)
}

{
var rotAngle = 0.0
var renderForDeepEarth = function(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create()
	mat4.rotate(modelMatrix, modelMatrix, rotAngle, [0.3, 1.0, 0.0])

	gl.useProgram(programForDeepEarth)
	gl.uniformMatrix4fv(unifromsForDeepEarth.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(unifromsForDeepEarth.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(unifromsForDeepEarth.mMat, false, modelMatrix)
	gl.uniform3f(unifromsForDeepEarth.lightPos, 10.0 * Math.sin(rotAngle), 10.0 * Math.sin(rotAngle), 10.0 * Math.cos(rotAngle))

	gl.uniform1i(unifromsForDeepEarth.texDiffuseEarthLight, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texDiffuseEarthLightForDeepEarth)
	
	gl.uniform1i(unifromsForDeepEarth.texDiffuseEarthNight, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, texDiffuseEarthNightForDeepEarth)
	
	renderSphereForDeepShapes(sphereForDeepEarth)

	rotAngle += 0.01
}
}