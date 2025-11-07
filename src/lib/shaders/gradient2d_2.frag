precision mediump float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;

vec3 palette(float t) {
    return vec3(0.5) + vec3(0.5) * cos(6.28318 * (t + vec3(0.263, 0.416, 0.557)));
}

void main() {
    vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        finalColor += palette(length(uv0) + i * 0.4 + uTime * 0.4) * pow(0.01 / abs(sin(d * 8.0 + uTime) / 8.0), 1.2);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}