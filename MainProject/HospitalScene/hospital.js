var programForSceneTwo;
var programVideoRender;
var programForECG;
var vaoForDeepCube;
var pMatUniformForSceneTwo;
var vMatUniformForSceneTwo;
var mMatUniformForSceneTwo;
var viewPosUniformForSceneTwo;
var angle = 0.0;

var programRenderHospital = {
	program : null,
	uniform : {
		pMat : null,
		vMat : null,
		mMat : null,
		viewPos : null
	}
};

var programRenderVideo = {
	program : null,
	uniform : {
		pMat : null,
		vMat : null,
		mMat : null,
		viewPos : null,
		lights : {
			position : null,
			color : null
		},
		flip : null,
		video : null
	}
};

var programRenderSineWave = {
	program : null,
	uniform : {
		iReolution  : null,
		iTime : null
	}
};

var HospitalSceneObjects = {
	mPlane : null,
	mBed : null,
	mcab1 : null,
	mcab2 : null,
	mFood : null,
	mPad : null,
	mSerum : null,
	mSofa : null,
	mTrolley : null,
	mLaptop : null,
	mLight : null,
	mDoor : null,
	mStool : null,
	mVentilator : null,
	mFan : null,
	mECGScreen : null,
	mScreen : null
};

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
var mECGScreen;
var mScreen;

var fboECGWave;
var textureECGWave;
var textureForm;

var video;
var copyVideo = false;
var videoTexture;

var Lights = [];

var cameraPathHospital = [
	//  position            center             up             velocity      //
	[[-2.5, -0.3, 0.0], [-2.2, -0.3, 1.7], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-3.5, 0.8, -3.0], [-2.2, -0.3, 1.7], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-3.5, 0.8, -3.0], [2.2, -0.3, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-3.5, 0.8, -3.0], [-2.2, -0.3, 1.7], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-3.5, 0.8, -3.0], [-13.2, -0.3, 1.7], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-3.5, 0.8, -3.0], [-4.0, -0.8, 0.8], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
	[[-4.0, 0.3, -0.5], [-4.0, -0.8, 0.8], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]],
];

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
		this.opacity = 1.0;
        this.texID = [];
		this.texType = [];
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
				case "$mat.opacity":
					this.opacity = test[4][1];
				break;
				case "$tex.file":
					/*
					var texType = 1; // diffuse
					switch(test[1][1])
					{
						case 1:
							console.log("diffuse");
							texType = 1;
						break;
						case 2:
							console.log("specular");
							texType = 2;
						break;
						case 3:
							console.log("ambient");

						break;
						case 4:
							console.log("emissive");
						break;
						case 5:
							console.log("height");
						break;
						case 6:
							console.log("normals");
						break;
						case 7:
							console.log("shininess");
						break;
						case 8:
							console.log("alpha");
						break;
						case 9:
							console.log("displacement");
						break;
						case 10:
							console.log("lightmap");
						break;
					}
					*/
					this.texID.push(loadTexture(test[4][1],true));
					this.texType.push(test[1][1]);
				break;
			}
        }
		this.texType.sort();
		for(var i = 0; i < this.texID.length; i++)
		{
			gl.bindTexture(gl.TEXTURE_2D, this.texID[i]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			//gl.generateMipmap(gl.TEXTURE_2D)
			gl.bindTexture(gl.TEXTURE_2D, null);
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
			gl.uniform1f(gl.getUniformLocation(program,"material.opacity"),this.mat.opacity);
			if(this.mat.texID.length != 0)
			{	
				for(var i = 0; i < this.mat.texType.length; i++)
				{
					switch(this.mat.texType[i])
					{
						// diffuse
						case 1:
							gl.activeTexture(gl.TEXTURE0+(this.mat.texType[i]-1));
							gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[i]);
							gl.uniform1i(gl.getUniformLocation(program,"diffuseTex.set"),1);
							gl.uniform1i(gl.getUniformLocation(program,"diffuseTex.texSampler"),this.mat.texType[i]-1);
						break;
						// specular
						case 2:
							gl.activeTexture(gl.TEXTURE0+(this.mat.texType[i]-1));
							gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[i]);
							gl.uniform1i(gl.getUniformLocation(program,"specularTex.set"),1);
							gl.uniform1i(gl.getUniformLocation(program,"specularTex.texSampler"),this.mat.texType[i]-1);
						break;
						// normal map
						case 5:
							gl.activeTexture(gl.TEXTURE0+(this.mat.texType[i]-1));
							gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[i]);
							gl.uniform1i(gl.getUniformLocation(program,"normalTex.set"),1);
							gl.uniform1i(gl.getUniformLocation(program,"normalTex.texSampler"),this.mat.texType[i]-1);
						break;
						// shiniess map
						case 7:
							/*
							gl.activeTexture(gl.TEXTURE0+(this.mat.texType[i]-1));
							gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[i]);
							gl.uniform1i(gl.getUniformLocation(program,"diffuseTex.set"),1);
							gl.uniform1i(gl.getUniformLocation(program,"diffuseTex.texSampler"),this.mat.texType[i]-1);
							*/
						break;
						// alpha or opacity
						case 8:
							gl.activeTexture(gl.TEXTURE0+(this.mat.texType[i]-1));
							gl.bindTexture(gl.TEXTURE_2D, this.mat.texID[i]);
							gl.uniform1i(gl.getUniformLocation(program,"alphaTex.set"),1);
							gl.uniform1i(gl.getUniformLocation(program,"alphaTex.texSampler"),this.mat.texType[i]-1);
						break;
					}
				}
			}
			else
			{
				gl.uniform1i(gl.getUniformLocation(program,"diffuseTex.set"),0);
				gl.uniform1i(gl.getUniformLocation(program,"specularTex.set"),0);
				gl.uniform1i(gl.getUniformLocation(program,"normalTex.set"),0);
				gl.uniform1i(gl.getUniformLocation(program,"alphaTex.set"),0);
			}
		}
		else
		{
			gl.uniform3fv(gl.getUniformLocation(program,"material.diffuseMat"),[1.0,1.0,1.0]);
			gl.uniform3fv(gl.getUniformLocation(program,"material.specularMat"),[0.0,0.0,0.0]);
			gl.uniform1f(gl.getUniformLocation(program,"material.shininess"),100.0);
			gl.uniform1i(gl.getUniformLocation(program,"diffuseTex.set"),0);
			gl.uniform1i(gl.getUniformLocation(program,"specularTex.set"),0);
			gl.uniform1i(gl.getUniformLocation(program,"normalTex.set"),0);
			gl.uniform1i(gl.getUniformLocation(program,"alphaTex.set"),0);
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

		gl.bindTexture(gl.TEXTURE_2D,null);
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
		console.log(filename);
		console.log(this);
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
	
		//console.log(ModelData);
		
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
	var vertShader = createShader('HospitalScene/shaders/demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('HospitalScene/shaders/demo.frag', gl.FRAGMENT_SHADER);
	programForSceneTwo = createProgram([vertShader, fragShader]);
	programRenderHospital.program = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	programRenderHospital.uniform.pMat = gl.getUniformLocation(programRenderHospital.program,"pMat");
	programRenderHospital.uniform.vMat = gl.getUniformLocation(programRenderHospital.program,"vMat");
	programRenderHospital.uniform.mMat = gl.getUniformLocation(programRenderHospital.program,"mMat");
	programRenderHospital.uniform.viewPos = gl.getUniformLocation(programRenderHospital.program,"viewPos");

	vertShader = createShader('HospitalScene/shaders/video.vert', gl.VERTEX_SHADER);
	fragShader = createShader('HospitalScene/shaders/video.frag', gl.FRAGMENT_SHADER);
	programVideoRender = createProgram([vertShader, fragShader]);

	programRenderVideo.program = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	programRenderVideo.uniform.pMat = gl.getUniformLocation(programRenderVideo.program,"pMat");
	programRenderVideo.uniform.vMat = gl.getUniformLocation(programRenderVideo.program,"vMat");
	programRenderVideo.uniform.mMat = gl.getUniformLocation(programRenderVideo.program,"mMat");
	programRenderVideo.uniform.viewPos = gl.getUniformLocation(programRenderVideo.program,"viewPos");
	programRenderVideo.uniform.lights.position = gl.getUniformLocation(programRenderVideo.program,"lights.position");
	programRenderVideo.uniform.lights.color = gl.getUniformLocation(programRenderVideo.program,"lights.color");
	programRenderVideo.uniform.flip = gl.getUniformLocation(programRenderVideo.program,"flip");
	programRenderVideo.uniform.video = gl.getUniformLocation(programRenderVideo.program,"video");

	vertShader = createShader('HospitalScene/shaders/quad.vert', gl.VERTEX_SHADER);
	fragShader = createShader('HospitalScene/shaders/sinewave.frag', gl.FRAGMENT_SHADER);
	programForECG = createProgram([vertShader, fragShader]);
	programRenderSineWave.program = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	programRenderSineWave.uniform.iReolution = gl.getUniformLocation(programRenderSineWave.program,"iResolution");
	programRenderSineWave.uniform.iTime = gl.getUniformLocation(programRenderSineWave.program,"iTime");

}

function initForSceneTwo(sceneCamera) {
	vao = gl.createVertexArray();
	gl.bindVertexArray(null);

	pMatUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "pMat")
	vMatUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "vMat")
	mMatUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "mMat")
	viewPosUniformForSceneTwo = gl.getUniformLocation(programForSceneTwo, "viewPos")
	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForSceneTwo, "diffuse")

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	HospitalSceneObjects.mPlane = new mesh(v,null,null);
	console.log(HospitalSceneObjects.mPlane);

	var v = [[1.0, 1.0, 0.0,-1.0, 1.0, 0.0,-1.0, -1.0, 0.0,-1.0,-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],[1.0, 1.0, 0.0, 1.0,0.0, 0.0, 0.0, 0.0,	1.0, 0.0,1.0, 1.0,]];
	//var i = [0,1,2,1,2,3];
	HospitalSceneObjects.mScreen = new mesh(v,null,null);
	console.log(HospitalSceneObjects.mScreen);

	HospitalSceneObjects.mBed = new Model('HospitalScene/resources/bedf.json');
	HospitalSceneObjects.mcab1 = new Model('HospitalScene/resources/cab1.json');
	HospitalSceneObjects.mcab2 = new Model('HospitalScene/resources/cab2.json');
	HospitalSceneObjects.mFood = new Model('HospitalScene/resources/food.json');
	HospitalSceneObjects.mPad = new Model('HospitalScene/resources/pad.json');
	HospitalSceneObjects.mSerum = new Model('HospitalScene/resources/serum.json');
	HospitalSceneObjects.mSofa = new Model('HospitalScene/resources/sofa.json');
	HospitalSceneObjects.mTrolley = new Model('HospitalScene/resources/trolley.json');
	HospitalSceneObjects.mLaptop = new Model('HospitalScene/resources/laptop.json');
	HospitalSceneObjects.mLight = new Model('HospitalScene/resources/light.json');
	HospitalSceneObjects.mStool = new Model('HospitalScene/resources/stool.json');
	HospitalSceneObjects.mVentilator = new Model('HospitalScene/resources/ventilator.json');
	HospitalSceneObjects.mDoor = new Model('HospitalScene/resources/door.json');
	HospitalSceneObjects.mFan = new Model('HospitalScene/resources/fan.json');

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

	video = setupVideo("HospitalScene/resources/video/trial1.mp4");

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
	
	HospitalSceneObjects.mECGScreen = new mesh(HospitalSceneObjects.mVentilator.meshes[0].vertices,HospitalSceneObjects.mVentilator.meshes[0].indices,0);
	HospitalSceneObjects.mECGScreen.setMaterial(testMat);
	console.log(mECGScreen);

	textureForm = loadTexture("resources/textures/form.png");
	gl.bindTexture(gl.TEXTURE_2D,textureForm);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D,null);
	testMat = new material();
	testMat.texID.push(textureForm);
	testMat.texType.push(1);
	HospitalSceneObjects.mPad.meshes[2].setMaterial(testMat);
	console.log(mPad);

	// Light Setups
	Lights.push(
		{	
			position : [-3.0,3.5,-4.0],
			ambient : [0.2,0.2,0.2],
			diffuse : [1.0,1.0,1.0],
			specular : [1.0,1.0,1.0]
		});
	
		Lights.push(
			{	
				position : [0.0,4.5,14.8],
				ambient : [0.1,0.1,0.1],
				diffuse : [1.0,1.0,1.0],
				specular : [1.0,1.0,1.0]
			});

	sceneCamera.updatePath(cameraPathHospital);
}

function renderForSceneTwo(time , perspectiveMatrix, viewMatrix) {
	var cameraPosition = debugCamera.cameraPosition;

	if(copyVideo)
	{
		//console.log("Here");
		updateTexture(gl,videoTexture,video);
	}
	
	var modelMatrix = mat4.create();
	mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 1.0])

	gl.disable(gl.CULL_FACE);

	// light src test
	for(var l  = 0; l < Lights.length; l++)
		renderLightSourceDeep(perspectiveMatrix, viewMatrix, Lights[l].position, Lights[l].diffuse);

	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPlane.render(programRenderHospital.program);
	gl.useProgram(null);

	//front
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,15.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPlane.render(programRenderHospital.program);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	gl.uniform3fv(viewPosUniformForSceneTwo, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPlane.render(programRenderHospital.program);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPlane.render(programRenderHospital.program);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPlane.render(programRenderHospital.program);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPlane.render(programRenderHospital.program);
	gl.useProgram(null);


	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-6.0,-0.5,-5.9]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mLight.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-1.5,14.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mcab2.render(programRenderHospital.program);
	gl.useProgram(null);
	
	//gl.disable(gl.CULL_FACE);


	gl.enable(gl.CULL_FACE);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-4.8,0.5]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mBed.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-2.8,-2.8]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.15]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mcab1.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-1.3,-4.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mFood.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-0.9,0.8]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(190.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mPad.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-0.0,-3.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mSerum.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-1.0,-5.0,0.5]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-50.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.1]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mVentilator.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-1.0,-5.0,0.55]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-50.0), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.1]);
	gl.useProgram(programRenderVideo.program);
	gl.uniformMatrix4fv(programRenderVideo.uniform.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(programRenderVideo.uniform.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(programRenderVideo.uniform.mMat, false, modelMatrix)
	gl.uniform3fv(programRenderVideo.uniform.viewPos, cameraPosition)
	gl.uniform3fv(programRenderVideo.uniform.lights.position, [2.8,-0.8,-1.8]);
	gl.uniform3fv(programRenderVideo.uniform.lights.color, [1.0,1.0,1.0]);
	gl.uniform1i(programRenderVideo.uniform.flip, 1);
	gl.uniform1i(programRenderVideo.uniform.video, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureECGWave);
	HospitalSceneObjects.mECGScreen.render(programRenderVideo.program);
	gl.useProgram(null);

	//renderLightSourceDeep(perspectiveMatrix, viewMatrix, [2.8,-0.8,-1.8], Lights[1].diffuse);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-3.5,13.5]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-200), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mSofa.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [2.0,-3.5,13.7]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-170), [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mSofa.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-3.0,-3.6,1.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.25,0.25,0.2]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mTrolley.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-2.5,-0.9,1.2]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(20), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[4.0,4.0,4.0]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mLaptop.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,4.3,4.0]);
	mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mFan.render(programRenderHospital.program);
	gl.useProgram(null);


	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.5,-2.9,-4.5]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mStool.render(programRenderHospital.program);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,3.8,16.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-90), [0.0, 0.0, 1.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programRenderHospital.program);
	gl.uniformMatrix4fv(programRenderHospital.uniform.pMat, false, perspectiveMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.vMat, false, viewMatrix);
	gl.uniformMatrix4fv(programRenderHospital.uniform.mMat, false, modelMatrix);
	gl.uniform3fv(programRenderHospital.uniform.viewPos, cameraPosition);
	for(var l = 0; l < Lights.length; l++)
	{
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].direction"),Lights[l].position );
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].ambient"), Lights[l].ambient);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].diffuse"), Lights[l].diffuse);
		gl.uniform3fv(gl.getUniformLocation(programRenderHospital.program,"light["+l+"].specular"), Lights[l].specular);
	}
	HospitalSceneObjects.mDoor.render(programRenderHospital.program);
	
	// screen texture
	gl.disable(gl.CULL_FACE);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-2.3,-0.35,1.75]);
	//mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 0.0, 1.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-20), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-15), [1.0, 0.0, 0.0]);
	
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.75,0.48,1.0]);
	gl.useProgram(programRenderVideo.program);
	gl.uniformMatrix4fv(programRenderVideo.uniform.pMat, false, perspectiveMatrix)
	gl.uniformMatrix4fv(programRenderVideo.uniform.vMat, false, viewMatrix)
	gl.uniformMatrix4fv(programRenderVideo.uniform.mMat, false, modelMatrix)
	gl.uniform3fv(programRenderVideo.uniform.viewPos, cameraPosition)
	gl.uniform3fv(programRenderVideo.uniform.lights.position, [-2.7,-0.25,0.5]);
	gl.uniform3fv(programRenderVideo.uniform.lights.color, [1.0,1.0,1.0]);
	gl.uniform1i(programRenderVideo.uniform.flip, 2);
	gl.uniform1i(programRenderVideo.uniform.video, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	HospitalSceneObjects.mScreen.render(programRenderVideo.program);
	gl.useProgram(null);

	renderLightSourceDeep(perspectiveMatrix, viewMatrix, [-4.0,-1.5,13.0], Lights[1].diffuse);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-3.5,13.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(90), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(180), [0.0, 1.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(20), [0.0, 0.0, 1.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-15), [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);	
	renderForPhoneDeep(perspectiveMatrix,viewMatrix,modelMatrix,[-4.0,-1.5,13.0],textureECGWave);

	gl.bindFramebuffer(gl.FRAMEBUFFER, fboECGWave);
	gl.useProgram(programRenderSineWave.program);
	gl.bindVertexArray(vao);
    gl.uniform3fv(programRenderSineWave.uniform.iReolution, [1024,1024,1.0]);
    gl.uniform1f(programRenderSineWave.uniform.iTime, time / 1000.0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	angle += 0.005;
}

function uninitForSceneTwo() {
	deleteProgram(programRenderHospital.program);
}
