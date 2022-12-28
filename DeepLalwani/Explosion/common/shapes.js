"use strict"
class dshapes {
	constructor(vao, count, isIndexed) {
		this.vao = vao
		this.count = count
		this.isIndexed = isIndexed
	}
	static initSphere(stacks, slices) {
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
		return new dshapes(vao, elementIndices.length, true)	
	}
	static initCube() {
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
		return new dshapes(vao, 36, false)
	}

	static initQuad() {
		var vertexArray = new Float32Array([
			1.0, 1.0, 0.0,		0.0, 0.0, 1.0,		1.0, 1.0,
			-1.0, 1.0, 0.0,		0.0, 0.0, 1.0,		0.0, 1.0,
			-1.0, -1.0, 0.0,	0.0, 0.0, 1.0,		0.0, 0.0,
			
			-1.0, -1.0, 0.0,	0.0, 0.0, 1.0,		0.0, 0.0,
			1.0, -1.0, 0.0,		0.0, 0.0, 1.0,		1.0, 0.0,
			1.0, 1.0, 0.0,		0.0, 0.0, 1.0,		1.0, 1.0,
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
		return new dshapes(vao, 6, false)
	}

	static initCylinder(slices) {
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
		return new dshapes(vao, elementIndices.length, true)
	}

	static initParaboloid(height, slices) {
		var dTheta = glMatrix.toRadian(5.0);
		var dy = height / slices;
	
		var vertexData = [];
		for(var y = dy; y <= height; y += dy) {
			var posFactorInner = Math.sqrt(y);
			var posFactorOuter = Math.sqrt(y + dy);
			var texFactorInner = height / y;
			var texFactorOuter = height / (y + dy);
			for(var theta = 0.0; theta < 2*Math.PI; theta += dTheta) {
				// emit vertex 0
				var x = posFactorInner * Math.sin(theta);
				var z = posFactorInner * Math.cos(theta);
				vertexData.push(x);
				vertexData.push(y);
				vertexData.push(z);
	
				var normDivisor = Math.sqrt(1 + 4*(x**2)) * Math.sqrt(1 + 4*(z**2));
				vertexData.push(2*x / normDivisor);
				vertexData.push(-1 / normDivisor);
				vertexData.push(2*z / normDivisor);
	
				vertexData.push(texFactorInner * x);
				vertexData.push(texFactorInner * z);

				// emit vertex 1
				x = posFactorInner * Math.sin(theta + dTheta);
				z = posFactorInner * Math.cos(theta + dTheta);
				vertexData.push(x);
				vertexData.push(y);
				vertexData.push(z);
	
				normDivisor = Math.sqrt(1 + 4*(x**2)) * Math.sqrt(1 + 4*(z**2));
				vertexData.push(2*x / normDivisor);
				vertexData.push(-1 / normDivisor);
				vertexData.push(2*z / normDivisor);
	
				vertexData.push(texFactorInner * x);
				vertexData.push(texFactorInner * z);

				// emit vertex 2
				x = posFactorOuter * Math.sin(theta);
				z = posFactorOuter * Math.cos(theta);
				vertexData.push(x);
				vertexData.push(y + dy);
				vertexData.push(z);
	
				normDivisor = Math.sqrt(1 + 4*(x**2)) * Math.sqrt(1 + 4*(z**2));
				vertexData.push(2*x / normDivisor);
				vertexData.push(-1 / normDivisor);
				vertexData.push(2*z / normDivisor);
	
				vertexData.push(texFactorOuter * x);
				vertexData.push(texFactorOuter * z);

				// emit vertex 2
				vertexData.push(x);
				vertexData.push(y + dy);
				vertexData.push(z);
	
				vertexData.push(2*x / normDivisor);
				vertexData.push(-1 / normDivisor);
				vertexData.push(2*z / normDivisor);
	
				vertexData.push(texFactorOuter * x);
				vertexData.push(texFactorOuter * z);

				// emit vertex 1
				x = posFactorInner * Math.sin(theta + dTheta);
				z = posFactorInner * Math.cos(theta + dTheta);
				vertexData.push(x);
				vertexData.push(y);
				vertexData.push(z);
	
				normDivisor = Math.sqrt(1 + 4*(x**2)) * Math.sqrt(1 + 4*(z**2));
				vertexData.push(2*x / normDivisor);
				vertexData.push(-1 / normDivisor);
				vertexData.push(2*z / normDivisor);
	
				vertexData.push(texFactorInner * x);
				vertexData.push(texFactorInner * z);

				// emit vertex 3
				x = posFactorOuter * Math.sin(theta + dTheta);
				z = posFactorOuter * Math.cos(theta + dTheta);
				vertexData.push(x);
				vertexData.push(y + dy);
				vertexData.push(z);
	
				normDivisor = Math.sqrt(1 + 4*(x**2)) * Math.sqrt(1 + 4*(z**2));
				vertexData.push(2*x / normDivisor);
				vertexData.push(-1 / normDivisor);
				vertexData.push(2*z / normDivisor);
	
				vertexData.push(texFactorOuter * x);
				vertexData.push(texFactorOuter * z);
			}
		}
		var vertexArray = new Float32Array(vertexData);
	
		var vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
	
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * vertexArray.BYTES_PER_ELEMENT, 0 * vertexArray.BYTES_PER_ELEMENT);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * vertexArray.BYTES_PER_ELEMENT, 3 * vertexArray.BYTES_PER_ELEMENT);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * vertexArray.BYTES_PER_ELEMENT, 6 * vertexArray.BYTES_PER_ELEMENT);
		gl.enableVertexAttribArray(2);
	
		gl.bindVertexArray(null);
		return new dshapes(vao, vertexArray.length / 8, false);
	}

	render(count) {
		if(count === undefined) {
			count = 1
		}
		gl.bindVertexArray(this.vao)
		if(this.isIndexed) {
			gl.drawElementsInstanced(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0, count)
		} else {
			gl.drawArrays(gl.TRIANGLES, 0, this.count, count)
		}
		gl.bindVertexArray(null)
	}
}
