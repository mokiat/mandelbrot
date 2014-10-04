oop.namespace("mandelbrot");

mandelbrot.Renderer = oop.class({
    
    __create__ : function(graphics) {
        this.graphics = graphics;        
        this.clearColor = graphics.getIntFromRGB(0, 0, 0);
        this.prepareColor = graphics.getIntFromRGB(1, 1, 1);
        this.precision = 600;
        this.solver = new mandelbrot.Solver(this.precision);
        this.colors = this.generateColors(this.graphics, this.precision);
    },
    
    generateColors : function(graphics, precision) {
        var result = [];
        for (var i = 0; i < precision; ++i) {
            var colorAmount = 1.0 - 30.0 / (30.0 + i);
            var threshold = 1.0 - 250.0 / (250.0 + i);
            var gradient = (0.5 + 0.5 * Math.sin(threshold * 10.0 * Math.PI / 2.0)) * colorAmount;
            result[i] = graphics.getIntFromRGB(gradient, gradient, 0.3 + gradient * 0.7);
        }
        return result;
    },
    
    getMandelbrotColor : function(a, b) {
        var failedIteration = this.solver.calculateFailedIteration(a, b);
        return (failedIteration === -1) ? 0x000000FF : this.colors[failedIteration]; 
    },
                
    prepareArea: function(clipArea) {
        var startX = clipArea.getX();
        var endX = startX + clipArea.getWidth();
        var startY = clipArea.getY();
        var endY = startY + clipArea.getHeight();
        for (var y = startY; y < endY; ++y) {
            for (var x = startX; x < endX; ++x) {
                this.graphics.putPixel(x, y, this.prepareColor);
            }
        }
    },
    
    renderArea: function(clipArea, viewPort) {
        var horizontalStep = viewPort.getWidth() / clipArea.getWidth();
        var verticalStep = viewPort.getHeight() / clipArea.getHeight();
        var valueB = viewPort.getTop();
        
        var startX = clipArea.getX();
        var endX = startX + clipArea.getWidth();
        var startY = clipArea.getY();
        var endY = startY + clipArea.getHeight();
        for (var y = startY; y < endY; ++y) {
            var valueA = viewPort.getLeft();
            for (var x = startX; x < endX; ++x) {
                var color = this.getMandelbrotColor(valueA, valueB);
                this.graphics.putPixel(x, y, color);
                valueA += horizontalStep;
            }
            valueB += verticalStep;
        }        
    },
    
    Render : function(viewPort) {
        var stepA = viewPort.Width / this.graphics.Width;
        var stepB = - viewPort.Height / this.graphics.Height;
        var currentB = viewPort.GetTop();
        for (var y = 0; y < this.graphics.Height; ++y) {
            var currentA = viewPort.GetLeft();
            for (var x = 0; x < this.graphics.Width; ++x) {
                var color = this.getMandelbrotColor(currentA, currentB);
                this.graphics.PutPixel(x, y, color);
                currentA += stepA;
            }
            currentB += stepB;
        }
        this.graphics.SwapBuffer();
    }
});

mandelbrot.Solver = oop.class({
    
    __create__ : function(iterations) {
        this.iterations = iterations;
        this.evaluation = new mandelbrot.ComplexNumber();
    },
    
    calculateFailedIteration : function(a, b) {
        this.evaluation.setA(0.0);
        this.evaluation.setB(0.0);
        for (var i = 0; i < this.iterations; ++i) {
            if (this.evaluation.getLengthSquared() >= 4.0) {
                return i;
            }
            this.evaluation.square();
            this.evaluation.increase(a, b);
        }
        return -1;
    }
    
});

mandelbrot.ComplexNumber = oop.class({
    __create__: function() {
        this.a = 0.0;
        this.b = 0.0;
    },
    increase : function(a, b) {
        this.a += a;
        this.b += b;
    },
    setA: function(value) {
        this.a = value;
    },
    getA: function() {
        return this.a;
    },
    setB: function(value) {
        this.b = value;
    },
    getB: function() {
        return this.b;
    },
    square : function() {
        var resultA = this.a * this.a - this.b * this.b;
        var resultB = 2.0 * this.a * this.b;
        this.a = resultA;
        this.b = resultB;
    },
    getLengthSquared: function() {
        return this.a * this.a + this.b * this.b;
    }
});