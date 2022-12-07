var programForDeepCube;
var progamLightingPass;
var programLightBox;
var vaoForDeepCube;
var pMatUnifromForDeepCube;
var vMatUnifromForDeepCube;
var mMatUnifromForDeepCube;
var viewPosUnifromForDeepCube;
var diffuseUnifromForDeepCube;
var diffuseTextureForDeepCube;
var angle = 0.0
var mMonkey;

var gBuffer;
var rboDepth;
var gPosition,gNormal,gAlbedo;

var quadVAO = 0;

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

var lightposition = [];
var lightColor = [];
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
            gl.enableVertexAttribArray(2);

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
			gl.uniform3fv(gl.getUniformLocation(program,"material.specularMat"),[1.0,1.0,1.0]);
			gl.uniform1f(gl.getUniformLocation(program,"material.shininess"),32.0);
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
			vertices.push(ModelData.meshes[i].normals);
			vertices.push(ModelData.meshes[i].texturecoords[0]);
			vertices.push(ModelData.meshes[i].tangents);
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

function setupProgramForDeepCube() {
	var vertShader = createShader('g_buffer.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('g_buffer.frag', gl.FRAGMENT_SHADER);
	programForDeepCube = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	vertShader = createShader('deferred_shading.vert', gl.VERTEX_SHADER);
	fragShader = createShader('deferred_shading.frag', gl.FRAGMENT_SHADER);
	progamLightingPass = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);

	vertShader = createShader('lighting_box.vert', gl.VERTEX_SHADER);
	fragShader = createShader('lighting_box.frag', gl.FRAGMENT_SHADER);
	programLightBox = createProgram([vertShader, fragShader]);
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

	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "diffuse")

	var v = [   -1.0, 1.0, 0.0, 0.0, 1.0,
				-1.0,-1.0, 0.0, 0.0, 0.0,
				1.0,  1.0, 0.0, 1.0, 1.0,
				1.0, -1.0, 0.0, 1.0, 0.0
			];
	
	quadVAO = gl.createVertexArray();
	var vbo = gl.createBuffer();
	gl.bindVertexArray(quadVAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4 * 5, 4 * 0);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 5, 4 * 3);
	gl.enableVertexAttribArray(1);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	mMonkey = new Model('./resources/monkey.json');

	gBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER,gBuffer);

	gPosition = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,gPosition);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,width,height,0,gl.RGBA,gl.FLOAT,null);
	//gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gPosition,0);

	gNormal = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,gNormal);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,width,height,0,gl.RGBA,gl.FLOAT,null);
	//gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, gNormal,0);

	gAlbedo = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,gAlbedo);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
	//gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,width,height,0,gl.RGBA,gl.FLOAT,null);	
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, gAlbedo,0);

	gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1,gl.COLOR_ATTACHMENT2]);

	rboDepth = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, rboDepth);
	gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,width,height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rboDepth);

	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(gl.FRAMEBUFFER_COMPLETE !== e)
    {
      console.log('Frame Buffer Object Is InComplete : ' + e.toString());
      return false;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

	for(var i = 0; i < 32; i++)
	{
		//console.log("lights["+i+"].position");
		lightposition.push([Math.random() *6.0 - 3.0,Math.random() *6.0 - 4.0,Math.random()*6.0 - 3.0]);
		lightColor.push([Math.random() ,Math.random(),Math.random()]);
	}

	console.log(lightposition);
	console.log(lightColor);

	gl.useProgram(progamLightingPass);
	gl.uniform1i(gl.getUniformLocation(progamLightingPass,"gPosition"),0);
	gl.uniform1i(gl.getUniformLocation(progamLightingPass,"gNormal"),1);
	gl.uniform1i(gl.getUniformLocation(progamLightingPass,"gAlbedoSpec"),2);
	gl.useProgram(null);
}

function renderForDeepCube(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create();

	// 1 : geometry Pass
	gl.bindFramebuffer(gl.FRAMEBUFFER,gBuffer);
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.CULL_FACE);
	for( var i = 0; i < positions.length; i++)
	{
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, positions[i]);
		mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(angle), [1.0, 1.0, 1.0]);
		//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
		mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
		gl.useProgram(programForDeepCube);
		gl.uniformMatrix4fv(gl.getUniformLocation(programForDeepCube,"mProj"), false, perspectiveMatrix);
		gl.uniformMatrix4fv(gl.getUniformLocation(programForDeepCube,"mView"), false, viewMatrix);
		gl.uniformMatrix4fv(gl.getUniformLocation(programForDeepCube,"mModel"), false, modelMatrix);
		gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"diffuseMat"), [1.0,1.0,1.0]);
		gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"specularMat"), [1.0,1.0,1.0]);
		mMonkey.render(programForDeepCube);
		gl.useProgram(null);
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);

	gl.useProgram(progamLightingPass);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,gPosition);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D,gNormal);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D,gAlbedo);
	for(var i = 0; i < lightposition.length; i++)
	{
		gl.uniform3fv(gl.getUniformLocation(progamLightingPass,"lights["+i+"].position"),lightposition[i]);
		gl.uniform3fv(gl.getUniformLocation(progamLightingPass,"lights["+i+"].color"),lightColor[i]);
		//console.log("lights["+i+"].position "+lightposition[i]);
		const linear = 0.7;
		const quadratic = 1.8;
		gl.uniform1f(gl.getUniformLocation(progamLightingPass,"lights["+i+"].linear"),linear);
		gl.uniform1f(gl.getUniformLocation(progamLightingPass,"lights["+i+"].quadratic"),quadratic);
		const brightness = Math.max(lightColor[i][0],lightColor[i][1],lightColor[i][2]);
		var raidus = (-linear + Math.sqrt(linear * linear - 4 * quadratic * (1.0 - (256.0/5.0) * brightness))) / (2.0 * quadratic);
		gl.uniform1f(gl.getUniformLocation(progamLightingPass,"lights["+i+"].radius"),raidus);
	}
	gl.uniform3fv(gl.getUniformLocation(progamLightingPass,"viewPos"), cameraPosition);
	gl.bindVertexArray(quadVAO);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
	gl.bindVertexArray(null);
	gl.useProgram(null);

	gl.bindFramebuffer(gl.READ_FRAMEBUFFER,gBuffer);
	gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);

	gl.blitFramebuffer(0,0,canvas.width,canvas.height,0,0,canvas.width,canvas.height,gl.DEPTH_BUFFER_BIT,gl.NEAREST);
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);

	// 3 finishing touch up

	gl.useProgram(programLightBox);
	gl.uniformMatrix4fv(gl.getUniformLocation(programLightBox,"mProj"), false, perspectiveMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(programLightBox,"mView"), false, viewMatrix);
	for(var i = 0; i < lightposition.length; i++)
	{
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, lightposition[i]);
		mat4.scale(modelMatrix,modelMatrix,[0.125,0.125,0.125]);
		gl.uniformMatrix4fv(gl.getUniformLocation(programLightBox,"mModel"), false, modelMatrix);
		gl.uniform3fv(gl.getUniformLocation(programLightBox,"lightcolor"), lightColor[i]);
		gl.bindVertexArray(vao);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
	}
	gl.bindVertexArray(null);
	gl.useProgram(null);

	angle += 0.5;
}

function uninitForDeepCube() {
	deleteProgram(programForDeepCube);
}
