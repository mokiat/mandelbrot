oop.namespace("simulation");

/**
 * Represents a camera that determines
 * what is going to be rendered on the screen.
 */
simulation.ICamera = oop.interface({
    /**
     * Sets the maximum level of zooms that
     * are allowed.
     */
    setMaxZoomDepth: function(value) {},
    /**
     * Returns the maximum level of zooms that
     * are allowed.
     */
    getMaxZoomDepth: function() {},
    /**
     * Returns the current zoom level.
     */
    getZoomDepth: function() {},
    /**
     * Returns the ViewPort that is being
     * viewed by this camera.
     */
    getViewPort: function() {},
    /**
     * Returns the ClipArea that is being handled
     * by this camera.
     */
    getClipArea: function() {},
    /**
     * Converts a ClipArea X coordinate into
     * a ViewPort X coordinate.
     */
    getViewPortXFromClipAreaX: function(clipX) {},
    /**
     * Converts a ClipArea Y coordinate into
     * a ViewPort Y coordinate.
     */
    getViewPortYFromClipAreaY: function(clipY) {},
    /**
     * Converts a sub ClipArea into its matching
     * sub ViewPort.
     */
    getSubViewPortFromSubClipArea: function(subClipArea) {},
    /**
     * Zooms in the camera onto the specified
     * ViewPort coordinates. (x4 zoom is performed)
     * 
     */
    zoomInOn: function(x, y) {},
    /**
     * Zooms out the camera to the specified
     * ViewPort coordinates. (x4 zoom is performed)
     */
    zoomOutTo: function(x, y) {}
});

/**
 * Default implementation of the ICamera interface.
 */
simulation.Camera = oop.class({
    
    __create__: function(viewPort, clipArea) {
        this.viewPort = viewPort;
        this.clipArea = clipArea;
        this.zoomDepth = 1;
        this.maxZoomDepth = 20;
    },
    setMaxZoomDepth: function(value) {
        this.maxZoomDepth = value;
    },
    getMaxZoomDepth: function() {
        return this.maxZoomDepth;
    },
    getZoomDepth: function() {
        return this.zoomDepth;
    },
    getViewPort: function() {
        return this.viewPort;
    },
    getClipArea: function() {
        return this.clipArea;
    },
    getViewPortXFromClipAreaX: function(clipX) {
        var ratio = (clipX - this.clipArea.getX()) / this.clipArea.getWidth();
        return this.viewPort.getLeft() + this.viewPort.getWidth() * ratio;
    },
    getViewPortYFromClipAreaY: function(clipY) {
        var ratio = (clipY - this.clipArea.getY()) / this.clipArea.getHeight();
        return this.viewPort.getTop() + this.viewPort.getHeight() * ratio;
    },
    getSubViewPortFromSubClipArea: function(subClipArea) {
        var result = new graphics.ViewPort();
        result.setLeft(this.getViewPortXFromClipAreaX(subClipArea.getX()));
        result.setRight(this.getViewPortXFromClipAreaX(subClipArea.getX() + subClipArea.getWidth()));
        result.setTop(this.getViewPortYFromClipAreaY(subClipArea.getY()));
        result.setBottom(this.getViewPortYFromClipAreaY(subClipArea.getY() + subClipArea.getHeight()));
        return result;
    },
    zoomInOn: function(x, y) {
        this.viewPort.centerAt(x, y);
        if (this.zoomDepth < this.maxZoomDepth) {
            this.zoomDepth++;
            this.scaleAboutCenter(0.25);
        }
    },
    zoomOutTo: function(x, y) {
        this.viewPort.centerAt(x, y);
        if (this.zoomDepth > 1) {
            this.zoomDepth--;
            this.scaleAboutCenter(4.0);
        }
    },
    scaleAboutCenter: function(amount) {
        this.viewPort.setWidth(this.viewPort.getWidth() * amount);
        this.viewPort.setHeight(this.viewPort.getHeight() * amount);        
    }
    
});