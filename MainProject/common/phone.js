var phoneDeep = {
	vaoQuaterCircle: null,
	countQuaterCircle: null,
	vaoHollowCircle: null,
	countHollowCircle: null,
	vaoQuaterCylinder: null,
	countQuaterCylinder: null,
	objQuad : null,
	texSilver: null,
	texBody: null,
	texGold: null,
}

function initForPhoneDeep() {
	var vertexArray = []

	for(var i = 0; i < 10; i++) {
		var theta = Math.PI / 2.0 * (i / 10)
		var theta1 = Math.PI / 2.0 * ((i + 1) / 10)

		vertexArray.push([Math.sin(theta), Math.cos(theta), 0.0])
		vertexArray.push([0.0, 0.0, 1.0])
		vertexArray.push([0.0, 0.0])		
	
		vertexArray.push([0.0, 0.0, 0.0])
		vertexArray.push([0.0, 0.0, 1.0])
		vertexArray.push([0.0, 0.0])
	
		vertexArray.push([Math.sin(theta1), Math.cos(theta1), 0.0])
		vertexArray.push([0.0, 0.0, 1.0])
		vertexArray.push([0.0, 0.0])		
	}

	phoneDeep.vaoQuaterCircle = gl.createVertexArray()
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	var vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.flat()), gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	gl.bindVertexArray(null)
	phoneDeep.countQuaterCircle = 10 * 3

	vertexArray = []
	for(var j = 0; j <= 50; j++) {
		var theta = (Math.PI * 2.0) * (j / 50)
		vertexArray.push(Math.sin(theta))
		vertexArray.push(Math.cos(theta))
		vertexArray.push(0.0)
		
		vertexArray.push(0.0)
		vertexArray.push(0.0)
		vertexArray.push(1.0)

		vertexArray.push(j / 50)
		vertexArray.push(1.0)
	
		vertexArray.push(Math.sin(theta) * 0.85)
		vertexArray.push(Math.cos(theta) * 0.85)
		vertexArray.push(0.0)
		
		vertexArray.push(0.0)
		vertexArray.push(0.0)
		vertexArray.push(1.0)

		vertexArray.push(j / 50)
		vertexArray.push(0.0)
	}
	var elements = []
	for(var j = 0; j < 50; j++) {
		elements.push(j * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push((j + 1) * 2 + 1)
	}
	
	phoneDeep.vaoHollowCircle = gl.createVertexArray()
	gl.bindVertexArray(phoneDeep.vaoHollowCircle)
	vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.flat()), gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)

	var eabo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eabo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW)
	gl.bindVertexArray(null)
	phoneDeep.countHollowCircle = elements.length

	vertexArray = []
	for(var j = 0; j <= 10; j++) {
		var theta = (Math.PI / 2.0) * (j / 10)
		vertexArray.push(Math.sin(theta))
		vertexArray.push(Math.cos(theta))
		vertexArray.push(1.0)
		
		vertexArray.push(Math.sin(theta))
		vertexArray.push(Math.cos(theta))
		vertexArray.push(0.0)

		vertexArray.push(j / 10)
		vertexArray.push(1.0)
	
		vertexArray.push(Math.sin(theta))
		vertexArray.push(Math.cos(theta))
		vertexArray.push(-1.0)
		
		vertexArray.push(Math.sin(theta))
		vertexArray.push(Math.cos(theta))
		vertexArray.push(0.0)

		vertexArray.push(j / 10)
		vertexArray.push(0.0)
	}
	elements = []
	for(var j = 0; j < 10; j++) {
		elements.push(j * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push((j + 1) * 2 + 1)
	}

	phoneDeep.vaoQuaterCylinder = gl.createVertexArray()
	gl.bindVertexArray(phoneDeep.vaoQuaterCylinder)

	vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	
	eabo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eabo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW)

	gl.bindVertexArray(null)
	phoneDeep.countQuaterCylinder = elements.length

	phoneDeep.objQuad = dshapes.initQuad()

	phoneDeep.texSilver = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 150, 150, 150, 255 ]))
	gl.bindTexture(gl.TEXTURE_2D, null)

	phoneDeep.texGold = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texGold)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 150, 125, 50, 255 ]))
	gl.bindTexture(gl.TEXTURE_2D, null)

	phoneDeep.texBody = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 20, 20, 20, 255 ]))
	gl.bindTexture(gl.TEXTURE_2D, null)
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

function renderForPhoneDeep(modelMatrix, screenTex) {
	var localModelMat

	const phoneScreenWidth = 0.6
	const phoneScreenHeight = 1.0
	const phoneTopPanelHeight = 0.09
	const phoneBottomPanelHeight = 0.12
	const phonePanelRadiusX = 0.16
	const phoneSidePanelWidth = 0.02
	const phonePanelWidth = phoneScreenWidth - phonePanelRadiusX + (phoneSidePanelWidth * 2.0)
	const phoneDepht = 0.05

	gl.activeTexture(gl.TEXTURE0)

	//Front
	//Screen
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, 0.0, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phoneScreenWidth, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, screenTex)
	phoneDeep.objQuad.render()

	//Borders
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, phoneScreenHeight + phoneTopPanelHeight, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelWidth, phoneTopPanelHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, -(phoneScreenHeight + phoneBottomPanelHeight), phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelWidth, phoneBottomPanelHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()
	
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phoneScreenWidth + phoneSidePanelWidth, 0.0, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phoneSidePanelWidth, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-(phoneScreenWidth + phoneSidePanelWidth), 0.0, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phoneSidePanelWidth, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [(phonePanelWidth), phoneScreenHeight, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneTopPanelHeight * 2.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-(phonePanelWidth), phoneScreenHeight, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneTopPanelHeight * 2.0, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phonePanelWidth, -phoneScreenHeight, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneBottomPanelHeight * 2.0, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, -1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-phonePanelWidth, -phoneScreenHeight, phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneBottomPanelHeight * 2.0, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI, [0.0, 0.0, -1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	//Sides
	//Right
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phoneScreenWidth + (2.0 * phoneSidePanelWidth), 0.0, 0.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [ 0.0, 1.0, 0.0 ])
	mat4.scale(localModelMat, localModelMat, [phoneDepht, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-(phoneScreenWidth + (2.0 * phoneSidePanelWidth)), 0.0, 0.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [ 0.0, -1.0, 0.0 ])
	mat4.scale(localModelMat, localModelMat, [phoneDepht, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, phoneScreenHeight + (2.0 * phoneTopPanelHeight), 0.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [ -1.0, 0.0, 0.0 ])
	mat4.scale(localModelMat, localModelMat, [phonePanelWidth, phoneDepht, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, -(phoneScreenHeight + (2.0 * phoneBottomPanelHeight)), 0.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [ 1.0, 0.0, 0.0 ])
	mat4.scale(localModelMat, localModelMat, [phonePanelWidth, phoneDepht, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phonePanelWidth, phoneScreenHeight, 0.0])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneTopPanelHeight * 2.0, phoneDepht])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCylinder)
	gl.drawElements(gl.TRIANGLES, phoneDeep.countQuaterCylinder, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)
	
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-phonePanelWidth, phoneScreenHeight, 0.0])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneTopPanelHeight * 2.0, phoneDepht])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCylinder)
	gl.drawElements(gl.TRIANGLES, phoneDeep.countQuaterCylinder, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)
	
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phonePanelWidth, -phoneScreenHeight, 0.0])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneBottomPanelHeight * 2.0, phoneDepht])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, -1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCylinder)
	gl.drawElements(gl.TRIANGLES, phoneDeep.countQuaterCylinder, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)
	
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-phonePanelWidth, -phoneScreenHeight, 0.0])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneBottomPanelHeight * 2.0, phoneDepht])
	mat4.rotate(localModelMat, localModelMat, Math.PI, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCylinder)
	gl.drawElements(gl.TRIANGLES, phoneDeep.countQuaterCylinder, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)

	//Back
	setFlagsCompleteLight(true, false, true, true)
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, 0.0, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phoneScreenWidth, 1.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, phoneScreenHeight + phoneTopPanelHeight, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelWidth, phoneTopPanelHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, -(phoneScreenHeight + phoneBottomPanelHeight), -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelWidth, phoneBottomPanelHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()
	
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phoneScreenWidth + phoneSidePanelWidth, 0.0, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phoneSidePanelWidth, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-(phoneScreenWidth + phoneSidePanelWidth), 0.0, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phoneSidePanelWidth, phoneScreenHeight, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	phoneDeep.objQuad.render()

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [(phonePanelWidth), phoneScreenHeight, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneTopPanelHeight * 2.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-(phonePanelWidth), phoneScreenHeight, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneTopPanelHeight * 2.0, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [phonePanelWidth, -phoneScreenHeight, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneBottomPanelHeight * 2.0, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, -1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-phonePanelWidth, -phoneScreenHeight, -phoneDepht])
	mat4.scale(localModelMat, localModelMat, [phonePanelRadiusX, phoneBottomPanelHeight * 2.0, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI, [0.0, 0.0, -1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texBody)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)

	//Home Button
	setFlagsCompleteLight(false, false, true, true)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texGold)
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, -(phoneScreenHeight + phoneBottomPanelHeight), phoneDepht + 0.001])
	mat4.scale(localModelMat, localModelMat, [0.1, 0.1, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindVertexArray(phoneDeep.vaoHollowCircle)
	gl.drawElements(gl.TRIANGLES, phoneDeep.countHollowCircle, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)

	//Speaker Front
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.15, (phoneScreenHeight + phoneTopPanelHeight), phoneDepht + 0.001])
	mat4.scale(localModelMat, localModelMat, [0.01, 0.01, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-0.15, (phoneScreenHeight + phoneTopPanelHeight), phoneDepht + 0.001])
	mat4.scale(localModelMat, localModelMat, [0.01, 0.01, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.15, (phoneScreenHeight + phoneTopPanelHeight), phoneDepht + 0.001])
	mat4.scale(localModelMat, localModelMat, [0.01, 0.01, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI / 2.0, [0.0, 0.0, -1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [-0.15, (phoneScreenHeight + phoneTopPanelHeight), phoneDepht + 0.001])
	mat4.scale(localModelMat, localModelMat, [0.01, 0.01, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	gl.bindVertexArray(phoneDeep.vaoQuaterCircle)
	gl.drawArrays(gl.TRIANGLES, 0, phoneDeep.countQuaterCircle)
	gl.bindVertexArray(null)
	localModelMat = mat4.clone(modelMatrix)
	mat4.translate(localModelMat, localModelMat, [0.0, (phoneScreenHeight + phoneTopPanelHeight), phoneDepht + 0.001])
	mat4.scale(localModelMat, localModelMat, [0.15, 0.01, 1.0])
	mat4.rotate(localModelMat, localModelMat, Math.PI, [0.0, 0.0, 1.0])
	setModelMatrixCompleteLight(localModelMat)
	gl.bindTexture(gl.TEXTURE_2D, phoneDeep.texSilver)
	phoneDeep.objQuad.render()

	gl.useProgram(null)
}