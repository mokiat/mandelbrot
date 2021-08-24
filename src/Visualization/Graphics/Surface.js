export default class Surface {
  constructor(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext('2d');
    this.imageData = this.context.createImageData(this.width, this.height);
    this.pixels = new Uint32Array(this.imageData.data.buffer);
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  putPixel(x, y, color) {
    this.pixels[x + y * this.width] = color;
  }

  swapBuffers() {
    this.context.putImageData(this.imageData, 0, 0);
  }
}
