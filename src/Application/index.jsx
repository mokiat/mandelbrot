import React, { useState } from 'react';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import Visualization, { ZOOM_MODES } from '../Visualization';

const Application = ({ classes }) => {
  const [zoomMode, setZoomMode] = useState(ZOOM_MODES.ZOOM_IN);
  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            Mandelbrot Set
          </Typography>
          <Button color="inherit">Source Code</Button>
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
            width={800}
            height={600}
            x={-1.0}
            y={0.0}
            pixelsPerUnit={200}
          />
        </Paper>
        <Paper className={classes.paper} elevation={4}>
          <Typography>
            Select what happens when you click on the visualization:
          </Typography>
          <ToggleButtonGroup
            value={zoomMode}
            exclusive
            onChange={(event, newZoomMode) => setZoomMode(newZoomMode)}
            aria-label="visualization zoom mode"
          >
            <ToggleButton
              value={ZOOM_MODES.ZOOM_IN}
              aria-label="zoom in"
              size="small"
            >
              <ZoomInIcon />
              <Typography>Zoom In</Typography>
            </ToggleButton>
            <ToggleButton
              value={ZOOM_MODES.ZOOM_OUT}
              aria-label="zoom out"
              size="small"
            >
              <ZoomOutIcon />
              <Typography>Zoom Out</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Container>
    </>
  );
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
  },
})(Application);
