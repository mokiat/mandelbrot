oop.namespace("mandelbrot");

mandelbrot.ComplexNumber = oop.class({
    __create__: function(real, imaginary) {
        if (real) {
            this.real = real;
        } else {
            this.real = 0.0;
        }
        if (imaginary) {
            this.imaginary = imaginary;
        } else {
            this.imaginary = 0.0;
        }
    },
    setReal: function(value) {
        this.real = value;
    },
    getReal: function() {
        return this.real;
    },
    setImaginary: function(value) {
        this.imaginary = value;
    }, 
    getImaginary: function() {
        return this.imaginary;
    },
    getLengthSquared: function() {
        return this.real * this.real + this.imaginary * this.imaginary;
    },
    square : function() {
        var newReal = this.real * this.real - this.imaginary * this.imaginary;
        var newImaginary = 2.0 * this.real * this.imaginary;
        this.real = newReal;
        this.imaginary = newImaginary;
    },
    inc : function(real, imaginary) {
        this.real += real;
        this.imaginary += imaginary;
    },
    dec: function(real, imaginary) {
        this.real -= real;
        this.imaginary -= imaginary;
    }
});

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
    }
});

mandelbrot.Solver = oop.class({
    
    __create__ : function(iterations) {
        this.iterations = iterations;
        this.evaluation = new mandelbrot.ComplexNumber();
    },
    
    calculateFailedIteration : function(a, b) {
        this.evaluation.setReal(0.0);
        this.evaluation.setImaginary(0.0);
        for (var i = 0; i < this.iterations; ++i) {
            if (this.evaluation.getLengthSquared() >= 4.0) {
                return i;
            }
            this.evaluation.square();
            this.evaluation.inc(a, b);
        }
        return -1;
    }
    
});

