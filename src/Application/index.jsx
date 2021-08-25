import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import Visualization, { ZOOM_MODES } from '../Visualization';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Application = ({
  classes,
  pointerX,
  pointerY,
  pixelsPerUnit,
  onViewportChange,
}) => {
  const [zoomMode, setZoomMode] = useState(ZOOM_MODES.ZOOM_IN);

  const onVisualizationClick = (x, y) => {
    switch (zoomMode) {
      case ZOOM_MODES.ZOOM_IN:
        onViewportChange(x, y, pixelsPerUnit * 2);
        break;
      case ZOOM_MODES.ZOOM_OUT:
        onViewportChange(x, y, pixelsPerUnit / 2);
        break;
      default:
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            Mandelbrot Set
          </Typography>
          <Link
            color="inherit"
            href="http://github.com/mokiat/mandelbrot"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </Link>
        </Toolbar>
      </AppBar>
      <Container className={classes.container} maxWidth="md">
        <Paper className={classes.paper} elevation={4}>
          <Visualization
            className={clsx(
              classes.visualization,
              zoomMode === ZOOM_MODES.ZOOM_IN && 'zoomIn',
              zoomMode === ZOOM_MODES.ZOOM_OUT && 'zoomOut'
            )}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            pointerX={pointerX}
            pointerY={pointerY}
            pixelsPerUnit={pixelsPerUnit}
            onClick={onVisualizationClick}
          />
          <div className={classes.overlay}>
            <ToggleButtonGroup
              className={classes.buttonGroup}
              aria-label="zoom mode"
              size="small"
              value={zoomMode}
              exclusive
              onChange={(event, newZoomMode) => {
                newZoomMode && setZoomMode(newZoomMode);
              }}
            >
              <ToggleButton
                value={ZOOM_MODES.ZOOM_IN}
                selected={zoomMode === ZOOM_MODES.ZOOM_IN}
                aria-label="zoom in"
              >
                <ZoomInIcon />
              </ToggleButton>
              <ToggleButton
                value={ZOOM_MODES.ZOOM_OUT}
                selected={zoomMode === ZOOM_MODES.ZOOM_OUT}
                aria-label="zoom out"
              >
                <ZoomOutIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Paper>
      </Container>
    </>
  );
};

Application.propTypes = {
  pointerX: PropTypes.number.isRequired,
  pointerY: PropTypes.number.isRequired,
  pixelsPerUnit: PropTypes.number.isRequired,
  onViewportChange: PropTypes.func,
};

Application.defaultProps = {
  onViewportChange: () => {},
};

export default withStyles({
  toolbar: {
    backgroundColor: 'white',
    color: 'black',
  },
  title: {
    flexGrow: 1,
  },
  container: {
    textAlign: 'center',
  },
  paper: {
    position: 'relative',
    margin: '10px auto',
    padding: '10px',
  },
  visualization: {
    width: '100%',
    height: 'auto',
    '&.zoomIn': {
      cursor: 'zoom-in',
    },
    '&.zoomOut': {
      cursor: 'zoom-out',
    },
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
  },
  buttonGroup: {
    backgroundColor: 'white',
  },
})(Application);
