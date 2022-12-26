var programForSceneTwo;
var programVideoRender;
var programForECG;
var vaoForDeepCube;
var pMatUniformForSceneTwo;
var vMatUniformForSceneTwo;
var mMatUniformForSceneTwo;
var viewPosUniformForSceneTwo;
var angle = 0.0;

var mCube;
var mBed;
var mcab1;
var mcab2;
var mFood;
var mPad;
var mSerum;
var mSofa;
var mTrolley;
var mLaptop;
var mLight;
var mDoor;
var mStool;
var mVentilator;
var mFan;
var mApple;
var mECGScreen;
var mScreen;

var quad;

var angle;

var fboECGWave;
var textureECGWave;
var textureForm;

var video;
var copyVideo = false;
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

// delete this later
class material
{
    constructor(matproperties)
    {
        this.properties = matproperties;
        this.diffuse = [0.8,0.8,0.8];
        this.specular = [0.8,0.8,0.8];
        this.ambient = [0.8,0.8,0.8];
        this.shininess = 32.0;
        this.texID = [];
        this.setupMaterial();
    }

    setupMaterial()
    {
		if(this.properties == null)
			return;
		//console.log(this.properties);
		for(var i = 0; i < this.properties.length; i++)
        {
            // do something
			var test = Object.entries(this.properties[i]);
			switch(test[0][1])
			{
				case "$clr.ambient":
					this.ambient = test[4][1];
				break;
				case "$clr.diffuse":
					this.diffuse = test[4][1];
				break;
				case "$clr.specular":
					this.specular = test[4][1];
				break;
				case "$mat.shininess":
					this.shininess = test[4][1];
				break;
				case "$tex.file":
					this.texID.push(loadTexture(test[4][1]));
				break;
			}
        }
    }
}

// mesh class
class mesh
{
    constructor(vertices,indices, idx)
    {
        this.vertices = vertices;
        this.indices = [].concat.apply([],indices);
		this.matIndex = idx;
		this.mat = null;
        this.vao = -1;
        this.vbo = [-1,-1,-1,-1,-1];
        this.ibo = -1;
        this.vertexCount = 0;

        this.setupMesh();
    }

    setupMesh()
    {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        if(this.indices.length != 0)
        {
            this.ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            this.vertexCount = this.indices.length;
        }
        else{
            this.ibo = -1;
            this.vertexCount = this.vertices[0].length / 3;
        }

        for(var i = 0 ;i < this.vertices.length; i++)
        {
            if(this.vertices[i] != undefined)
            {
                this.vbo[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices[i]), gl.STATIC_DRAW);
            }
            else
                this.vbo[i] = -1;
        }

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(0);

        //normal
        if(this.vbo[1] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(1);            
        }
        else
            gl.disableVertexAttribArray(1);
        
        //texcoord
        if(this.vbo[2] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
            gl.vertexAttribPointer(2,2,gl.FLOAT,false,2 * Float32Array.BYTES_PER_ELEMENT,0);
            gl.enableVertexAttribArray(2);
        }
        else
            gl.disableVertexAttribArray(2);

        //tangent
        if(this.vbo[3] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[3]);
            gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(3);            
        }
        else
            gl.disableVertexAttribArray(3);
            
        // bitagent
        if(this.vbo[4] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[4]);
            gl.vertexAttribPointer(4,3,gl.FLOAT,false,3 * Float32Array.BYTES_PER_ELEMENT,0);
            gl.enableVertexAttribArray(4);
        }
        else
            gl.disableVertexAttribArray(4);
        gl.bindVertexArray(null);
    }

    render(program)
    {
        // set textures in future

        // draw 
		//console.log(this.vertexCount);
		if(this.mat != undefined || this.mat != null)
		{
			gl.uniform3fv(gl.getUniformLocation(program,"material.diffuseMat"),this.mat.diffuse);
			gl.uniform3fv(gl.getUniformLocation(program,"material.specularMat"),this.mat.specular);
			gl.uniform1f(gl.getUniformLocation(program,"material.shininess"),this.mat.shininess);
			if(this.mat.texID.length != 0)
			{
				gl.uniform1i(gl.getUniformLocation(program,"textureAvailable"),1);
				gl.activeTexture(gl.TEXTURE0)
				gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[0]);
				gl.uniform1i(gl.getUniformLocation(program,"diffuseTexture"),0);
				gl.activeTexture(gl.TEXTURE1)
				gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[1]);
				gl.uniform1i(gl.getUniformLocation(program,"specularTexture"),1);
			}
			else
				gl.uniform1i(gl.getUniformLocation(program,"textureAvailable"),0);
		}
		else
		{
			gl.uniform3fv(gl.getUniformLocation(program,"material.diffuseMat"),[1.0,1.0,1.0]);
			gl.uniform3fv(gl.getUniformLocation(program,"material.specularMat"),[0.0,0.0,0.0]);
			gl.uniform1f(gl.getUniformLocation(program,"material.shininess"),100.0);
		}
		gl.bindVertexArray(this.vao);
		if(this.ibo != -1)
        {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo);
			gl.drawElements(gl.TRIANGLES,this.vertexCount,gl.UNSIGNED_SHORT,0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);	
		}
		else
		{
			gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);
    }

	setMaterial(mat)
	{
		this.mat = mat;
	}
}

class Model{
	constructor(filename)
	{
		this.meshes = new Array();
		this.materials = new Array();
		this.loadModel(filename);
	}

	render(program)
	{
		for(var i = 0; i < this.meshes.length; i++)
		{
			this.meshes[i].render(program);
		}
	}

	loadModel(filename) {

		var xhr = new XMLHttpRequest();
		xhr.open("GET", filename, false);
		xhr.overrideMimeType("application/json");
		xhr.send();
		var ModelData = JSON.parse(xhr.responseText);
	
		console.log(ModelData);
		
		var vertices = [];
		var indices = [];
		for(var i = 0; i < ModelData.meshes.length; i++)
		{
			vertices = [];
			vertices.push(ModelData.meshes[i].vertices);
			if(ModelData.meshes[i].normals != undefined)
				vertices.push(ModelData.meshes[i].normals);
			if(ModelData.meshes[i].texturecoords != undefined)
				vertices.push(ModelData.meshes[i].texturecoords[0]);
			if(ModelData.meshes[i].tangents != undefined)
				vertices.push(ModelData.meshes[i].tangents);
			if(ModelData.meshes[i].bitangents != undefined)	
				vertices.push(ModelData.meshes[i].bitangents);
			indices.push(ModelData.meshes[i].faces);
			this.meshes.push(new mesh(vertices,indices[i],ModelData.meshes[i].materialindex));
		}

		// material list
		for(var i = 0 ; i < ModelData.materials.length; i++)
		{
				var nmat = new material(ModelData.materials[i].properties);
				this.materials.push(nmat);
		}

		for(var j = 0; j < this.meshes.length; j++)
			this.meshes[j].setMaterial(this.materials[this.meshes[j].matIndex]);

	}

	logModelData()
	{
		console.log("Model Data ---")
		for(var i = 0; i < this.meshes.length; i++)
		{
			console.log(this.meshes[i].vertexCount);
			console.log(this.meshes[i].mat.texID);
		}
	}
}

//

function setupprogramForSceneTwo() {
	var vertShader = createShader('Scene2/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('Scene2/shaders/point.frag', gl.FRAGMENT_SHADER);
	programForSceneTwo = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	vertShader = createShader('Scene2/shaders/video.vert', gl.VERTEX_SHADER);
	fragShader = createShader('Scene2/shaders/video.frag', gl.FRAGMENT_SHADER);
	programVideoRender = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	vertShader = createShader('Scene2/shaders/quad.vert', gl.VERTEX_SHADER);
	fragShader = createShader('Scene2/shaders/sinewave.frag', gl.FRAGMENT_SHADER);
	programForECG = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

}

function initForSceneTwo() {
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
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 13, 4 * 0)
	gl.enableVertexAttribArray(0)
	gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 4 * 13, 4 * 4)
	gl.enableVertexAttribArray(5)
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4 * 13, 4 * 8)
	gl.enableVertexAttribArray(1)
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4 * 13, 4 * 11)
	gl.enableVertexAttribArray(2)
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	pMatUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "pMat")
	vMatUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "vMat")
	mMatUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "mMat")
	viewPosUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "viewPos")
	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForSceneTwo, "diffuse")

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	mPlane = new mesh(v,null,null);
	console.log(mPlane);

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	//var i = [0,1,2,1,2,3];
	mScreen = new mesh(v,null,null);
	console.log(mScreen);

	quad = dshapes.initQuad();

	mBed = new Model('Scene2/resources/bedf.json');
	mcab1 = new Model('Scene2/resources/cab1.json');
	mcab2 = new Model('Scene2/resources/cab2.json');
	mFood = new Model('Scene2/resources/food.json');
	mPad = new Model('Scene2/resources/pad.json');
	mSerum = new Model('Scene2/resources/serum.json');
	mSofa = new Model('Scene2/resources/sofa.json');
	mTrolley = new Model('Scene2/resources/trolley.json');
	mLaptop = new Model('Scene2/resources/laptop.json');
	mLight = new Model('Scene2/resources/light.json');
	mStool = new Model('Scene2/resources/stool.json');
	mVentilator = new Model('Scene2/resources/ventilator.json');
	mDoor = new Model('Scene2/resources/door.json');
	mFan = new Model('Scene2/resources/fan.json');
	mApple = new Model('Scene2/resources/apple.json');

	fboECGWave = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fboECGWave);

	textureECGWave = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, textureECGWave);
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureECGWave, 0);

	gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	// load video

	video = setupVideo("Scene2/resources/video/trial1.mp4");

	console.log(video);

	videoTexture = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D,videoTexture);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D,null);
	
	var testMat = new material();
	testMat.diffuse = [1.0,1.0,1.0];
    testMat.specular = [1.0,1.0,1.0];
    testMat.ambient = [1.0,1.0,1.0];
	testMat.shininess = 32.0;
	testMat.texID.push(textureECGWave);
	
	mECGScreen = new mesh(mVentilator.meshes[0].vertices, mVentilator.meshes[0].indices,0);
	mECGScreen.setMaterial(testMat);
	console.log(mECGScreen);

	textureForm = loadTexture("resources/textures/form.png");
	testMat = new material();
	testMat.texID.push(textureForm);
	mPad.meshes[2].setMaterial(testMat);
	console.log(mPad);

}

function renderForSceneTwo(time , perspectiveMatrix, viewMatrix) {
	
	if(copyVideo)
	{
		//console.log("Here");
		updateTexture(gl,videoTexture,video);
	}
	
	var modelMatrix = mat4.create();
	mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 1.0])

	gl.disable(gl.CULL_FACE);
	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	mPlane.render(programForSceneTwo);
	gl.useProgram(null);

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,15.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForSceneTwo);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForSceneTwo);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForSceneTwo);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForSceneTwo);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForSceneTwo);
	gl.useProgram(null);

	gl.enable(gl.CULL_FACE);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-4.8,0.5]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mBed.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-2.8,-2.8]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.15]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mcab1.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-1.5,14.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mcab2.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-1.3,-4.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mFood.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-3.5,13.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(230.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mPad.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-0.0,-3.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mSerum.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-5.0,2.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.1]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mVentilator.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.0,-5.0,2.05]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.1]);
	gl.useProgram(programVideoRender);
	gl.uniformMatrix4fv(gl.getUniformLocation(programVideoRender,"pMat"), false, perspectiveMatrix)
	gl.uniformMatrix4fv(gl.getUniformLocation(programVideoRender,"vMat"), false, viewMatrix)
	gl.uniformMatrix4fv(gl.getUniformLocation(programVideoRender,"mMat"), false, modelMatrix)
	gl.uniform3fv(gl.getUniformLocation(programVideoRender,"viewPos"), cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programVideoRender,"lights.position"), [3.5,-0.5,-2.5]);
	gl.uniform3fv(gl.getUniformLocation(programVideoRender,"lights.color"), [1.0,1.0,1.0]);
	gl.uniform1i(gl.getUniformLocation(programVideoRender,"flip"), 1);
	gl.uniform1i(gl.getUniformLocation(programVideoRender,"video"), 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureECGWave);
	mECGScreen.render(programVideoRender);
	gl.useProgram(null);


	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-3.5,13.5]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-200), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mSofa.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [2.0,-3.5,13.7]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-170), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mSofa.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-3.0,-3.6,1.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.25,0.25,0.2]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mTrolley.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-3.7,-0.9,1.2]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-20), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mLaptop.render(programForSceneTwo);
	gl.useProgram(null);

	//gl.disable(gl.CULL_FACE);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-2.0,-0.78,1.2]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.2]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mApple.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-0.5,-5.9]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mLight.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,4.3,4.0]);
	mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mFan.render(programForSceneTwo);
	gl.useProgram(null);

	// light src test
/*
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [3.5,-0.5,-2.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.bindVertexArray(vao);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-0.2,-1.0,-1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,0.0,0.0]);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	gl.bindVertexArray(null);
	gl.useProgram(null);
*/
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.5,-2.9,-4.5]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.1,0.1,0.1]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mStool.render(programForSceneTwo);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,3.8,16.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForSceneTwo);
	gl.uniformMatrix4fv(pMatUniformForSceneTwo, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUniformForSceneTwo, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUniformForSceneTwo, false, modelMatrix)
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.direction"), [-3.0,3.5,-4.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.diffuse"), [1.0,1.0,1.0]);
	gl.uniform3fv(gl.getUniformLocation(programForSceneTwo,"light.specular"), [1.0,1.0,1.0]);
	mDoor.render(programForSceneTwo);
	gl.useProgram(null);

	// screen texture
	gl.disable(gl.CULL_FACE);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-3.9,-0.35,1.75]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(20), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-15), [1.0, 0.0, 0.0]);
	
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.75,0.48,1.0]);
	gl.useProgram(programVideoRender);
	gl.uniformMatrix4fv(gl.getUniformLocation(programVideoRender,"pMat"), false, perspectiveMatrix)
	gl.uniformMatrix4fv(gl.getUniformLocation(programVideoRender,"vMat"), false, viewMatrix)
	gl.uniformMatrix4fv(gl.getUniformLocation(programVideoRender,"mMat"), false, modelMatrix)
	gl.uniform3fv(gl.getUniformLocation(programVideoRender,"viewPos"), cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programVideoRender,"lights.position"), [-4.1,-0.50,2.4]);
	gl.uniform3fv(gl.getUniformLocation(programVideoRender,"lights.color"), [1.0,1.0,1.0]);
	gl.uniform1i(gl.getUniformLocation(programVideoRender,"flip"), 2);
	gl.uniform1i(gl.getUniformLocation(programVideoRender,"video"), 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	mScreen.render(programVideoRender);
	gl.useProgram(null);

	gl.bindFramebuffer(gl.FRAMEBUFFER, fboECGWave);
	gl.useProgram(programForECG);
	gl.bindVertexArray(vao);
    gl.uniform3fv(gl.getUniformLocation(programForECG, "iResolution"), [1024,1024,1.0]);
    gl.uniform1f(gl.getUniformLocation(programForECG, "iTime"), time / 1000.0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	angle += 0.005;

}

function uninitForSceneTwo() {
	deleteProgram(programForSceneTwo);
}
