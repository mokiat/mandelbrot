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

/**
 * A task that performs a rendering of a given
 * section of the Mandelbrot Set.
 */
simulation.RenderTask = oop.class({
    
    __create__: function(mandelbrotRenderer) {
        this.mandelbrotRenderer = mandelbrotRenderer;
        this.viewPort = null;
        this.clipArea = null;
        this.prepClipArea = null;
    },
    getMandelbrotRenderer: function() {
        return this.mandelbrotRenderer;
    },
    setViewPort: function(viewPort) {
        this.viewPort = viewPort;
    },
    getViewPort: function() {
        return this.viewPort;
    },
    setClipArea: function(clipArea) {
        this.clipArea = clipArea;
    },
    getClipArea: function() {
        return this.clipArea;
    },
    setPreparationClipArea: function(prepClipArea) {
        this.prepClipArea = prepClipArea;
    },
    getPreparationClipArea: function() {
        return this.prepClipArea;
    },
    execute: function() {
        if (this.clipArea && this.viewPort) {
            this.mandelbrotRenderer.renderArea(this.clipArea, this.viewPort);
        }
        if (this.prepClipArea) {
            this.mandelbrotRenderer.prepareArea(this.prepClipArea);
        }
        this.mandelbrotRenderer.renderToSurface();
    }
    
});

/**
 * Represents the whole Mandelbrot Set
 * rendering screne.
 */
simulation.IScene = oop.interface({
    
    /**
     * Rerenders the scene using the
     * specified camera.
     */
    update: function(camera){}
    
});

/**
 * Default implementation of the IScene interface.
 */
simulation.Scene = oop.class({
    
    __create__: function(mandelbrotRenderer, taskRunner) {
        this.mandelbrotRenderer = mandelbrotRenderer;
        this.taskRunner = taskRunner;
    },
    
    update: function(camera) {
        this.taskRunner.cancel();

        var cameraClipStartX = camera.getClipArea().getX();
        var cameraClipEndX = cameraClipStartX + camera.getClipArea().getWidth();
        var cameraClipStartY = camera.getClipArea().getY();
        var cameraClipEndY = cameraClipStartY + camera.getClipArea().getHeight();

        var windowWidth = this.getClipAreaWidthFromDepth(camera.getZoomDepth());
        var windowHeight = this.getClipAreaHeightFromDepth(camera.getZoomDepth());

        var oldRenderTask = null;
        
        var windowY = cameraClipStartY;
        while (windowY < cameraClipEndY) {
            var windowX = cameraClipStartX;
            while (windowX < cameraClipEndX) {
                var renderTask = this.createRenderTask();
                this.configureTaskPreparationArea(camera, renderTask, windowX, windowY, windowWidth, windowHeight);
                this.configureTaskRenderArea(camera, renderTask, oldRenderTask);
                this.taskRunner.queue(renderTask);
                oldRenderTask = renderTask;
                windowX += windowWidth;
            }
            windowY += windowHeight;
        }
        if (oldRenderTask) {
            var renderTask = this.createRenderTask();
            this.configureTaskRenderArea(camera, renderTask, oldRenderTask);
            this.taskRunner.queue(renderTask);
        }
        
    },
    
    createRenderTask: function() {
        return new simulation.RenderTask(this.mandelbrotRenderer);
    },
    
    configureTaskPreparationArea: function(camera, renderTask, windowX, windowY, windowWidth, windowHeight) {
        if (windowX + windowWidth > camera.getClipArea().getX() + camera.getClipArea().getWidth()) {
            windowWidth = camera.getClipArea().getX() + camera.getClipArea().getWidth() - windowX;
        }
        if (windowY + windowHeight > camera.getClipArea().getY() + camera.getClipArea().getHeight()) {
            windowHeight = camera.getClipArea().getY() + camera.getClipArea().getHeight() - windowY;
        }
        var clipArea = new graphics.ClipArea(windowX, windowY, windowWidth, windowHeight);
        renderTask.setPreparationClipArea(clipArea);        
    },
    
    configureTaskRenderArea: function(camera, renderTask, oldRenderTask) {
        if (!oldRenderTask) {
            return;
        }
        var clipArea = oldRenderTask.getPreparationClipArea();
        renderTask.setClipArea(clipArea);
        var viewPort = camera.getSubViewPortFromSubClipArea(clipArea);
        renderTask.setViewPort(viewPort);        
    },
    
    getClipAreaWidthFromDepth: function(depth) {
        if (depth < 2) {
            return 400;
        } else if (depth < 18) {
            return 100;
        } else {
            return 50;
        } 
    },

    getClipAreaHeightFromDepth: function(depth) {
        if (depth < 2) {
            return 300;
        } else if (depth < 18) {
            return 100;
        } else {
            return 50;
        }
    }
    
});