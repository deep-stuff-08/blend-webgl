"use strict"
var programForDeepEarth
var vaoForDeepEarth
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

	var vertexData = []
	for(var i = 0; i <= stacks; i++) {
		var phi = Math.PI * i / stacks
		for(var j = 0; j <= slices; j++) {
			var theta = 2.0 * Math.PI * j / slices
			vertexData.push(Math.sin(phi) * Math.sin(theta) * radius)
			vertexData.push(Math.cos(phi) * radius)
			vertexData.push(Math.sin(phi) * Math.cos(theta) * radius)
			
			vertexData.push(Math.sin(phi) * Math.sin(theta))
			vertexData.push(Math.cos(phi))
			vertexData.push(Math.sin(phi) * Math.cos(theta))

			vertexData.push(j / slices)
			vertexData.push(1.0 - (i / stacks))
		}
	}
	var elements = []
	for(var i = 0; i < stacks; i++) {
		var e1 = i * (slices + 1)
		var e2 = e1 + slices + 1
		for(var j = 0; j < slices; j++, e1++, e2++) {
			if(i != 0) {
				elements.push(e1)	
				elements.push(e2)
				elements.push(e1 + 1)
			}
			if(i != (stacks - 1)) {
				elements.push(e1 + 1)
				elements.push(e2)
				elements.push(e2 + 1)
			}
		}
	}
	var elementIndices = Uint16Array.from(elements)
	var vertexArray = Float32Array.from(vertexData)

	vaoForDeepEarth = gl.createVertexArray()
	gl.bindVertexArray(vaoForDeepEarth)

	var vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	
	var eabo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eabo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementIndices, gl.STATIC_DRAW)

	gl.bindVertexArray(null)

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
	
	gl.bindVertexArray(vaoForDeepEarth)
	gl.drawElements(gl.TRIANGLES, 29400, gl.UNSIGNED_SHORT, 0)
	
	rotAngle += 0.01
}
}