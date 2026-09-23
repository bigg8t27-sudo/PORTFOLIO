import { useRef, useEffect } from "react";

export interface LightningProps {
  hue?: number; xOffset?: number; speed?: number;
  intensity?: number; size?: number; style?: React.CSSProperties;
}

export const Lightning: React.FC<LightningProps> = ({
  hue = 195, xOffset = 0, speed = 0.6, intensity = 1, size = 1, style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  useEffect(() => { intensityRef.current = intensity; }, [intensity]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;
    const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);} };
    resize(); window.addEventListener("resize", resize);
    const vert = `attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
    const frag = `precision mediump float; uniform vec2 iResolution; uniform float iTime,uHue,uXOffset,uSpeed,uIntensity,uSize; #define OC 10
      vec3 h2r(vec3 c){vec3 r=clamp(abs(mod(c.x*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);return c.z*mix(vec3(1),r,c.y);}
      float h1(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
      float h2(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
      mat2 r2(float t){float c=cos(t),s=sin(t);return mat2(c,-s,s,c);}
      float ns(vec2 p){vec2 i=floor(p),f=fract(p);float a=h2(i),b=h2(i+vec2(1,0)),c=h2(i+vec2(0,1)),d=h2(i+vec2(1,1));vec2 t=smoothstep(0.0,1.0,f);return mix(mix(a,b,t.x),mix(c,d,t.x),t.y);}
      float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<OC;i++){v+=a*ns(p);p*=r2(0.45);p*=2.0;a*=0.5;}return v;}
      void main(){vec2 uv=gl_FragCoord.xy/iResolution.xy;uv=2.0*uv-1.0;uv.x*=iResolution.x/iResolution.y;uv.x+=uXOffset;
        float t=iTime*uSpeed; uv+=2.0*fbm(uv*uSize+0.8*t)-1.0;
        float d=abs(uv.x); vec3 base=h2r(vec3(uHue/360.0,0.7,0.8));
        float fl=mix(0.0,0.07,h1(t)); vec3 col=base*(fl/max(d,0.001))*uIntensity;
        col=pow(col,vec3(1.1)); gl_FragColor=vec4(col,1.0);}`;
    const comp = (src: string, type: number) => { const s=gl.createShader(type)!; gl.shaderSource(s,src); gl.compileShader(s); return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null; };
    const vs=comp(vert,gl.VERTEX_SHADER), fs=comp(frag,gl.FRAGMENT_SHADER);
    if(!vs||!fs) return;
    const prog=gl.createProgram()!; gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const ap=gl.getAttribLocation(prog,"aPosition"); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
    const u={res:gl.getUniformLocation(prog,"iResolution"),time:gl.getUniformLocation(prog,"iTime"),hue:gl.getUniformLocation(prog,"uHue"),xo:gl.getUniformLocation(prog,"uXOffset"),sp:gl.getUniformLocation(prog,"uSpeed"),int:gl.getUniformLocation(prog,"uIntensity"),sz:gl.getUniformLocation(prog,"uSize")};
    const t0=performance.now(); let rid: number;
    const render=()=>{ resize(); gl.uniform2f(u.res,canvas.width,canvas.height); gl.uniform1f(u.time,(performance.now()-t0)/1000); gl.uniform1f(u.hue,hue); gl.uniform1f(u.xo,xOffset); gl.uniform1f(u.sp,speed); gl.uniform1f(u.int,intensityRef.current); gl.uniform1f(u.sz,size); gl.drawArrays(gl.TRIANGLES,0,6); rid=requestAnimationFrame(render); };
    rid=requestAnimationFrame(render);
    return ()=>{ window.removeEventListener("resize",resize); cancelAnimationFrame(rid); };
  }, [hue, xOffset, speed, size]);

  return <canvas ref={canvasRef} style={{display:"block",width:"100%",height:"100%",...style}} />;
};
export default Lightning;