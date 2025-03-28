import * as THREE from 'three';

export const DotScreenShader: THREE.Shader = {
	name: 'DotScreenShader',

	uniforms: {
		tDiffuse: { value: null as THREE.Texture | null }, // ✅ Typage correct pour la texture
		tSize: { value: new THREE.Vector2(256, 256) },
		center: { value: new THREE.Vector2(0.5, 0.5) },
		angle: { value: 1.57 },
		scale: { value: 1.0 },
	},

	vertexShader: /* glsl */ `
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,

	fragmentShader: /* glsl */ `
		uniform vec2 center;
		uniform float angle;
		uniform float scale;
		uniform vec2 tSize;
		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float random(vec2 p) {
    vec2 k1 = vec2(
        23.14069263277926, // e^pi (Gelfond's constant)
        2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract(
        cos(dot(p, k1)) * 12345.6789
    );
}

		float pattern() {
			float s = sin(angle), c = cos(angle);
			vec2 tex = vUv * tSize - center;
			vec2 point = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y) * scale;
			return (sin(point.x) * sin(point.y)) * 4.0;
		}

		void main() {
			vec4 color = texture2D(tDiffuse, vUv);
			vec2 uvrandom = vUv;
			uvrandom.y *= random(vec2(uvrandom.y, 0.4));
			// color.rgb *= random(uvrandom);

			float average = (color.r + color.g + color.b) / 3.0;
			gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);

			//gl_FragColor = color;
		}
	`,
};