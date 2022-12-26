#version 300 es

precision highp float;

uniform vec3 iResolution;
uniform float iTime;

out vec4 FragColor;

void main(void)
{
    float time = iTime;
	float mx = max(iResolution.x, iResolution.y);
	vec2 scrs = iResolution.xy/mx;
	vec2 uv = gl_FragCoord.xy/mx;
    
    float f = 150.0; // Frequency of the sinus function

	vec3 heartBeat = vec3( 1.0 - smoothstep( 0.0,0.01,distance(uv,
                           vec2(uv.x,((sin((uv.x-scrs.x/2.0)*f)/((uv.x-scrs.x/1.5)*5.0*f)) + sin(uv.x*f)/10.0) * // sin(f*x)/(5*f*x) + sin(f*x)/7   
                                clamp((1.0-abs((uv.x-scrs.x/2.0)*10.0)),0.0,1.0) + // keep only the middle of the function
                                scrs.y/2.0) // set to the middle of the screen
                            )));

	float persist = 1.0; // Persistance of the light
	float speed = 0.3; // Speed of the light


	vec3 light = vec3( smoothstep(0.0,1.0,distance(0.0, clamp((uv.x + persist - fract(time*speed)*(1.0+persist))/persist,0.0,1.0) )) *
		               (1.0-step(1.0,distance(0.0 ,(uv.x+persist - fract(time*speed)*(1.0+persist))/persist))) 
                      );

	vec3 scanlignes = vec3( sin(gl_FragCoord.y+time)*2.0 + sin((gl_FragCoord.y/iResolution.y)*25.0+time));
    
    vec3 color = vec3(0.5,1.0,0.5);
    

	FragColor = vec4((heartBeat * light + scanlignes*0.1) * color  ,1.0);
	//FragColor = vec4(color  ,1.0);
}
