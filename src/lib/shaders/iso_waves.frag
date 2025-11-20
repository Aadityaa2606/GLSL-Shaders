precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uBlobSize;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.989, 78.233))) * 43758.545);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // bg color
    vec3 bgColor = vec3(0.97, 0.97, 0.97);
    vec3 color = bgColor;

    // spawn points
    const int numBlobs = 4;
    vec2 spawnPoints[4];
    spawnPoints[0] = vec2(-0.6, 0.4);
    spawnPoints[1] = vec2(0.7, 0.3);
    spawnPoints[2] = vec2(-0.3, -0.5);
    spawnPoints[3] = vec2(0.5, -0.4);

    // Accumulate distance field from all blobs
    float totalField = 0.0;

    for(int i = 0; i < numBlobs; i++) {
        vec2 center = spawnPoints[i];
        vec2 toCenter = uv - center;
        float angle = atan(toCenter.y, toCenter.x);
        float distortion = fbm(vec2(angle * 2.0, uTime * 0.18 + float(i) * 5.0)) * 0.05;
        float dist = length(toCenter) + distortion;

        // keep small scaling factor for consistent spacing
        totalField += sin(dist * 3.0 + uTime * 0.3); 
    }

    // Create iso-lines
    float isoPattern = fract(totalField * 2.5);

    // Draw lines at specific iso-values
    float lineWidth = 0.05;
    float line = smoothstep(0.02, 0.03, isoPattern) - smoothstep(0.03, 0.04, isoPattern);

    // Color based on field strength
    vec3 lineColor = vec3(0.1, 0.1, 0.1);
    
    vec3 fillColor = bgColor;
    color = mix(fillColor, lineColor, line);


    gl_FragColor = vec4(color, 1.0);
}