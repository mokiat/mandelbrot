oop.namespace("graphics");

graphics.ViewPort = oop.class({
    __create__: function(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    },
    getLeft: function() {
        return this.left;
    },
    getTop: function() {
        return this.top;
    },
    getRight: function() {
        return this.right;
    },
    getBottom: function() {
        return this.bottom;
    },
    getWidth: function() {
        return this.right - this.left;
    },
    getHeight: function() {
        return this.bottom - this.top;
    },
    scale: function(amount) {
        var centerX = (this.left + this.right) / 2.0;
        var centerY = (this.top + this.bottom) / 2.0;
        var newWidth = this.getWidth() * amount;
        var newHeight = this.getHeight() * amount;
        this.left = centerX - newWidth / 2.0;
        this.right = centerX + newWidth / 2.0;
        this.top = centerY - newHeight / 2.0;
        this.bottom = centerY + newHeight / 2.0;
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
