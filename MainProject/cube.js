var programForDeepCube;
var vaoForDeepCube;
var pMatUnifromForDeepCube;
var vMatUnifromForDeepCube;
var mMatUnifromForDeepCube;
var viewPosUnifromForDeepCube;
var diffuseUnifromForDeepCube;
var diffuseTextureForDeepCube;
var angle = 0.0
var mCube;
var mBed;
var mcab1;
var mcab2;
var mFood;
var mPad;
var mSerum;
var mSofa;

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
	var vertShader = createShader('demo.vert', gl.VERTEX_SHADER);
	var fragShader = createShader('directional.frag', gl.FRAGMENT_SHADER);
	programForDeepCube = createProgram([vertShader, fragShader]);
	deleteShader(vertShader);
	deleteShader(fragShader);
}

function initForDeepCube() {
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

	diffuseTextureForDeepCube = loadTexture("resources/textures/marble.png")

	pMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "pMat")
	vMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "vMat")
	mMatUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "mMat")
	viewPosUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "viewPos")
	//diffuseUnifromForDeepCube = gl.getUniformLocation(programForDeepCube, "diffuse")

	var v = [[-1.0,1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,1.0,-1.0,0.0],[0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0],[0.0,1.0,0.0,0.0,1.0,1.0,1.0,0.0]];
	var i = [0,1,2,1,2,3];
	mPlane = new mesh(v,i,null);
	console.log(mPlane);

	mBed = new Model('./resources/bedf.json');
	mcab1 = new Model('./resources/cab1.json');
	mcab2 = new Model('./resources/cab2.json');
	mFood = new Model('./resources/food.json');
	mPad = new Model('./resources/pad.json');
	mSerum = new Model('./resources/serum.json');
	mSofa = new Model('./resources/sofa.json');
}

function renderForDeepCube(perspectiveMatrix, viewMatrix) {
	var modelMatrix = mat4.create();
	mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 1.0])

	/*
	gl.useProgram(programForDeepCube);
	gl.bindVertexArray(vao);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform1i(diffuseUnifromForDeepCube, 0)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, diffuseTextureForDeepCube)
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	gl.bindTexture(gl.TEXTURE_2D,null);
	gl.bindVertexArray(null);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [5.0,0.0,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 1.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.bindTexture(gl.TEXTURE_2D, diffuseTextureForDeepCube)
	gl.uniform1i(diffuseUnifromForDeepCube, 0)
	mCube.render(programForDeepCube);
	gl.bindTexture(gl.TEXTURE_2D,null);
	gl.bindVertexArray(null);
	gl.useProgram(null);
*/
	gl.disable(gl.CULL_FACE);
	// back
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-5.0]);
	//mat4.rotate(modelMatrix, modelMatrix, 90.0, [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	mPlane.render(programForDeepCube);
	gl.useProgram(null);

	//front

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,15.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-180.0), [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForDeepCube);
	gl.useProgram(null);

	// right
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForDeepCube);
	gl.useProgram(null);

	// left
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-10.0,0.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,5.0,5.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForDeepCube);
	gl.useProgram(null);

	// bottom
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForDeepCube);
	gl.useProgram(null);

	//top
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,5.0,5.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[10.0,10.0,5.0]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mPlane.render(programForDeepCube);
	gl.useProgram(null);

	gl.enable(gl.CULL_FACE);
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-4.8,0.5]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mBed.render(programForDeepCube);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-2.8,-2.8]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix,modelMatrix, glMatrix.toRadian(-90.0), [0.0, 0.0, 1.0]);
	//mat4.multiply(rotateMatrix_x,rotateMatrix_x,rotateMatrix_y);
	//mat4.multiply(modelMatrix,modelMatrix,rotateMatrix_x);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.15,0.15,0.15]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mcab1.render(programForDeepCube);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-8.0,-1.5,-4.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(180.0), [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.1,0.1,0.1]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mcab2.render(programForDeepCube);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0.0,-1.3,-4.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mFood.render(programForDeepCube);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [-4.0,-1.6,0.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [0.0, 0.0, 1.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mPad.render(programForDeepCube);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [4.0,-0.2,-3.0]);
	mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90.0), [1.0, 0.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.3,0.3,0.3]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mSerum.render(programForDeepCube);
	gl.useProgram(null);

	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [7.0,-3.5,-3.0]);
	mat4.rotate(modelMatrix, modelMatrix,glMatrix.toRadian(-20), [0.0, 1.0, 0.0]);
	//mat4.rotate(modeslMatrix, modelMatrix, 90.0, [1.0, 0.0, 0.0]);
	mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
	gl.useProgram(programForDeepCube);
	gl.uniformMatrix4fv(pMatUnifromForDeepCube, false, perspectiveMatrix)
	gl.uniformMatrix4fv(vMatUnifromForDeepCube, false, viewMatrix)
	gl.uniformMatrix4fv(mMatUnifromForDeepCube, false, modelMatrix)
	gl.uniform3fv(viewPosUnifromForDeepCube, cameraPosition)
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.direction"), [-0.2,-1.0,-0.3]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.ambient"), [0.2,0.2,0.2]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.diffuse"), [1.0,0.0,0.0]);
	gl.uniform3fv(gl.getUniformLocation(programForDeepCube,"light.specular"), [1.0,1.0,1.0]);
	mSofa.render(programForDeepCube);
	gl.useProgram(null);
}

function uninitForDeepCube() {
	deleteProgram(programForDeepCube);
}
