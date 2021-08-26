import { rgb } from '../Graphics/Color';

import ComplexNumber from './Complex';
import { createPalette } from './Palette';
import { evalEscapeIteration } from './Eval';

const ITERATIONS = 1000;
const PREPARE_COLOR = rgb(1.0, 1.0, 1.0);

export default class Renderer {
  constructor(surface) {
    this.surface = surface;
    this.palette = createPalette(ITERATIONS);
  }

  prepareArea(area) {
    const startX = area.x;
    const startY = area.y;
    const endX = startX + area.width;
    const endY = startY + area.height;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.surface.putPixel(x, y, PREPARE_COLOR);
      }
    }
  }

  renderArea(area, viewport) {
    const startX = area.x;
    const startY = area.y;
    const endX = startX + area.width;
    const endY = startY + area.height;

    const startReal = viewport.left;
    const startImaginary = viewport.top;
    const deltaReal = viewport.width / area.width;
    const deltaImabinary = viewport.height / area.height;

    const complexNumber = new ComplexNumber();

    complexNumber.setImaginary(startImaginary);
    for (let y = startY; y < endY; y++) {
      complexNumber.setReal(startReal);
      for (let x = startX; x < endX; x++) {
        const escapeItration = evalEscapeIteration(complexNumber, ITERATIONS);
        this.surface.putPixel(x, y, this.palette(escapeItration));
        complexNumber.setReal(complexNumber.getReal() + deltaReal);
      }
      complexNumber.setImaginary(complexNumber.getImaginary() + deltaImabinary);
    }
  }

  renderToSurface() {
    this.surface.swapBuffers();
  }
}
