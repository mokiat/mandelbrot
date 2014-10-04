(function() {
    var app = angular.module('home', []);
    
    app.controller('SimulationController', function() {
                                                           
        this.ITERATIONS = 600;
            
        this.isZoom = true;

        var canvas = document.getElementById("simulationCanvas");
        this.surface = new graphics.Surface(canvas);

        var viewPort = new graphics.ViewPort(-2.5, 1.5, 1.5, -1.5);
        var clipArea = new graphics.ClipArea(0, 0, this.surface.getWidth(), this.surface.getHeight());
        this.camera = new simulation.Camera(viewPort, clipArea);

        var colorProvider = new mandelbrot.ColorProvider(this.ITERATIONS);
        var evaluator = new mandelbrot.Evaluator(this.ITERATIONS);
        this.mandelbrotRenderer = new mandelbrot.Renderer(this.surface, evaluator, colorProvider); 
        
        var taskRunner = new task.AsyncTaskRunner();
        this.scene = new simulation.Scene(this.mandelbrotRenderer, taskRunner);
        
        this.onZoomIn = function() {
            this.isZoom = true;
        };
        
        this.onZoomOut = function() {
            this.isZoom = false;
        };
        
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
            this.updateScene();
        };
        
        this.updateScene = function() {
            this.scene.update(this.camera);
        };
        
        this.updateScene();
    });
})();