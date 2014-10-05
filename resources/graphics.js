oop.namespace("graphics");

/**
 * Represents the abstract coordinates
 * of an area that is being rendered to.
 */
graphics.ViewPort = oop.class({
    __create__: function(left, top, right, bottom) {
        if (left) {
            this.left = left;
        } else {
            this.left = 0.0;
        }
        if (top) {
            this.top = top;
        } else {
            this.top = 0.0;
        }
        if (right) {
            this.right = right;
        } else {
            this.right = 0.0;
        }
        if (bottom) {
            this.bottom = bottom;
        } else {
            this.bottom = 0.0;
        }
    },
    setLeft: function(value) {
        this.left = value;
    },
    getLeft: function() {
        return this.left;
    },
    setTop: function(value) {
        this.top = value;
    },
    getTop: function() {
        return this.top;
    },
    setRight: function(value) {
        this.right = value;
    },
    getRight: function() {
        return this.right;
    },
    setBottom: function(value) {
        this.bottom = value;
    },
    getBottom: function() {
        return this.bottom;
    },
    setWidth: function(value) {
        var horizontalCenter = (this.left + this.right) / 2.0;
        this.left = horizontalCenter - value / 2.0;
        this.right = horizontalCenter + value / 2.0;
    },
    getWidth: function() {
        return this.right - this.left;
    },
    setHeight: function(value) {
        var verticalCenter = (this.top + this.bottom) / 2.0;
        this.top = verticalCenter - value / 2.0;
        this.bottom = verticalCenter + value / 2.0;
    },
    getHeight: function() {
        return this.bottom - this.top;
    },
    centerAt: function(x, y) {
        var halfWidth = this.getWidth() / 2.0;
        var halfHeight = this.getHeight() / 2.0;
        this.left = x - halfWidth;
        this.right = x + halfWidth;
        this.top = y - halfHeight;
        this.bottom = y + halfHeight;
    }
});

/**
 * Represents the exact clip area
 * in pixel coordinates to which it is
 * possible to render.
 */
graphics.ClipArea = oop.class({
    __create__: function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    },
    getX: function() {
        return this.x;
    },
    getY: function() {
        return this.y;
    },
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    }
});

graphics.Graphics = oop.class({
    __create__: function(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext("2d");
        this.imageData = this.context.createImageData(this.width, this.height);
    },
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    },
    getAspectRatio: function() {
        if (this.height === 0) {
            return 1.0;
        }
        return this.width / this.height;
    },
    getIntFromRGB: function(r, g, b) {
        return ((r * 255 & 0xFF) << 24) |
                ((g * 255 & 0xFF) << 16) |
                ((b * 255 & 0xFF) << 8) |
                0xFF;        
    },
    putPixel: function(x, y, color) {
        var offset = (x + y * this.width) * 4;
        this.imageData.data[offset++] = (color >> 24) & 0xFF;
        this.imageData.data[offset++] = (color >> 16) & 0xFF;
        this.imageData.data[offset++] = (color >> 8) & 0xFF;
        this.imageData.data[offset++] = (color & 0xFF);
    },
    swapBuffer: function() {
        this.context.putImageData(this.imageData, 0, 0);
    }

});
