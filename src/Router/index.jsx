import React from 'react';
import { BrowserRouter, useLocation, useHistory } from 'react-router-dom';

import Application from '../Application';

const useFragment = () => {
  return new URLSearchParams(useLocation().hash.substring(1));
};

const ApplicationWrapper = () => {
  const history = useHistory();
  const fragment = useFragment();

  const x = Number(fragment.get('x') || '-0.5');
  const y = Number(fragment.get('y') || '0');
  const ppu = Number(fragment.get('ppu') || '200');

  return (
    <Application
      pointerX={x}
      pointerY={y}
      pixelsPerUnit={ppu}
      onViewportChange={(newX, newY, newPPU) => {
        const encX = encodeURIComponent(newX);
        const encY = encodeURIComponent(newY);
        const encPPU = encodeURIComponent(newPPU);
        history.push(`/#x=${encX}&y=${encY}&ppu=${encPPU}`);
      }}
    />
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <ApplicationWrapper />
    </BrowserRouter>
  );
};

export default Router;
