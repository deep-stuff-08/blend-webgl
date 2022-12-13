var canvas
var gl
var lastmousex = -1, lastmousey = -1
var cameraYaw = -90.0, cameraPitch = 0.0
var cameraFront = vec3.set(vec3.create(), 0.0, 0.0, -1.0)
var cameraPosition = vec3.set(vec3.create(), 0.0, 0.0, 5.0)
var cameraUp = vec3.set(vec3.create(), 0.0, 1.0, 0.0)

var modelList = [
	// { name: "Vampire", files:[ 'resources/models/dynamic/vampire/dancing_vampire.dae' ], flipTex:true },
	// { name: "Backpack", files:[ 'resources/models/static/backpack/backpack.obj', 'resources/models/static/backpack/backpack.mtl'], flipTex:false },
	{ name: "PC", files:[ 'PC/PC.obj', 'PC/PC.mtl'], flipTex:true },
]

var translateScreen = [ 0.0, 0.52, 0.09 ]
var scaleScreen = 0.36
var rotAngleScreen = 0.0

assimpjs().then (function (ajs) {
	Promise.all(modelList.flatMap(o => o.files).map((fileToLoad) => fetch (fileToLoad))).then ((responses) => {
		return Promise.all(responses.map ((res) => res.arrayBuffer()))
	}).then((arrayBuffers) => {
		for(var i = 0; i < modelList.length; i++) {
			console.log("Loading Files for " + modelList[i].name + "....")
			let fileList = new ajs.FileList()
			for (let j = 0; j < modelList[i].files.length; j++) {
				fileList.AddFile(modelList[i].files[j], new Uint8Array(arrayBuffers[i + j]))
			}
			console.log("Loaded Files")
			console.log("Converting Files to AssimpJSON....")
			let result = ajs.ConvertFileList(fileList, 'assjson')
			if (!result.IsSuccess() || result.FileCount() == 0) {
				console.log(result.GetErrorCode())
				return
			}
			console.log("Converted Files")
			console.log("Parse JSON String....")
			let resultFile = result.GetFile(0)
			let jsonContent = new TextDecoder().decode(resultFile.GetContent())
			let resultJson = JSON.parse(jsonContent)
			console.log("Parsed JSON")
			modelList[i].json = resultJson
			modelList[i].directory = modelList[i].files[0].substring(0, modelList[i].files[0].lastIndexOf('/'))
		}
		main()
	})
})

function main() {
	canvas = document.createElement('canvas')
	gl = canvas.getContext('webgl2')
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	document.body.style.margin = "0"
	document.body.appendChild(canvas)
	window.addEventListener('resize', function () {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	})
	canvas.addEventListener('mousedown', function (event) {
		lastmousex = event.x
		lastmousey = event.y
	})
	canvas.addEventListener('mousemove', function (event) {
		if(lastmousex != -1 && lastmousey != -1) {
			var xoffset = event.x - lastmousex
			var yoffset = lastmousey - event.y 
			lastmousex = event.x
			lastmousey = event.y
			sensitivity = 0.1
			xoffset *= sensitivity
			yoffset *= sensitivity
			cameraYaw += xoffset
			cameraPitch += yoffset
		
			if(cameraPitch > 89.0) {
				cameraPitch = 89.0
			} else if(cameraPitch < -89.0) {
				cameraPitch = -89.0
			}
			var direction = [Math.cos(glMatrix.toRadian(cameraYaw)) * Math.cos(glMatrix.toRadian(cameraPitch)), Math.sin(glMatrix.toRadian(cameraPitch)), Math.sin(glMatrix.toRadian(cameraYaw)) * Math.cos(glMatrix.toRadian(cameraPitch))]
			vec3.normalize(cameraFront, direction)
		}
	})
	canvas.addEventListener('mouseup', function (event) {
		lastmousex = -1
		lastmousey = -1
	})
	window.addEventListener("keypress", function (event) {
		var speed = 0.3
		if(event.code == 'KeyA') {
			var dir = vec3.create()
			vec3.cross(dir, cameraFront, cameraUp)
			vec3.normalize(dir, dir)
			vec3.multiply(dir, dir, [speed, speed, speed])
			vec3.add(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyW') {
			var dir = vec3.create()
			vec3.multiply(dir, cameraFront, [speed, speed, speed])
			vec3.add(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyS') {
			var dir = vec3.create()
			vec3.multiply(dir, cameraFront, [speed, speed, speed])
			vec3.subtract(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyD') {
			var dir = vec3.create()
			vec3.cross(dir, cameraFront, cameraUp)
			vec3.normalize(dir, dir)
			vec3.multiply(dir, dir, [speed, speed, speed])
			vec3.subtract(cameraPosition, cameraPosition, dir)
		} else if(event.code == 'KeyI') {
			translateScreen[2] += 0.01
		} else if(event.code == 'KeyK') {
			translateScreen[2] -= 0.01
		} else if(event.code == 'KeyJ') {
			translateScreen[1] -= 0.01
		} else if(event.code == 'KeyL') {
			translateScreen[1] += 0.01
		} else if(event.code == 'KeyM') {
			rotAngleScreen -= 0.01
		} else if(event.code == 'KeyN') {
			rotAngleScreen += 0.01
		}
	})
	
	setupProgram()
	init()
	render()
	window.addEventListener('close', uninit)
}

function setupProgram() {
	// setupProgramForDeepCube()
	setupProgramForTestModelLoadByDeep()
	// setupProgramForDeepEarth()
}

function init() {
	// initForDeepCube()
	initForTestModelLoadByDeep()
	// initForDeepEarth()

	gl.enable(gl.DEPTH_TEST)
}
function printMatrix(m) {
	for(var i = 0; i < 4; i++) {
		console.log(m[i * 4 + 0] + "   " + m[i * 4 + 1] + "   " + m[i * 4 + 2] + "   " + m[i * 4 + 3])
	}
}

function render() {
	var perspectiveMatrix = mat4.create()
	mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvas.width / canvas.height, 0.1, 100.0)
	
	var cameraMatrix = mat4.create()
	var newfront = vec3.create()
	vec3.add(newfront, cameraFront, cameraPosition)
	mat4.lookAt(cameraMatrix, cameraPosition, newfront, cameraUp)
	
	gl.clearBufferfv(gl.COLOR, 0, [1.0, 0.0, 0.0, 1.0])
	gl.viewport(0, 0, canvas.width, canvas.height)

	// renderForDeepCube(perspectiveMatrix, cameraMatrix)
	renderForTestModelLoadByDeep(perspectiveMatrix, cameraMatrix)
	// renderForDeepEarth(perspectiveMatrix, cameraMatrix)

	window.requestAnimationFrame(render)
}

function uninit() {
}

function createShader(filename, shaderType) {
	var shader = gl.createShader(shaderType)
	var xhr = new XMLHttpRequest()
	xhr.open("GET", filename, false)
	xhr.overrideMimeType("text/plain")
	xhr.send()
	gl.shaderSource(shader, xhr.responseText)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(shader))
	}
	return shader
}

function deleteShader(shader) {
	gl.deleteShader(shader)
}

function createProgram(shaders, attribBindFunction) {
	var program = gl.createProgram()
	for (var i = 0; i < shaders.length; i++) {
		gl.attachShader(program, shaders[i])
	}
	if(attribBindFunction != undefined) {
		attribBindFunction(program)
	}
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(program))
	}
	for (var i = 0; i < shaders.length; i++) {
		gl.detachShader(program, shaders[i])
	}
	return program
}

function deleteProgram(program) {
	gl.deleteProgram(program)
}

function loadTexture(path, isTexFlipped) {
	var tbo = gl.createTexture()
	tbo.image = new Image()
	tbo.image.src = path
	console.log("Loading: " + path)
	tbo.image.onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isTexFlipped)
		gl.bindTexture(gl.TEXTURE_2D, tbo)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tbo.image)
		gl.generateMipmap(gl.TEXTURE_2D)
		console.log("Successfully Loaded: " + path)
		gl.bindTexture(gl.TEXTURE_2D, null)
	}
	return tbo
}