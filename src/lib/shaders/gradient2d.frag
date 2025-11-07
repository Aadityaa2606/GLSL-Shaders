precision mediump float;

// Input from vertex shader (coordinates from 0 to 1)
varying vec2 vUv;

// Uniform for canvas resolution
uniform vec2 uResolution;
// Uniform for time (in seconds)
uniform float uTime;

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    float d = length(uv);

    d = sin(d*8.0 + uTime)/8.0;
    d = smoothstep(0.0, 0.1, abs(d));
    
    gl_FragColor = vec4(d, d, d, 1.0);
}