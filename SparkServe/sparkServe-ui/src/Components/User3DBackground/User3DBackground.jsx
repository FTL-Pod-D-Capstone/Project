import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

const User3DBackground = () => {
  const containerRef = useRef();
  const location = useLocation();
  const isMobileS = useMediaQuery('(min-width:320px)');
  const isMobileM = useMediaQuery('(min-width:375px)');
  const isMobileL = useMediaQuery('(min-width:425px)');
  const isTablet = useMediaQuery('(min-width:768px)');
  const isLaptop = useMediaQuery('(min-width:1024px)');
  const isLaptopL = useMediaQuery('(min-width:1440px)');
  const isDesktop = useMediaQuery('(min-width:2560px)');

  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/org') {
      return;
    }

    let scene, camera, renderer, ribbon, animationFrameId;
    const container = containerRef.current;
    let frame = 0;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
      camera.position.z = 2;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x4685f6, 1);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      container.appendChild(renderer.domElement);

      const segmentsX = isLaptop ? 16 : isTablet ? 12 : 8;
      const segmentsY = isLaptop ? 16 : isTablet ? 12 : 8;

      ribbon = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, segmentsX, segmentsY),
        new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 1.0 },
          },
          vertexShader: `
            varying vec3 vEC;
            uniform float time;

            float iqhash(float n) {
              return fract(sin(n) * 43758.5453);
            }

            float noise(vec3 x) {
              vec3 p = floor(x);
              vec3 f = fract(x);
              f = f * f * (3.0 - 2.0 * f);
              float n = p.x + p.y * 57.0 + 113.0 * p.z;
              return mix(mix(mix(iqhash(n), iqhash(n + 1.0), f.x),
                         mix(iqhash(n + 57.0), iqhash(n + 58.0), f.x), f.y),
                         mix(mix(iqhash(n + 113.0), iqhash(n + 114.0), f.x),
                         mix(iqhash(n + 170.0), iqhash(n + 171.0), f.x), f.y), f.z);
            }

            float xmb_noise2(vec3 x) {
              return cos(x.z * 4.0) * cos(x.z + time / 10.0 + x.x);
            }

            void main() {
              vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              vec3 v = vec3(pos.x, 0.0, pos.y);
              vec3 v2 = v;
              vec3 v3 = v;

              v.y = xmb_noise2(v2) / 8.0;

              v3.x -= time / 5.0;
              v3.x /= 4.0;

              v3.z -= time / 10.0;
              v3.y -= time / 100.0;

              v.z -= noise(v3 * 7.0) / 15.0;
              v.y -= noise(v3 * 7.0) / 15.0 + cos(v.x * 2.0 - time / 2.0) / 5.0 - 0.3;

              vEC = v;
              gl_Position = vec4(v, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            varying vec3 vEC;

            void main()
            {
               const vec3 up = vec3(0.0, 0.0, 1.0);
               vec3 x = dFdx(vEC);
               vec3 y = dFdy(vEC);
               vec3 normal = normalize(cross(x, y));
               float c = 1.0 - dot(normal, up);
               c = (1.0 - cos(c * c)) / 3.0;
               gl_FragColor = vec4(1.0, 1.0, 1.0, c * 1.5);
            }
          `,
          extensions: {
            derivatives: true,
          },
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: false,
        })
      );

      scene.add(ribbon);

      const resize = () => {
        const { innerWidth, innerHeight } = window;
        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        
        let scaleX = camera.aspect * 1.55;
        let scaleY = 0.75;
        
        if (isTablet) {
          scaleX *= 1.2;
          scaleY *= 1.2;
        } else if (isLaptop) {
          scaleX *= 1.4;
          scaleY *= 1.4;
        } else if (isLaptopL) {
          scaleX *= 1.6;
          scaleY *= 1.6;
        } else if (isDesktop) {
          scaleX *= 2;
          scaleY *= 2;
        }
        
        ribbon.scale.set(scaleX, scaleY, 1);
      };

      window.addEventListener('resize', resize);
      resize();

      const animate = () => {
        const frameSkip = isLaptop ? 1 : isTablet ? 2 : 3;
        if (frame % frameSkip === 0) {
          ribbon.material.uniforms.time.value += isLaptop ? 0.01 : 0.008;
          renderer.render(scene, camera);
        }
        frame++;
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
        container.removeChild(renderer.domElement);
        renderer.dispose();
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      };
    };

    init();
  }, [location.pathname, isMobileS, isMobileM, isMobileL, isTablet, isLaptop, isLaptopL, isDesktop]);

  if (location.pathname !== '/' && location.pathname !== '/org') {
    return null;
  }

  return <div id="container" ref={containerRef} style={containerStyle} />;
};

const containerStyle = {
  position: 'fixed',
  width: '100%',
  height: '100vh',
  left: '0',
  top: '0',
  background: 'linear-gradient(to bottom, #4685f6, #31524F, #FFFFFF)',
  zIndex: -1,
};

export default User3DBackground;
