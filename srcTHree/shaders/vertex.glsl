uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv; // Pass UV to fragment shader
    vPosition = position; // Pass position if needed

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}