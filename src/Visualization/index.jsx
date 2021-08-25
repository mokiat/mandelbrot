import React from 'react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import Surface from './Graphics/Surface';
import Renderer from './Mandelbrot/Renderer';
import { useMemo } from 'react';

export const ZOOM_MODES = Object.freeze({
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
});

const Visualization = ({
  className,
  width,
  height,
  pointerX,
  pointerY,
  pixelsPerUnit,
  onClick,
}) => {
  const canvasRef = useRef(null);
  const [surface, setSurface] = useState(null);

  const unitWidth = width / pixelsPerUnit;
  const unitHeight = height / pixelsPerUnit;

  const viewport = useMemo(
    () => ({
      left: pointerX - unitWidth / 2,
      top: pointerY - unitHeight / 2,
      width: unitWidth,
      height: unitHeight,
    }),
    [pointerX, pointerY, unitWidth, unitHeight]
  );

  useEffect(() => {
    setSurface(new Surface(canvasRef.current));
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
        viewport
      );
      renderer.prepareArea({
        x: 100,
        y: 100,
        width: 20,
        height: 30,
      });

      surface.swapBuffers();
    }
  }, [surface, viewport, pixelsPerUnit]);

  const onMouseDown = (e) => {
    const area = e.target.getBoundingClientRect();
    const x = (e.clientX - area.left) / (area.right - area.left);
    const y = (e.clientY - area.top) / (area.bottom - area.top);

    onClick(
      viewport.left + x * viewport.width,
      viewport.top + y * viewport.height
    );
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={width}
      height={height}
      style={{ backgroundColor: 'black' }}
      onMouseDown={onMouseDown}
    />
  );
};

Visualization.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pointerX: PropTypes.number.isRequired,
  pointerY: PropTypes.number.isRequired,
  pixelsPerUnit: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

Visualization.defaultProps = {
  onClick: () => {},
};

export default Visualization;
