import React from 'react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import Surface from './Graphics/Surface';
import Renderer from './Mandelbrot/Renderer';

export const ZOOM_MODES = Object.freeze({
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
});

const Visualization = ({ className, width, height, x, y, pixelsPerUnit }) => {
  const canvasRef = useRef(null);

  const [surface, setSurface] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      setSurface(new Surface(canvasRef.current));
    }
  }, [width, height]);

  useEffect(() => {
    if (surface != null) {
      for (let y = 0; y < surface.getHeight(); y++) {
        for (let x = 0; x < surface.getWidth(); x++) {
          surface.putPixel(x, y, 0xff00ffff);
        }
      }

      const renderer = new Renderer(surface);
      renderer.renderArea(
        {
          x: 0,
          y: 0,
          width: surface.getWidth(),
          height: surface.getHeight(),
        },
        {
          left: -2.5,
          top: -1.5,
          width: 4.0,
          height: 3.0,
        }
      );
      renderer.prepareArea({
        x: 100,
        y: 100,
        width: 20,
        height: 30,
      });

      surface.swapBuffers();
    }
  }, [surface, x, y, pixelsPerUnit]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={width}
      height={height}
      style={{ backgroundColor: 'black' }}
    ></canvas>
  );
};

Visualization.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.object.isRequired,
  y: PropTypes.object.isRequired,
  pixelsPerUnit: PropTypes.object.isRequired,
};

export default Visualization;
