// Input: vertex position from JavaScript (-1 to 1)
attribute vec2 position;

// Output: pass UV coordinates to fragment shader (0 to 1)
varying vec2 vUv;

void main() {
    // Convert position from -1→1 range to 0→1 range for UV coordinates
    vUv = position * 0.5 + 0.5;
    
    // Set the vertex position (required)
    gl_Position = vec4(position, 0.0, 1.0);
}