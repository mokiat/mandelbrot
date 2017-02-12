(function(ns, undefined) {

  ns.ComplexNumber = class ComplexNumber {
    constructor(real, imaginary) {
      if (real !== undefined) {
          this.real = real;
      } else {
          this.real = 0.0;
      }
      if (imaginary !== undefined) {
          this.imaginary = imaginary;
      } else {
          this.imaginary = 0.0;
      }
    }

    setTo(other) {
      this.real = other.getReal();
      this.imaginary = other.getImaginary();
    }

    setReal(value) {
      this.real = value;
    }

    getReal() {
      return this.real;
    }

    setImaginary(value) {
      this.imaginary = value;
    }

    getImaginary() {
      return this.imaginary;
    }

    getLengthSquared() {
      return this.real * this.real + this.imaginary * this.imaginary;
    }

    inc(other) {
      this.real += other.getReal();
      this.imaginary += other.getImaginary();
    }

    dec(other) {
      this.real -= other.getReal();
      this.imaginary -= other.getImaginary();
    }

    square() {
      let newReal = this.real * this.real - this.imaginary * this.imaginary;
      let newImaginary = 2.0 * this.real * this.imaginary;
      this.real = newReal;
      this.imaginary = newImaginary;
    }
  };


  ns.Evaluator = class Evaluator {
    constructor(iterations) {
      this.iterations = iterations;
      this.evaluation = new ns.ComplexNumber();
    }

    getEscapeIteration(complexNumber) {
      this.evaluation.setTo(complexNumber);
      for (let i = 0; i < this.iterations; ++i) {
          if (this.evaluation.getLengthSquared() >= 4.0) {
              return i;
          }
          this.evaluation.square();
          this.evaluation.inc(complexNumber);
      }
      return -1;
    }
  };


  ns.ColorProvider = class ColorProvider {
    constructor(iterations) {
      this.colors = [];
      this.colors.push(graphics.getIntFromRGB(0.0, 0.0, 0.0));
      for (let i = 0; i < iterations; ++i) {
          this.colors.push(this.createColor(i));
      }
    }

    createColor(iteration) {
      let colorAmount = 1.0 - 30.0 / (30.0 + iteration);
      let threshold = 1.0 - 250.0 / (250.0 + iteration);
      let gradient = (0.5 + 0.5 * Math.sin(threshold * 10.0 * Math.PI / 2.0)) * colorAmount;
      return graphics.getIntFromRGB(gradient, gradient, 0.3 + gradient * 0.7);
    }

    getColorForEscapedIteration(iteration) {
      return this.colors[iteration + 1];
    }
  };


  ns.Renderer = class Renderer {
    constructor(surface, evaluator, colorProvider) {
      this.surface = surface;
      this.evaluator = evaluator;
      this.colorProvider = colorProvider;

      this.prepareColor = graphics.getIntFromRGB(1.0, 1.0, 1.0);
      this.complexNumber = new ns.ComplexNumber();
    }

    prepareArea(clipArea) {
      let endX = clipArea.getX() + clipArea.getWidth();
      let endY = clipArea.getY() + clipArea.getHeight();

      for (let y = clipArea.getY(); y < endY; ++y) {
          for (let x = clipArea.getX(); x < endX; ++x) {
              this.surface.putPixel(x, y, this.prepareColor);
          }
      }
    }

    renderArea(clipArea, viewPort) {
      let endX = clipArea.getX() + clipArea.getWidth();
      let endY = clipArea.getY() + clipArea.getHeight();

      let horizontalStep = viewPort.getWidth() / (clipArea.getWidth() - 1);
      let verticalStep = viewPort.getHeight() / (clipArea.getHeight() - 1);

      this.complexNumber.setImaginary(viewPort.getTop());
      for (let y = clipArea.getY(); y < endY; ++y) {
          this.complexNumber.setReal(viewPort.getLeft());
          for (let x = clipArea.getX(); x < endX; ++x) {
              let iteration = this.evaluator.getEscapeIteration(this.complexNumber);
              let color = this.colorProvider.getColorForEscapedIteration(iteration);
              this.surface.putPixel(x, y, color);
              this.complexNumber.setReal(this.complexNumber.getReal() + horizontalStep);
          }
          this.complexNumber.setImaginary(this.complexNumber.getImaginary() + verticalStep);
      }
    }

    renderToSurface() {
      this.surface.swapBuffers();
    }
  };


})(window.mandelbrot = window.mandelbrot || {});
