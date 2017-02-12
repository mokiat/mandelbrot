(function(ns, undefined) {

  ns.getIntFromRGB = function(red, green, blue) {
    return (0xFF << 24) |
            ((blue * 255 & 0xFF) << 16) |
            ((green * 255 & 0xFF) << 8) |
            (red * 255 & 0xFF);
  };

  ns.ViewPort = class ViewPort {
    constructor(left, top, right, bottom) {
      if (left !== undefined) {
          this.left = left;
      } else {
          this.left = 0.0;
      }
      if (top !== undefined) {
          this.top = top;
      } else {
          this.top = 0.0;
      }
      if (right !== undefined) {
          this.right = right;
      } else {
          this.right = 0.0;
      }
      if (bottom !== undefined) {
          this.bottom = bottom;
      } else {
          this.bottom = 0.0;
      }
    }

    setLeft(value) {
      this.left = value;
    }

    getLeft() {
      return this.left;
    }

    setTop(value) {
      this.top = value;
    }

    getTop() {
      return this.top;
    }

    setRight(value) {
      this.right = value;
    }

    getRight() {
      return this.right;
    }

    setBottom(value) {
      this.bottom = value;
    }

    getBottom() {
      return this.bottom;
    }

    setWidth(value) {
      let horizontalCenter = (this.left + this.right) / 2.0;
      this.left = horizontalCenter - value / 2.0;
      this.right = horizontalCenter + value / 2.0;
    }

    getWidth() {
      return this.right - this.left;
    }

    setHeight(value) {
      let verticalCenter = (this.top + this.bottom) / 2.0;
      this.top = verticalCenter - value / 2.0;
      this.bottom = verticalCenter + value / 2.0;
    }

    getHeight() {
      return this.bottom - this.top;
    }

    centerAt(x, y) {
      let halfWidth = this.getWidth() / 2.0;
      this.left = x - halfWidth;
      this.right = x + halfWidth;
      let halfHeight = this.getHeight() / 2.0;
      this.top = y - halfHeight;
      this.bottom = y + halfHeight;
    }
  };

  ns.ClipArea = class ClipArea {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    getWidth() {
      return this.width;
    }

    getHeight() {
      return this.height;
    }
  };

  ns.Surface = class Surface {
    constructor(canvas) {
      this.width = canvas.width;
      this.height = canvas.height;
      this.context = canvas.getContext("2d");
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
      let offset = x + y * this.width;
      this.pixels[offset] = color;
    }

    swapBuffers() {
      this.context.putImageData(this.imageData, 0, 0);
    }

  };

})(window.graphics = window.graphics || {});
