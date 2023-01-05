var programForDeepCube;
var programGodRays;
var programRain;
var vaoQuad;
var pMatUnifromForDeepCube;
var vMatUnifromForDeepCube;
var mMatUnifromForDeepCube;
var viewPosUnifromForDeepCube;
var diffuseUnifromForDeepCube;
var diffuseTextureForDeepCube;
var angle = 0.0

var blur = true;
var exposure = 0.5;

var video;
var copyVideo = false;

var positions = [
	[-3.0,-0.5,-3.0],
	[ 0.0,-0.5,-3.0],
	[ 3.0,-0.5,-3.0],
	[-3.0,-0.5, 0.0],
	[ 0.0,-0.5, 0.0],
	[ 3.0,-0.5, 0.0],
	[-3.0,-0.5, 3.0],
	[ 0.0,-0.5, 3.0],
	[ 3.0,-0.5, 3.0]
];

var lightposition = [
	[ 0.0, 1.0, 1.5],
	[-3.0, 0.5,-2.0],
	[ 3.0, 0.5, 1.0],
	[-1.0, -0.5,2.0]
];

var lightColor = [
	[5.0,5.0,5.0],
	[10.0,0.0,0.0],
	[0.0,0.0,15.0],
	[0.0,5.0,0.0]
];

// fbo stuff

var fbo;
var colorBuffer;
var depthBuffer;

var videoTexture;

function setupVideo(url)
{
	const video = document.createElement("video");
	var playing = false;
	var timeupdate = false;

	video.playsInline = true;
	video.muted = true;
	video.loop = true;

	video.addEventListener("playing", function()
	{
		playing = true;
		checkReady();
	},
	true);

	video.addEventListener(
		"timeupdate",
		function(){
			timeupdate = true;
			checkReady();
		}
		,true
	);

	video.src = url;
	video.play();

	function checkReady()
	{
		if(playing && timeupdate){
			copyVideo = true;
		}
	}

	return video;
}

function updateTexture(gl,texture,video)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
}

function setupProgramForDeepCube() {
	var vertShader = createShader('demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('demo.frag', gl.FRAGMENT_SHADER);
	programForDeepCube = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	var vertShader = createShader('godray.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('godrays.frag', gl.FRAGMENT_SHADER);
	programGodRays = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	var vertShader = createShader('quad.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('rain.frag', gl.FRAGMENT_SHADER);
	programRain = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

}

function initForDeepCube(width,height) {
	var data = new Float32Array([
		//Front
		1.0, 1.0, 1.0, 1.0,		1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
		-1.0, 1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 1.0,
		-1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 0.0,
		
		-1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 0.0,
		1.0, 1.0, 1.0, 1.0,		1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,

		//Right
		1.0, 1.0, -1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,		0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 1.0,
		1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 0.0,
		
		1.0, 1.0, -1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		1.0, 1.0,
		1.0, -1.0, -1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		1.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	0.0, 0.0, 1.0, 1.0,		1.0, 0.0, 0.0,		0.0, 0.0,

		//Back
		-1.0, 1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		1.0, 1.0,
		1.0, 1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		0.0, 1.0,
		1.0, -1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		0.0, 0.0,

		-1.0, 1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		1.0, 1.0,
		-1.0, -1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		1.0, 0.0,
		1.0, -1.0, -1.0, 1.0,	1.0, 0.0, 1.0, 1.0,		0.0, 0.0, -1.0,		0.0, 0.0,

		//Left
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 1.0,
		-1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		0.0, 1.0,
		-1.0, -1.0, -1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		0.0, 0.0,
		
		-1.0, -1.0, -1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		0.0, 0.0,
		-1.0, -1.0, 1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 0.0,
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 1.0, 1.0,		-1.0, 0.0, 0.0,		1.0, 1.0,

		//Top
		1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		1.0, 1.0,
		-1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		0.0, 1.0,
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		0.0, 0.0,
		
		-1.0, 1.0, 1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		0.0, 0.0,
		1.0, 1.0, 1.0, 1.0,		0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		1.0, 0.0,
		1.0, 1.0, -1.0, 1.0,	0.0, 1.0, 0.0, 1.0,		0.0, 1.0, 0.0,		1.0, 1.0,

		//Bottom
		1.0, -1.0, 1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		1.0, 1.0,
		-1.0, -1.0, 1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		0.0, 1.0,
		-1.0, -1.0, -1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		0.0, 0.0,
		
		-1.0, -1.0, -1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		0.0, 0.0,
		1.0, -1.0, -1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		1.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	1.0, 1.0, 0.0, 1.0,		0.0, -1.0, 0.0,		1.0, 1.0,
	]);

	vao = gl.createVertexArray();
	var vbo = gl.createBuffer();
	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 13, 4 * 0);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4 * 13, 4 * 8);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4 * 13, 4 * 11);
	gl.enableVertexAttribArray(2);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	diffuseTextureForDeepCube = loadTexture("resources/textures/marble.png")

	pMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "pMat")
	vMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "vMat")
	mMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "mMat")
	viewPosUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "viewPos")
	diffuseUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "diffuse")

	// quad vao
	quadVAO = gl.createVertexArray();
	gl.bindVertexArray(quadVAO);
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
	var qdata = new Float32Array([            
		1.0, 1.0, 1.0, 1.0,		1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
		-1.0, 1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 1.0,
		-1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 0.0,
		
		-1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		0.0, 0.0,
		1.0, -1.0, 1.0, 1.0,	1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 0.0,
		1.0, 1.0, 1.0, 1.0,		1.0, 0.0, 0.0, 1.0,		0.0, 0.0, 1.0,		1.0, 1.0,
	]);
	gl.bufferData(gl.ARRAY_BUFFER, qdata, gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 13, 4 * 0);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4 * 13, 4 * 8);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4 * 13, 4 * 11);
	gl.enableVertexAttribArray(2);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	fbo = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

	colorBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, colorBuffer);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorBuffer,0);

	rbo = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
	gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,width,height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rbo);
	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(gl.FRAMEBUFFER_COMPLETE != e)
    {
      console.log('Frame Buffer Object Is InComplete : ' + e.toString());
      return false;
    }
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);


	video = setupVideo("trial1.mp4");

	console.log(video);

	videoTexture = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D,videoTexture);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

}

var then  = 0;

function renderForDeepCube(now,perspectiveMatrix, viewMatrix) {
	
	now *= 0.001;
	const deltaTime = now - then;
	then = now;
	
	if(blur)
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
	}

	if(copyVideo)
	{
		//console.log("Here");
		updateTexture(gl,videoTexture,video);
	}

	var modelMatrix = mat4.create();

	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0,0,canvas.width,canvas.height);
	// all gemoetry for scene
	for( var i = 0; i < positions.length; i++)
	{
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, positions[i]);
		mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 1.0])
		//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
		mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
		gl.useProgram(programForDeepCube);
		gl.bindVertexArray(vao);
		gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
		gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
		gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
		for(var j = 0; j < lightposition.length; j++)
		{
			gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"lights["+j+"].position"),lightposition[j]);
			gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"lights["+j+"].color"),lightColor[j]);
		}
		gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
		gl.uniform1i(diffuseUnifromForDeepCube, 0)
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, diffuseTextureForDeepCube)
		gl.drawArrays(gl.TRIANGLES, 0, 36);
		gl.bindVertexArray(null);
		gl.useProgram(null);
	}

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.5]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.glMatrix.toRadian(-180), [0.0, 0.0, 1.0])
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.glMatrix.toRadian(-180), [0.0, 1.0, 0.0])
	gl.useProgram(programForDeepCube);
	gl.bindVertexArray(quadVAO);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	for(var j = 0; j < lightposition.length; j++)
	{
		gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"lights["+j+"].position"),lightposition[j]);
		gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"lights["+j+"].color"),lightColor[j]);
	}
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform1i(diffuseUnifromForDeepCube, 0)
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
	gl.bindVertexArray(null);
	gl.useProgram(null);

	gl.disable(gl.DEPTH_TEST);

	// Draw FBO 
	if(blur)
	{
		mat4.identity(modelMatrix);
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);
		gl.useProgram(programGodRays);
		gl.uniformMatrix4fv(gl.getUniformLocation(programGodRays,"pMat"), false, perspectiveMatrix)
		gl.uniformMatrix4fv(gl.getUniformLocation(programGodRays,"vMat"), false, viewMatrix)
		gl.uniformMatrix4fv(gl.getUniformLocation(programGodRays,"mMat"), false, modelMatrix)
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,colorBuffer);
		gl.uniform1i(gl.getUniformLocation(programGodRays,"screenTexture"), 0);
		gl.bindVertexArray(quadVAO);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.useProgram(programGodRays);
		gl.bindTexture(gl.TEXTURE_2D,null);
	}

	gl.useProgram(programRain);
	gl.bindVertexArray(vao);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,colorBuffer);
	gl.uniform1i(gl.getUniformLocation(programRain,"screenTexture"), 0);
    gl.uniform3fv(gl.getUniformLocation(programRain, "iResolution"), [canvas.width,canvas.height,1.0]);
    gl.uniform1f(gl.getUniformLocation(programRain, "iTime"), now);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	angle += 0.01;
}

function uninitForDeepCube() {
	deleteProgram(programForDeepCube);
}
