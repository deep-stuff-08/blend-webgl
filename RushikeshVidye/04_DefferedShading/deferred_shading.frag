#version 300 es

precision highp float;

out vec4 FragColor;

in vec2 Tex;

uniform sampler2D gPosition;
uniform sampler2D gNormal;
uniform sampler2D gAlbedoSpec;

struct Light
{
    vec3 position;
    vec3 color;

    float linear;
    float quadratic;
    float radius;
};

const int NR_LIGHTS = 32;
uniform Light lights[NR_LIGHTS];
uniform vec3 viewPos;

void main()
{
    vec3 FragPos = texture(gPosition,Tex).rgb;
    vec3 Normal = texture(gNormal,Tex).rgb;
    vec3 Diffuse = texture(gAlbedoSpec,Tex).rgb;
    float Specular = texture(gAlbedoSpec,Tex).a;

    vec3 lighting = Diffuse * 0.1;
    vec3 viewDir = normalize(viewPos - FragPos);
    for(int i = 0; i < NR_LIGHTS; i++)
    {
        float dist = length(lights[i].position - FragPos);
        if(dist < lights[i].radius)
        {
            vec3 lightDir = normalize(lights[i].position - FragPos);
            vec3 diffuse = max(dot(Normal,lightDir),0.0) * Diffuse * lights[i].color;

            vec3 halfDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(Normal,halfDir),0.0),16.0);
            vec3 specular = lights[i].color * spec * 100.0;

            float attenuation = 1.0 / (1.0 + lights[i].linear * dist + lights[i].quadratic * dist * dist);
            diffuse *= attenuation;
            specular *= attenuation;
            lighting += diffuse + specular;
        }
    }
    FragColor = vec4(lighting,1.0);    
    //FragColor = vec4(1.0);
}
