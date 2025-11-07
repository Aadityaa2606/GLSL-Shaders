uniform float uTime;
uniform vec3 uBorderColor;
uniform float uBorderWidth;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vFresnel;

void main() {
    float borderIntensity = pow(vFresnel, 2.0);
    
    // Create the border color (green by default)
    vec3 borderColor = uBorderColor * borderIntensity;
    
    // Mix with original surface color (white base)
    vec3 baseColor = vec3(0.8, 0.8, 0.8);
    vec3 finalColor = mix(baseColor, borderColor, borderIntensity * uBorderWidth);
    
    gl_FragColor = vec4(finalColor, 1.0);
}