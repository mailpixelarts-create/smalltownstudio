// Film Grain Shader
// GLSL fragment shader for cinematic film grain effect

uniform float uTime;
uniform float uIntensity;
uniform vec2 uResolution;

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 st = vUv;
    
    // Base noise
    float noise = random(st + uTime * 0.01);
    
    // Film grain pattern
    float grain = noise * uIntensity;
    
    // Vary grain size
    float grainSize = 1.5;
    float bigGrain = random(floor(st * uResolution / grainSize) + uTime * 0.1);
    grain = mix(grain, bigGrain * uIntensity * 0.5, 0.3);
    
    // Output
    gl_FragColor = vec4(vec3(grain), grain * 0.15);
}
