#version 300 es 
precision highp float;

layout(location = 0)out vec4 FragColor;

in vec3 fragPos;
in vec3 normal;
in vec2 texCoords;

uniform sampler2D diffuse;
uniform samplerCube depthMap;

uniform vec3 lightPos;
uniform vec3 viewPos;
uniform float farPlane;

vec3 gridSamplingDisk[20] = vec3[] (
	vec3(1, 1,  1), vec3( 1, -1,  1), vec3(-1, -1,  1), vec3(-1, 1,  1), 
	vec3(1, 1, -1), vec3( 1, -1, -1), vec3(-1, -1, -1), vec3(-1, 1, -1),
	vec3(1, 1,  0), vec3( 1, -1,  0), vec3(-1, -1,  0), vec3(-1, 1,  0),
	vec3(1, 0,  1), vec3(-1,  0,  1), vec3( 1,  0, -1), vec3(-1, 0, -1),
	vec3(0, 1,  1), vec3( 0, -1,  1), vec3( 0, -1, -1), vec3( 0, 1, -1)
);

float shadowCalculation(vec3 fragPos) {
	vec3 fragToLight = fragPos - lightPos;
	float currentDepth = length(fragToLight);
	float shadow = 0.0;
	float bias = 0.15;
	float viewDist = length(viewPos - fragPos);
	float diskRadius = (1.0 + (viewDist / farPlane)) / 25.0;
	for(int i = 0; i < 20; i++) {
		float closestDepth = texture(depthMap, fragToLight + gridSamplingDisk[i] * diskRadius).r;
		closestDepth *= farPlane;
		if(currentDepth - bias > closestDepth) {
			shadow += 1.0;
		}
	}
	shadow /= 20.0;
	return shadow;
	// return 0.0;
}

void main(void) {
	vec3 color = texture(diffuse, texCoords).rgb;
	vec3 N = normalize(normal);
	vec3 lightColor = vec3(0.3);
	vec3 ambient = 0.3 * lightColor;
	vec3 lightDir = normalize(lightPos - fragPos);
	vec3 diffuse = lightColor * max(dot(lightDir, N), 0.0);
	vec3 viewDir = normalize(viewPos - fragPos);
	vec3 halfDir = normalize(lightDir + viewDir);
	vec3 reflectDir = reflect(-lightDir, N);
	vec3 specular = pow(max(dot(viewDir, reflectDir), 0.0), 64.0) * lightColor;
	float shadow = shadowCalculation(fragPos);
	vec3 lighting = (ambient + (1.0 - shadow) * (diffuse + specular)) * color;
	FragColor = vec4(lighting, 1.0);
}