(function() {
    var app = angular.module('home', []);
    
    app.controller('SimulationController', ['$interval', function($interval) {
                                                           
        this.MIN_DEPTH = 1;
        this.MAX_DEPTH = 20;
        this.ITERATIONS = 600;
            
        var canvas = document.getElementById("simulationCanvas");
        this.surface = new graphics.Surface(canvas);
        var colorProvider = new mandelbrot.ColorProvider(this.ITERATIONS);
        var evaluator = new mandelbrot.Evaluator(this.ITERATIONS);
        this.mandelbrotRenderer = new mandelbrot.Renderer(this.surface, evaluator, colorProvider);
        
        this.renderAreas = [];
        this.depth = 1;
        this.currentViewPort = new graphics.ViewPort(-2.5, 1.5, 1.5, -1.5);              
        this.isZoom = true;
        
        this.onCanvasClick = function(event) {
            // Nasty hack because of Firefox
            var x = event.offsetX? event.offsetX : event.clientX-event.target.offsetLeft;
            var y = event.offsetY? event.offsetY : event.clientY-event.target.offsetTop;
            if (this.isZoom) {
                this.zoomIn(x, y);
            } else {
                this.zoomOut(x, y);
            }
        };
        
        this.zoomIn = function(x, y) {
            this.centerAt(x, y);
            if (this.depth < this.MAX_DEPTH) {
                this.depth++;
                this.scale(0.25);
            }
            this.scheduleAreas();
        };
        
        this.zoomOut = function(x, y) {
            this.centerAt(x, y);
            if (this.depth > this.MIN_DEPTH) {
                this.depth--;
                this.scale(4.0);
            }
            this.scheduleAreas();
        };

        this.centerAt = function(x, y) {
            var ratioX = x / this.surface.getWidth();
            var ratioY = y / this.surface.getHeight();
            var centerX = this.currentViewPort.getLeft() + ratioX * this.currentViewPort.getWidth();
            var centerY = this.currentViewPort.getTop() + ratioY * this.currentViewPort.getHeight();
            this.currentViewPort.centerAt(centerX, centerY);
        };
        
        this.scale = function(amount) {
            this.currentViewPort.setWidth(this.currentViewPort.getWidth() * amount);            
            this.currentViewPort.setHeight(this.currentViewPort.getHeight() * amount);            
        };
        
        this.scheduleAreas = function() {
            var clipAreaWidth = this.getClipAreaWidthFromDepth(this.depth);
            var clipAreaHeight = this.getClipAreaHeightFromDepth(this.depth);
            
            var horizontalNumber = this.surface.getWidth() / clipAreaWidth;
            var verticalNumber = this.surface.getHeight() / clipAreaHeight;
            
            this.renderAreas = [];
            for (var y = 0; y < verticalNumber; ++y) {
                for (var x = 0; x < horizontalNumber; ++x) {
                    var clipArea = new graphics.ClipArea(x * clipAreaWidth, y * clipAreaHeight, clipAreaWidth, clipAreaHeight);
                    var viewPort = this.createViewPortFromClipArea(clipArea);
                    this.renderAreas.push({
                        clipArea: clipArea,
                        viewPort: viewPort
                    });
                }
            }
        };
        
        this.getClipAreaWidthFromDepth = function(depth) {
            if (depth < 2) {
                return 400;
            } else if (depth < 18) {
                return 100;
            } else {
                return 50;
            } 
        };
        
        this.getClipAreaHeightFromDepth = function(depth) {
            if (depth < 2) {
                return 300;
            } else if (depth < 18) {
                return 100;
            } else {
                return 60;
            }
        };
        
        this.createViewPortFromClipArea = function(clipArea) {
            var ratioX = clipArea.getX() / this.surface.getWidth();
            var ratioY = clipArea.getY() / this.surface.getHeight();
            var ratioWidth = clipArea.getWidth() / this.surface.getWidth();
            var ratioHeight = clipArea.getHeight() / this.surface.getHeight();
            
            var viewPortLeft = this.currentViewPort.getLeft() + this.currentViewPort.getWidth() * ratioX;
            var viewPortTop = this.currentViewPort.getTop() + this.currentViewPort.getHeight() * ratioY;
            var viewPortWidth = this.currentViewPort.getWidth() * ratioWidth;
            var viewPortHeight = this.currentViewPort.getHeight() * ratioHeight;
            
            return new graphics.ViewPort(viewPortLeft, viewPortTop, viewPortLeft + viewPortWidth, viewPortTop + viewPortHeight);
        };
        
        this.onZoomIn = function() {
            this.isZoom = true;
        };
        
        this.onZoomOut = function() {
            this.isZoom = false;
        };
        
        this.onTimerRender = function() {
            // Render the current area
            if (this.renderAreas.length === 0) {
                return;
            }
            var renderArea = this.renderAreas.shift();
            var clipArea = renderArea.clipArea;
            var viewPort = renderArea.viewPort;
            this.mandelbrotRenderer.renderArea(clipArea, viewPort);
            
            // Try and prepare the next area, if one exists.
            if (this.renderAreas.length > 0) {
                renderArea = this.renderAreas[0];
                clipArea = renderArea.clipArea;
                viewPort = renderArea.viewPort;
                this.mandelbrotRenderer.prepareArea(clipArea, viewPort);
            }

            // Render everything to canvas
            this.surface.swapBuffer(); 
        };
        
        this.scheduleAreas();
        $interval($.proxy(this.onTimerRender, this), 50);
    }]);
    
})();