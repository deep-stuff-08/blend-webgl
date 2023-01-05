#version 300 es

precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D sceneTexture;

out vec4 FragColor;

float rand(vec2 p){
	p+=.2127+p.x+.3713*p.y;
	vec2 r=4.789*sin(789.123*(p));
	return fract(r.x*r.y);
}

float sn(vec2 p){
	vec2 i=floor(p-.5);
	vec2 f=fract(p-.5);
	f = f*f*f*(f*(f*6.0-15.0)+10.0);
	float rt=mix(rand(i),rand(i+vec2(1.,0.)),f.x);
	float rb=mix(rand(i+vec2(0.,1.)),rand(i+vec2(1.,1.)),f.x);
	return mix(rt,rb,f.y);
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy/iResolution.xy;

    vec2 p=uv.xy*vec2(3.0,4.3);
	float f = 0.5*sn(p)+0.25*sn(2.0*p)+0.125*sn(4.0*p)+0.0625*sn(8.0*p)+0.03125*sn(16.0*p)+0.015*sn(32.0*p);

	float newT = iTime*0.4 + sn(vec2(iTime*20.0))*0.1;
	
	p.x-=iTime*0.2;
	p.y*=1.3;

	float f2= 0.5*sn(p)+0.25*sn(2.04*p+newT*1.1)-0.125*sn(4.03*p-iTime*0.3)+0.0625*sn(8.02*p-iTime*0.4)+0.03125*sn(16.01*p+iTime*0.5)+0.018*sn(24.02*p);
	
	float f3=0.5*sn(p)+0.25*sn(2.04*p+newT*1.1)-0.125*sn(4.03*p-iTime*0.3)+0.0625*sn(8.02*p-iTime*0.5)+0.03125*sn(16.01*p+iTime*0.6)+0.019*sn(18.02*p);
	
	float f4 = f2*smoothstep(0.0,1.0,uv.y);

    //
    vec3 clouds = texture(sceneTexture, uv).rgb;

	vec2 newUV = uv;
	newUV.x-=iTime*0.3;
	newUV.y+=iTime*3.0;
	
	float strength = sin(iTime*0.1+sn(newUV))*0.1+0.15;

    float rain = sn( vec2(newUV.x*20.1, newUV.y*40.1+newUV.x*400.1-20.*strength));
	float rain2 = sn( vec2(newUV.x*45.+iTime*0.1, newUV.y*30.1+newUV.x*200.1 ));	
	
	rain = strength-rain;
	
	rain+=smoothstep(0.2,0.5,f4+0.1)*rain;
	
	//rain += pow(length(uv-moonp),1.)*0.1;
	rain+=rain2*(sin(strength)-0.4)*2.;
	rain = clamp(rain, 0.0,0.5)*0.5;

    vec3 painting = (clouds + rain)+clamp(rain*(strength-0.1),0.0,1.0);

	//float r = 1.0-length(max(abs(gl_FragCoord.xy / iResolution.xy * 2.0-1.0)-0.5,0.0)); 
	//painting*=r;

    FragColor = vec4(painting,1.0);
}