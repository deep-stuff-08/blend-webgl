#version 300 es
precision highp float;

layout (location = 0) out vec4 FragColor;

in vec2 Tex;
in vec3 N;
in vec3 P;

uniform sampler2D video;
struct Light
{
	vec3 position;
	vec3 color;
};

uniform vec3 viewPos;
uniform Light lights[4];

void main(void)
{
	vec3 color = texture(video, Tex).rgb;	
	vec3 normal = normalize(N);

	vec3 ambient = 0.1 * color;

	vec3 lighting = vec3(0.0);

	for(int i = 0; i < 4; i++)
	{
		vec3 lightDir = normalize(vec3(0.0, 0.0, 10.0) - P);
		vec3 result = lights[i].color * max(dot(lightDir,normal),0.0) * color;

		float dist = length(P - lights[i].position);
		result *= 1.0 / (dist * dist);
		lighting += result;
	}
	
	vec3 result = ambient + lighting;
	FragColor = vec4(result,1.0);
}