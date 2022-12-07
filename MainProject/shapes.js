class dshapes {
	constructor(vao, count) {
		this.vao = vao
		this.count = count
	}
}

function initSphereForDeepShapes(stacks, slices, radius) {
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

function renderSphereForDeepShapes(sphereObj) {
	gl.bindVertexArray(sphereObj.vao)
	gl.drawElements(gl.TRIANGLES, sphereObj.count, gl.UNSIGNED_SHORT, 0)
}