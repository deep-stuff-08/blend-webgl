
// material class ??
console.log("in models.js");

class material
{
    constructor(matproperties)
    {
        this.properties = matproperties;
        this.diffuse = [0.8,0.8,0.8,1.0];
        this.specular = [0.8,0.8,0.8,1.0];
        this.ambient = [0.8,0.8,0.8,1.0];
        this.shininess = 32.0;
        this.texID = null;
        setupMaterial();
    }

    setupMaterial()
    {
        for(var i = 0; i < this.properties.length; i++)
        {
            // do something
        }
    }
}

// mesh class
class mesh
{
    constructor(vertices,indices,textures)
    {
        this.vertices = vertices;
        this.indices = indices;
        this.textures = textures;
        this.vao = -1;
        this.vbo = [-1,-1,-1,-1,-1];
        this.ibo = -1;
        this.vertexCount = 0;
        setupMesh();
    }

    setupMesh()
    {
        vao = gl.createVertexArray();
        gl.bindVertexArray(vao_model);

        if(this.indices != undefined)
        {
            this.ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
            this.vertexCount = this.indices.length;
        }
        else{
            this.ibo = 0;
            this.vertexCount = this.vertices[0].length / 3;
        }

        for(var i = 0 ;i < this.vertices.length; i++)
        {
            if(this.vertices[i] != undefined)
            {
                this.vbo[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[i]);
                gl.bufferData(gl.ARRAY_BUFFER, this.vertices[i], gl.STATIC_DRAW);
            }
            else
                this.vbo[i] = -1;
        }

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        //normal
        if(this.vbo[1] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(1);            
        }
        else
            gl.disableVertexAttribArray(1);
        
        //texcoord
        if(this.vbo[2] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
            gl.vertexAttribPointer(2,2,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(2);
        }
        else
            gl.enableVertexAttribArray(2);

        //tangent
        if(this.vbo[3] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[3]);
            gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(3);            
        }
        else
            gl.disableVertexAttribArray(3);
            
        // bitagent
        if(this.vbo[4] != -1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[4]);
            gl.vertexAttribPointer(4,3,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(4);
        }
        else
            gl.enableVertexAttribArray(4);

        gl.bindVertexArray(null);
    }

    render()
    {
        // set textures in future
        // draw 
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo);
        gl.drawElements(gl.TRIANGLES,this.vertexCount,gl.UNSIGNED_SHORT,0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
    }
}
