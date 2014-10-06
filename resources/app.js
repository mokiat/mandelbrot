(function() {
    var app = angular.module('home', []);
    
    app.controller('SimulationController', ['$interval', function($interval) {
                                                           
        this.ITERATIONS = 600;
            
        this.isZoom = true;
        this.renderAreas = [];

        var canvas = document.getElementById("simulationCanvas");
        this.surface = new graphics.Surface(canvas);

        var viewPort = new graphics.ViewPort(-2.5, 1.5, 1.5, -1.5);
        var clipArea = new graphics.ClipArea(0, 0, this.surface.getWidth(), this.surface.getHeight());
        this.camera = new simulation.Camera(viewPort, clipArea);

        var colorProvider = new mandelbrot.ColorProvider(this.ITERATIONS);
        var evaluator = new mandelbrot.Evaluator(this.ITERATIONS);
        this.mandelbrotRenderer = new mandelbrot.Renderer(this.surface, evaluator, colorProvider);        
        
        
        this.onCanvasClick = function(event) {
            // Nasty hack because of Firefox
            var x = event.offsetX? event.offsetX : event.clientX-event.target.offsetLeft;
            var y = event.offsetY? event.offsetY : event.clientY-event.target.offsetTop;
            
            var viewPortX = this.camera.getViewPortXFromClipAreaX(x);
            var viewPortY = this.camera.getViewPortYFromClipAreaY(y);
            if (this.isZoom) {
                this.camera.zoomInOn(viewPortX, viewPortY);
            } else {
                this.camera.zoomOutTo(viewPortX, viewPortY);
            }
            this.scheduleAreas();
        };
        
        this.scheduleAreas = function() {
            var clipAreaWidth = this.getClipAreaWidthFromDepth(this.camera.getZoomDepth());
            var clipAreaHeight = this.getClipAreaHeightFromDepth(this.camera.getZoomDepth());
            
            var horizontalNumber = this.surface.getWidth() / clipAreaWidth;
            var verticalNumber = this.surface.getHeight() / clipAreaHeight;
            
            this.renderAreas = [];
            for (var y = 0; y < verticalNumber; ++y) {
                for (var x = 0; x < horizontalNumber; ++x) {
                    var clipArea = new graphics.ClipArea(x * clipAreaWidth, y * clipAreaHeight, clipAreaWidth, clipAreaHeight);
                    var viewPort = this.camera.getSubViewPortFromSubClipArea(clipArea);
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