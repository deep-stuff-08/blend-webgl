var programForRushiCube;
var programFrameBuffer;
var programBlur;
var vao,rectVao;
var angle = 0.0;
var FBO_WIDTH,FBO_HEIGHT;
var bFBOResult = false;

var postProcessingFBO;
var posProcessingTexture;
var bloomTexture;

var pingpongFBO = [2];
var pingpongBuffer = [2];

var pMatUnifromForRushiCube;
var vMatUnifromForRushiCube;
var mMatUnifromForRushiCube;
var viewPosUnifromForRushiCube;
var lightPosUnifromForRushiCube;
var diffuseUnifromForRushiCube;
var normalUnifromForRushiCube;
var diffuseTextureForRushiCube;
var normalTextureForRushiCube;

function setupProgramForRushi() {
	var vertShader = createShader('demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('demo.frag', gl.FRAGMENT_SHADER);
	programForRushiCube = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);


	vertShader = createShader('basic.vert', gl.VERTEX_SHADER);
	fragShader = createShader('basic.frag', gl.FRAGMENT_SHADER);
	programFrameBuffer = createProgram([vertShader,fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	vertShader = createShader('basic.vert', gl.VERTEX_SHADER);
	fragShader = createShader('blur.frag', gl.FRAGMENT_SHADER);
	programBlur = createProgram([vertShader,fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

}

function initForRushi(width,height) {
	var data = new Float32Array([
		//Front
		1.0, 1.0, 1.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
		-1.0, 1.0, 1.0, 1.0,	0.0, 0.0, 1.0,		0.0, 1.0,
		-1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0,		0.0, 0.0,
		
		-1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0,		0.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0,		1.0, 0.0,
		1.0, 1.0, 1.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
	]);

	vao = gl.createVertexArray();
	var vbo = gl.createBuffer();
	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 9, 4 * 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4 * 9, 4 * 4)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4 * 9, 4 * 7)
	gl.enableVertexAttribArray(2)
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	rectVao = gl.createVertexArray();
	gl.bindVertexArray(rectVao);
	gl.bindVertexArray(null);

	diffuseTextureForRushiCube = loadTexture("resources/textures/diffuse.png")
	normalTextureForRushiCube = loadTexture("resources/textures/normal.png")

	pMatUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "pMat")
	vMatUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "vMat")
	mMatUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "mMat")
	viewPosUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "viewPos")
	lightPosUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "lightPos")
	diffuseUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "diffuse")
	normalUnifromForRushiCube = gl.getUniformLocation(programForRushiCube, "normal")


	postProcessingFBO = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER,postProcessingFBO);

	posProcessingTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,posProcessingTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,width,height,0,gl.RGB,gl.UNSIGNED_SHORT_5_6_5,null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, posProcessingTexture,0);

	bloomTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,bloomTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,width,height,0,gl.RGB,gl.UNSIGNED_SHORT_5_6_5,null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, bloomTexture,0);

	gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1]);

	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if(gl.FRAMEBUFFER_COMPLETE != e)
	{
		console.log('Frame Buffer Object Is InComplete : ' + e.toString());
		return false;
	}

	// create pping pong fbos for repetative blurring
	
	for(var i = 0; i < 2; i++)
	{
		pingpongFBO[i] = gl.createFramebuffer();
		pingpongBuffer[i] = gl.createTexture();

		gl.bindFramebuffer(gl.FRAMEBUFFER,pingpongFBO[i]);
		gl.bindTexture(gl.TEXTURE_2D,pingpongBuffer[i]);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,width,height,0,gl.RGB,gl.UNSIGNED_SHORT_5_6_5,null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pingpongBuffer[i],0);
		e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if(gl.FRAMEBUFFER_COMPLETE != e)
		{
			console.log('Frame Buffer Object Is InComplete : ' + e.toString());
			return false;
		}
	}
}

function renderForRushi(time,perspectiveMatrix, viewMatrix) {

	var modelMatrix = mat4.create()

	gl.bindFramebuffer(gl.FRAMEBUFFER,postProcessingFBO);
	gl.clearColor(0.0,0.1,0.1,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(programForRushiCube);
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.bindVertexArray(vao);
	gl.uniformMatrix4fv(pMatUnifromForRushiCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForRushiCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForRushiCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForRushiCube, cameraPosition)
	gl.uniform3fv(lightPosUnifromForRushiCube, [0.0,0.0,3.0])
	gl.uniform4fv(gl.getUniformLocation(programForRushiCube, "lightColor"), [1.0,1.0,1.0,1.0])
	gl.uniform1i(diffuseUnifromForRushiCube, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, diffuseTextureForRushiCube)
	gl.uniform1i(normalUnifromForRushiCube, 1)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, normalTextureForRushiCube)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

	var horizontal = true, first_iteration = true;
	var amount = 5;

	gl.useProgram(programBlur);
	for(var i = 0; i < amount; i++)
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER,pingpongFBO[horizontal]);
		gl.uniform1i(gl.getUniformLocation(programBlur,"horizontal"), horizontal);

		if(first_iteration)
		{
			gl.bindTexture(gl.TEXTURE_2D,bloomTexture);
			first_iteration = false;
		}
		else
		{
			gl.bindTexture(gl.TEXTURE_2D, pingpongBuffer[!horizontal]);
		}

		gl.bindVertexArray(rectVao);
		gl.disable(gl.DEPTH_TEST);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		horizontal = !horizontal;
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);

	gl.useProgram(programFrameBuffer);
	gl.bindVertexArray(rectVao);
	gl.disable(gl.DEPTH_TEST);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,posProcessingTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D,pingpongBuffer[!horizontal]);
	gl.uniform1f(gl.getUniformLocation(programFrameBuffer,"bloomFactor"), 1.0);
	gl.uniform1f(gl.getUniformLocation(programFrameBuffer,"gamma"), 1.0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	angle += 0.01
}

function uninitForRushi() {
	deleteProgram(programForRushiCube);
}
