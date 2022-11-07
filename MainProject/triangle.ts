namespace DeepTriangle {
	var program:WebGLProgram
	var vao:WebGLVertexArrayObject

	export function setupProgram() {
		var vertShader:WebGLShader = createShader('demo.vert', gl.VERTEX_SHADER)
		var fragShader:WebGLShader = createShader('demo.frag', gl.FRAGMENT_SHADER)

		program = createProgram([vertShader, fragShader])

		deleteShader(vertShader)
		deleteShader(fragShader)
	}

	export function init() {
		var data:Float32Array = new Float32Array([
			0.0, 1.0,	1.0, 0.0, 0.0,
			-1.0, -1.0,	0.0, 1.0, 0.0,
			1.0, -1.0,	0.0, 0.0, 1.0
		])

		vao = gl.createVertexArray()
		var vbo = gl.createBuffer()
		gl.bindVertexArray(vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 5 * 4, 0)
		gl.enableVertexAttribArray(0)
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 5 * 4, 2 * 4)
		gl.enableVertexAttribArray(1)
		gl.bindBuffer(gl.ARRAY_BUFFER, null)
		gl.bindVertexArray(null)
	}

	export function render() {
		gl.useProgram(program)
		gl.bindVertexArray(vao)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	export function uninit() {
		deleteProgram(program)
	}
}