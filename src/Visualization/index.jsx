import React from 'react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import Surface from './Graphics/Surface';
import Renderer from './Mandelbrot/Renderer';
import { useMemo } from 'react';
import useAsyncEffect from 'use-async-effect';

export const ZOOM_MODES = Object.freeze({
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
});

const SCAN_AREA_SIZE = 50;

const yieldProcessing = () => {
  return new Promise((resolve) => setImmediate(() => resolve()));
};

const nextArea = (surface, previous) => {
  if (!previous) {
    return {
      x: 0,
      y: 0,
      width: Math.min(SCAN_AREA_SIZE, surface.getWidth()),
      height: Math.min(SCAN_AREA_SIZE, surface.getHeight()),
    };
  }

  let areaX = previous.x + SCAN_AREA_SIZE;
  let areaY = previous.y;
  if (areaX >= surface.getWidth()) {
    areaX = 0;
    areaY += SCAN_AREA_SIZE;
  }
  if (areaY >= surface.getHeight()) {
    return null;
  }
  return {
    x: areaX,
    y: areaY,
    width: Math.min(SCAN_AREA_SIZE, surface.getWidth() - areaX),
    height: Math.min(SCAN_AREA_SIZE, surface.getHeight() - areaY),
  };
};

const calculateClippedViewport = (surface, area, viewport) => {
  return {
    left: viewport.left + viewport.width * (area.x / surface.getWidth()),
    top: viewport.top + viewport.height * (area.y / surface.getHeight()),
    width: viewport.width * (area.width / surface.getWidth()),
    height: viewport.height * (area.height / surface.getHeight()),
  };
};

const prepareArea = (renderer, area) => {
  renderer.prepareArea(area);
};

const renderArea = (renderer, area, viewport) => {
  renderer.renderArea(area, viewport);
};

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

  useAsyncEffect(
    async (isMounted) => {
      if (!surface) {
        return;
      }

      const renderer = new Renderer(surface);

      let area = nextArea(surface, null);
      while (area && isMounted()) {
        const clippedViewport = calculateClippedViewport(
          surface,
          area,
          viewport
        );
        renderArea(renderer, area, clippedViewport);

        area = nextArea(surface, area);
        if (area) {
          prepareArea(renderer, area);
        }

        surface.swapBuffers();

        // Ensure that mouse events get processed.
        await yieldProcessing();
      }
    },
    [surface, viewport]
  );

  const handleClick = (e) => {
    e.preventDefault();

    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.right - rect.left);
    const y = (e.clientY - rect.top) / (rect.bottom - rect.top);

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
      onClick={handleClick}
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
