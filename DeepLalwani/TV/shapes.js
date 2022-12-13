class dshapes {
	constructor(vao, count) {
		this.vao = vao
		this.count = count
	}
}

function initSphereForShapesDeep(stacks, slices) {
	var vertexData = []
	for(var i = 0; i <= stacks; i++) {
		var phi = Math.PI * i / stacks
		for(var j = 0; j <= slices; j++) {
			var theta = 2.0 * Math.PI * j / slices
			vertexData.push(Math.sin(phi) * Math.sin(theta))
			vertexData.push(Math.cos(phi))
			vertexData.push(Math.sin(phi) * Math.cos(theta))
			
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

	var vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

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
	return new dshapes(vao, elementIndices.length)
}

function initCubeForShapesDeep() {
	var vertexArray = new Float32Array([
		//Front
		1.0, 1.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
		-1.0, 1.0, 1.0,		0.0, 0.0, 1.0,		0.0, 1.0,
		-1.0, -1.0, 1.0,	0.0, 0.0, 1.0,		0.0, 0.0,
		
		-1.0, -1.0, 1.0,	0.0, 0.0, 1.0,		0.0, 0.0,
		1.0, -1.0, 1.0,		0.0, 0.0, 1.0,		1.0, 0.0,
		1.0, 1.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,

		//Right
		1.0, 1.0, -1.0,		1.0, 0.0, 0.0,		1.0, 1.0,
		1.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 1.0,
		1.0, -1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 0.0,
		
		1.0, 1.0, -1.0,		1.0, 0.0, 0.0,		1.0, 1.0,
		1.0, -1.0, -1.0,	1.0, 0.0, 0.0,		1.0, 0.0,
		1.0, -1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 0.0,

		//Back
		-1.0, 1.0, -1.0,	0.0, 0.0, -1.0,		1.0, 1.0,
		1.0, 1.0, -1.0,		0.0, 0.0, -1.0,		0.0, 1.0,
		1.0, -1.0, -1.0,	0.0, 0.0, -1.0,		0.0, 0.0,

		-1.0, 1.0, -1.0,	0.0, 0.0, -1.0,		1.0, 1.0,
		-1.0, -1.0, -1.0,	0.0, 0.0, -1.0,		1.0, 0.0,
		1.0, -1.0, -1.0,	0.0, 0.0, -1.0,		0.0, 0.0,

		//Left
		-1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 1.0,
		-1.0, 1.0, -1.0,	-1.0, 0.0, 0.0,		0.0, 1.0,
		-1.0, -1.0, -1.0,	-1.0, 0.0, 0.0,		0.0, 0.0,
		
		-1.0, -1.0, -1.0,	-1.0, 0.0, 0.0,		0.0, 0.0,
		-1.0, -1.0, 1.0,	-1.0, 0.0, 0.0,		1.0, 0.0,
		-1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 1.0,

		//Top
		1.0, 1.0, -1.0,		0.0, 1.0, 0.0,		1.0, 1.0,
		-1.0, 1.0, -1.0,	0.0, 1.0, 0.0,		0.0, 1.0,
		-1.0, 1.0, 1.0,		0.0, 1.0, 0.0,		0.0, 0.0,
		
		-1.0, 1.0, 1.0,		0.0, 1.0, 0.0,		0.0, 0.0,
		1.0, 1.0, 1.0, 		0.0, 1.0, 0.0,		1.0, 0.0,
		1.0, 1.0, -1.0,		0.0, 1.0, 0.0,		1.0, 1.0,

		//Bottom
		1.0, -1.0, 1.0,		0.0, -1.0, 0.0,		1.0, 1.0,
		-1.0, -1.0, 1.0,	0.0, -1.0, 0.0,		0.0, 1.0,
		-1.0, -1.0, -1.0,	0.0, -1.0, 0.0,		0.0, 0.0,
		
		-1.0, -1.0, -1.0,	0.0, -1.0, 0.0,		0.0, 0.0,
		1.0, -1.0, -1.0,	0.0, -1.0, 0.0,		1.0, 0.0,
		1.0, -1.0, 1.0,		0.0, -1.0, 0.0,		1.0, 1.0
	])

	var vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

	var vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(2)
	
	gl.bindVertexArray(null)
	return new dshapes(vao, 36)
}

function initCylinderForShapesDeep(slices) {
	var vertexData = []
	for(var j = 0; j <= slices; j++) {
		var theta = 2.0 * Math.PI * j / slices
		vertexData.push(Math.sin(theta))
		vertexData.push(1.0)
		vertexData.push(Math.cos(theta))
		
		vertexData.push(Math.sin(theta))
		vertexData.push(0.0)
		vertexData.push(Math.cos(theta))

		vertexData.push(j / slices)
		vertexData.push(1.0)
	
		vertexData.push(Math.sin(theta))
		vertexData.push(-1.0)
		vertexData.push(Math.cos(theta))
		
		vertexData.push(Math.sin(theta))
		vertexData.push(0.0)
		vertexData.push(Math.cos(theta))

		vertexData.push(j / slices)
		vertexData.push(0.0)
	}
	var elements = []
	for(var j = 0; j < slices; j++) {
		elements.push(j * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push(j * 2 + 1)
		elements.push((j + 1) * 2)
		elements.push((j + 1) * 2 + 1)
	}
	var elementIndices = Uint16Array.from(elements)
	var vertexArray = Float32Array.from(vertexData)

	var vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

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
	return new dshapes(vao, elementIndices.length)
}

function renderSphereForShapesDeep(sphereObj) {
	gl.bindVertexArray(sphereObj.vao)
	gl.drawElements(gl.TRIANGLES, sphereObj.count, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)
}

function renderCylinderForShapesDeep(cylinderObj) {
	gl.bindVertexArray(cylinderObj.vao)
	gl.drawElements(gl.TRIANGLES, cylinderObj.count, gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null)
}

function renderCubeForShapesDeep(cubeObj) {
	gl.bindVertexArray(cubeObj.vao)
	gl.drawArrays(gl.TRIANGLES, 0, cubeObj.count)
	gl.bindVertexArray(null)
}