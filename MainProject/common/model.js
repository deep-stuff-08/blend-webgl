"use strict"
const TextureMacros = {
	Diffuse: 1,
	Specular: 2
};

class dmodel {
	constructor() {
		this.meshArray = []
		this.boneInfoMap = []
		this.boneCounter = 0
		this.animator = []
		this.isInit = false
	}
}

class dmesh {
	constructor(vao, count, diffuseTextures) {
		this.vao = vao
		this.count = count
		this.diffuseTextures = diffuseTextures
	}
}

class dboneinfo {
	constructor(id, offsetMatrix) {
		this.id = id
		this.offsetMatrix = offsetMatrix
	}
}

class dnodedata {
	constructor() {
		this.name = ""
		this.transformation = 0
		this.children = []
	}
}

class danimator {
	constructor(duration, ticksPerSecond, boneInfoMap, rootNode) {
		this.currentTime = 0.0
		this.finalBoneMatrices = []
		for(var i = 0; i < 100; i++) {
			this.finalBoneMatrices.push(mat4.create())
		}
		this.duration = duration
		this.ticksPerSecond = ticksPerSecond
		this.bones = []
		this.boneInfoMap = boneInfoMap
		this.rootNode = rootNode
	}
}

class dkeyposition {
	constructor(translate, timeStamp) {
		this.translate = vec3.create()
		vec3.set(this.translate, translate[0], translate[1], translate[2])
		this.timeStamp = timeStamp
	}
}
class dkeyrotation {
	constructor(rotate, timeStamp) {
		this.rotate = quat.create()
		quat.set(this.rotate, rotate[1], rotate[2], rotate[3], rotate[0])
		quat.normalize(this.rotate, this.rotate)
		this.timeStamp = timeStamp
	}
}
class dkeyscaling {
	constructor(scale, timeStamp) {
		this.scale = vec3.create()
		vec3.set(this.scale, scale[0], scale[1], scale[2])
		this.timeStamp = timeStamp
	}
}
class dbone {
	constructor(id, name, localTransform) {
		this.id = id
		this.name = name
		this.transform = localTransform
		this.positionkeys = []
		this.rotationkeys = []
		this.scalingkeys = []
	}
}

var loadedTexturesForModelLoadingByDeep = {}

function loadMaterial(material, directory, type, flipTexture) {
	var texturesArray = []
	for(var i = 0; i < material.length; i++) {
		if(material[i].key != undefined && material[i].key === "$tex.file" && material[i].semantic === type) {
			var texFile = directory + '/' + material[i].value
			if(loadedTexturesForModelLoadingByDeep[texFile] == undefined) {
				loadedTexturesForModelLoadingByDeep[texFile] = loadTexture(texFile, flipTexture)
			}
			texturesArray.push(loadedTexturesForModelLoadingByDeep[texFile])
		}
	}
	return texturesArray
}

function recursiveTree(model, directory, json, node, isFlipTexture) {
	//Process All Meshes for Current Node
	for(var i = 0; node.meshes != undefined && i < node.meshes.length; i++) {
		var actualmesh = json.meshes[node.meshes[i]];
		
		var VAO, VBO, VBONormal, VBOTexCoord, VBOBone, VBOWeight, EBO;
		VAO = gl.createVertexArray()
		VBO = gl.createBuffer()
		VBONormal = gl.createBuffer()
		VBOTexCoord = gl.createBuffer()
		VBOBone = gl.createBuffer()
		VBOWeight = gl.createBuffer()
		EBO = gl.createBuffer()

		var vertexArray = new Float32Array(actualmesh.vertices)
		var normalArray = new Float32Array(actualmesh.normals)
		var texCoordArray = new Float32Array(actualmesh.texturecoords[0])
		var boneIdsArray = new Int32Array(actualmesh.vertices.length / 3 * 4)
		for(var j = 0; j < boneIdsArray.length; j++) {
			boneIdsArray[j] = -1
		}
		var weightArray = new Float32Array(actualmesh.vertices.length / 3 * 4)

		var faceArray = new Uint16Array(actualmesh.faces.length * 3)
		for(var j = 0; j < actualmesh.faces.length; j++) {
			faceArray [j * 3 + 0] = actualmesh.faces[j][0]
			faceArray [j * 3 + 1] = actualmesh.faces[j][1]
			faceArray [j * 3 + 2] = actualmesh.faces[j][2]
		}

		for (var boneIndex = 0; actualmesh.bones != undefined && boneIndex < actualmesh.bones.length; boneIndex++) {
			var boneID = -1
			var boneName = actualmesh.bones[boneIndex].name
			if (model.boneInfoMap[boneName] == undefined) {
				var offsetmatrix = mat4.create()
				mat4.transpose(offsetmatrix, actualmesh.bones[boneIndex].offsetmatrix)
				var newBoneInfo = new dboneinfo(model.boneCounter, offsetmatrix)
				model.boneInfoMap[boneName] = newBoneInfo
				boneID = model.boneCounter
				model.boneCounter++
			} else {
				boneID = model.boneInfoMap[boneName].id
			}
			var weights = actualmesh.bones[boneIndex].weights
			for(var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
				var vertexId = weights[weightIndex][0]
				var weight = weights[weightIndex][1]
				for(var k = 0; k < 4; ++k) {
					if (boneIdsArray[vertexId * 4 + k] < 0) {
						weightArray[vertexId * 4 + k] = weight;
						boneIdsArray[vertexId * 4 + k] = boneID;
						break;
					}
				}
			}
		}

		gl.bindVertexArray(VAO)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
		gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW)
		gl.enableVertexAttribArray(0)
		gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBONormal)
		gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW)
		gl.enableVertexAttribArray(1)
		gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBOTexCoord)
		gl.bufferData(gl.ARRAY_BUFFER, texCoordArray, gl.STATIC_DRAW)
		gl.enableVertexAttribArray(2)
		gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBOBone)
		gl.bufferData(gl.ARRAY_BUFFER, boneIdsArray, gl.STATIC_DRAW)
		gl.enableVertexAttribArray(3)
		gl.vertexAttribIPointer(3, 4, gl.INT, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBOWeight)
		gl.bufferData(gl.ARRAY_BUFFER, weightArray, gl.STATIC_DRAW)
		gl.enableVertexAttribArray(4)
		gl.vertexAttribPointer(4, 4, gl.FLOAT, gl.FALSE, 0, 0)

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceArray, gl.STATIC_DRAW)

		var diffuseTextures = loadMaterial(json.materials[actualmesh.materialindex].properties, directory, TextureMacros.Diffuse, isFlipTexture)

		model.meshArray.push(new dmesh(VAO, faceArray.length, diffuseTextures))
	}
	//Add Childern To NodeList
	for(var i = 0; node.children != undefined && i < node.children.length; i++) {
		recursiveTree(model, directory, json, node.children[i], isFlipTexture)
	}
}

function setupMesh(modelObj, json, directory, isFlipTexture) {
	recursiveTree(modelObj, directory, json, json.rootnode, isFlipTexture)
}

function readHeirarchyData(dest, src) {
	dest.name = src.name
	var trans = mat4.create()
	mat4.transpose(trans, src.transformation)
	dest.transformation = trans
	for (var i = 0; src.children != undefined && i < src.children.length; i++) {
		var newData = new dnodedata()
		readHeirarchyData(newData, src.children[i])
		dest.children.push(newData)
	}
}

function setupAnimation(modelObj, json) {
	for(var i = 0; json.animations != undefined && i < json.animations.length; i++) {
		var animation = json.animations[i]
		var globalTransform = mat4.create()
		mat4.transpose(globalTransform, json.rootnode.transformation)
		mat4.invert(globalTransform, globalTransform)
		var rootNode = new dnodedata()
		readHeirarchyData(rootNode, json.rootnode);

		var animator = new danimator(animation.duration, animation.tickspersecond, modelObj.boneInfoMap, rootNode)
		for (var j = 0; animation.channels != undefined && j < animation.channels.length; j++) {
			var channel = animation.channels[j]
			var boneName = channel.name

			if (modelObj.boneInfoMap[boneName] == undefined) {
				var off = mat4.create()
				var boneInfo = new dboneinfo(modelObj.boneCounter, off)
				modelObj.boneInfoMap[boneName] = boneInfo
				modelObj.boneCounter++
			}
			var bone = new dbone(modelObj.boneInfoMap[channel.name].id, channel.name, mat4.create())
			for (var positionIndex = 0; channel.positionkeys != undefined && positionIndex < channel.positionkeys.length; ++positionIndex) {
				var key = new dkeyposition(channel.positionkeys[positionIndex][1], channel.positionkeys[positionIndex][0])
				bone.positionkeys.push(key)
			}

			for (var rotationIndex = 0; channel.rotationkeys != undefined && rotationIndex < channel.rotationkeys.length; ++rotationIndex) {
				var key = new dkeyrotation(channel.rotationkeys[rotationIndex][1], channel.rotationkeys[rotationIndex][0])
				bone.rotationkeys.push(key)
			}

			for (var scalingIndex = 0; channel.scalingkeys != undefined && scalingIndex < channel.scalingkeys.length; ++scalingIndex) {
				var key = new dkeyscaling(channel.scalingkeys[scalingIndex][1], channel.scalingkeys[scalingIndex][0])
				bone.scalingkeys.push(key)
			}
			animator.bones.push(bone)
		}
		modelObj.animator.push(animator)
	}
}

function initalizeModel(modelName) {
	var model = modelList.find(o => o.name === modelName)
	if(model === undefined || model.json === undefined) {
		return undefined
	}
	var modelObj = new dmodel()
	setupMesh(modelObj, model.json, model.directory, model.flipTex)
	setupAnimation(modelObj, model.json)
	return modelObj
}

function getScaleFactor(lastTimeStamp, nextTimeStamp, animationTime) {
	var scaleFactor = 0.0
	var midWayLength = animationTime - lastTimeStamp
	var framesDiff = nextTimeStamp - lastTimeStamp
	scaleFactor = midWayLength / framesDiff
	return scaleFactor
}

function calculateBoneTransform(animator, node, parentTransform) {
	if(animator === undefined) {
		return
	}
	
	var nodeName = node.name
	var nodeTransform = node.transformation

	var bone = animator.bones.find(o => o.name === nodeName)
	
	if(bone != undefined) {	
		var translationMat = mat4.create()
		var rotationMat = mat4.create()
		var scalingMat = mat4.create()
		var p0Index = -1;
		var p1Index = -1;

		//Calculate Translation
		if (bone.positionkeys.length === 1) {
			mat4.translate(translationMat, translationMat, bone.positionkeys[0].translate);
		} else {
			for(p0Index = 0; p0Index < bone.positionkeys.length - 1; ++p0Index) {
				if(animator.currentTime < bone.positionkeys[p0Index + 1].timeStamp) {
					break;
				}
			}
			if(p0Index === bone.positionkeys.length - 1) {
				mat4.translate(translationMat, translationMat, bone.positionkeys[p0Index].translate)
			} else {
				p1Index = p0Index + 1
				var t = vec3.create()
				vec3.lerp(t, bone.positionkeys[p0Index].translate, bone.positionkeys[p1Index].translate, getScaleFactor(bone.positionkeys[p0Index].timeStamp, bone.positionkeys[p1Index].timeStamp, animator.currentTime))
				mat4.translate(translationMat, translationMat, t)
			}
		}

		//Calculate Rotation
		if (bone.rotationkeys.length === 1) {
			mat4.fromQuat(rotationMat, bone.rotationkeys[0].rotate)
		} else {
			for(p0Index = 0; p0Index < bone.rotationkeys.length - 1; ++p0Index) {
				if (animator.currentTime < bone.rotationkeys[p0Index + 1].timeStamp) {
					break;
				}
			}
			if(p0Index == bone.rotationkeys.length - 1) {
				mat4.fromQuat(rotationMat, bone.rotationkeys[p0Index].rotate)
			} else {
				p1Index = p0Index + 1
				var r = quat.create()
				quat.slerp(r, bone.rotationkeys[p0Index].rotate, bone.rotationkeys[p1Index].rotate, getScaleFactor(bone.rotationkeys[p0Index].timeStamp, bone.rotationkeys[p1Index].timeStamp, animator.currentTime))
				mat4.fromQuat(rotationMat, bone.rotationkeys[p0Index].rotate)	
				mat4.fromQuat(rotationMat, r)
			}
		}

		//Calculate Scale
		if (bone.scalingkeys.length === 1) {
			mat4.scale(scalingMat, scalingMat, bone.scalingkeys[0].scale)
		} else {
			for(p0Index = 0; p0Index < bone.scalingkeys.length - 1; ++p0Index) {
				if (animator.currentTime < bone.scalingkeys[p0Index + 1].timeStamp) {
					break
				}
			}
			if(p0Index == bone.scalingkeys.length - 1) {
				mat4.scale(scalingMat, scalingMat, bone.scalingkeys[p0Index].scale)
			} else {
				p1Index = p0Index + 1
				var s = vec3.create()
				vec3.lerp(s, bone.scalingkeys[p0Index].scale, bone.scalingkeys[p1Index].scale, getScaleFactor(bone.scalingkeys[p0Index].timeStamp, bone.scalingkeys[p1Index].timeStamp, animator.currentTime))
				mat4.scale(scalingMat, scalingMat, s)
			}
		}
		var tempMat = mat4.create()
		mat4.multiply(tempMat, translationMat, rotationMat)
		mat4.multiply(tempMat, tempMat, scalingMat)
		bone.localTransform = tempMat
		nodeTransform = bone.localTransform
	}
	
	var globalTransformation = mat4.create()
	mat4.multiply(globalTransformation, parentTransform, nodeTransform)
	
	var boneInfoMap = animator.boneInfoMap
	if (boneInfoMap[nodeName] != undefined) {
		var index = boneInfoMap[nodeName].id
		var offset = boneInfoMap[nodeName].offsetMatrix
		mat4.multiply(animator.finalBoneMatrices[index], globalTransformation, offset)
	}

	for (var i = 0; i < node.children.length; i++) {
		calculateBoneTransform(animator, node.children[i], globalTransformation)
	}
}

function getBoneMatrixArray(model, i) {
	if(model === undefined) {
		return []
	}
	if(model.animator != undefined && model.animator.length > i) {
		return model.animator[i].finalBoneMatrices
	} else {
		return []
	}
}

function updateModel(model, i, delta) {
	if(model === undefined) {
		return
	}
	if(model.animator != undefined && model.animator.length > i) {
		model.animator[i].deltaTime = delta
		model.animator[i].currentTime += model.animator[i].ticksPerSecond * delta
		model.animator[i].currentTime = model.animator[i].currentTime % model.animator[i].duration
		calculateBoneTransform(model.animator[i], model.animator[i].rootNode, mat4.create())
	}
}

function renderModel(model) {
	if(model === undefined) {
		return
	}
	for(var i = 0; model.meshArray != undefined && i < model.meshArray.length; i++) {
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, model.meshArray[i].diffuseTextures[0])
		gl.bindVertexArray(model.meshArray[i].vao)
		gl.drawElements(gl.TRIANGLES, model.meshArray[i].count, gl.UNSIGNED_SHORT, 0)
	}
	
}