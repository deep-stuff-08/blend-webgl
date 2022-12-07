var vampireModelForTestModelLoadByDeep
var backpackModelForTestModelLoadByDeep

var isStatic = true
var programForTestModelLoadByDeep

var uniformsForTestModelLoadByDeep = {
	pMat: null,
	vMat: null,
	mMat: null,
	bMat: null,
	viewPos: null,
	diffuse: null,
	isStatic: null
}

function setupProgramForTestModelLoadByDeep() {
	var vertShader = createShader('shaders/model.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('shaders/model.frag', gl.FRAGMENT_SHADER);
	programForTestModelLoadByDeep = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	uniformsForTestModelLoadByDeep.pMat = gl.getUniformLocation(programForTestModelLoadByDeep, "pMat")
	uniformsForTestModelLoadByDeep.vMat = gl.getUniformLocation(programForTestModelLoadByDeep, "vMat")
	uniformsForTestModelLoadByDeep.mMat = gl.getUniformLocation(programForTestModelLoadByDeep, "mMat")
	uniformsForTestModelLoadByDeep.bMat = []
	for(var i = 0; i < 100; i++) {
		uniformsForTestModelLoadByDeep.bMat.push(gl.getUniformLocation(programForTestModelLoadByDeep, "bMat["+i+"]"))
	}
	uniformsForTestModelLoadByDeep.diffuse = gl.getUniformLocation(programForTestModelLoadByDeep, "diffuse")
	uniformsForTestModelLoadByDeep.isStatic = gl.getUniformLocation(programForTestModelLoadByDeep, "isStatic")
}

function initForTestModelLoadByDeep() {
	vampireModelForTestModelLoadByDeep = initalizeModel("Vampire")
	backpackModelForTestModelLoadByDeep = initalizeModel("Backpack")
}

{
var angle = 0.0
function renderForTestModelLoadByDeep(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create()
	mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0])
	mat4.translate(modelMatrix, modelMatrix, [0.0, -1.0, 0.0])
	mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5])
	
	gl.useProgram(programForTestModelLoadByDeep)
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.mMat, false, modelMatrix)
	gl.uniform1i(uniformsForTestModelLoadByDeep.diffuse, 0)
	if(!isStatic) {
		updateModel(vampireModelForTestModelLoadByDeep, 0, 0.01)
		var boneMat = getBoneMatrixArray(vampireModelForTestModelLoadByDeep, 0)
		for(var i = 0; i < boneMat.length; i++) {
			gl.uniformMatrix4fv(uniformsForTestModelLoadByDeep.bMat[i], false, boneMat[i])
		}
		gl.uniform1i(uniformsForTestModelLoadByDeep.isStatic, 0)
		renderModel(vampireModelForTestModelLoadByDeep)
	} else {
		gl.uniform1i(uniformsForTestModelLoadByDeep.isStatic, 1)
		renderModel(backpackModelForTestModelLoadByDeep)
	}
	angle += 0.01
}
}