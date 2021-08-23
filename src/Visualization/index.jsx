import React from 'react';
import PropTypes from 'prop-types';

export const ZOOM_MODES = Object.freeze({
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
});

const Visualization = ({ className, width, height }) => {
  return (
    <canvas
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
};

export default Visualization;
