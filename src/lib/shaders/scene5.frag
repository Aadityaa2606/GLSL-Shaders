precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

float sdCircle( vec2 p, float r ) {
    return length(p) - r;
}

void main() {
    // S1: Normalize
    vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    float dist = sdCircle(uv, 0.2);

    // Create glow effect by dividing by distance
    float glow = 0.02 / abs(dist);
    
    // Optional: add a solid circle in the center
    // float circle = smoothstep(0.21, 0.2, length(uv));
    
    // Combine glow and circle
    vec3 col = vec3(0.0);
    col += vec3(0.3, 0.6, 1.0) * glow; // Blue glow color
    // col += vec3(1, 1, 1) * circle; // White center
    
    gl_FragColor = vec4(col, 1.0);
}