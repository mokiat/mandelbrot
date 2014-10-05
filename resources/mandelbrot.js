oop.namespace("mandelbrot");

/**
 * The ComplexNumber class represents a math complex
 * number, comprised of a real and imaginary parts.
 */
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
    setTo: function(other) {
        this.real = other.getReal();
        this.imaginary = other.getImaginary();
    },
    inc : function(other) {
        this.real += other.getReal();
        this.imaginary += other.getImaginary();
    },
    dec: function(other) {
        this.real -= other.getReal();
        this.imaginary -= other.getImaginary();
    }
});

/**
 * The IEveluator interface represents an
 * algorithm that can tell you whether a given
 * complex is part of the Mandelbrot Set or not.
 */
mandelbrot.IEvaluator = oop.interface({
    
    /**
     * Returns the evaluation iteration during which
     * the complex number was determined NOT to be
     * part of the Mandelbrot Set. 
     * <p>
     * If the complex number is determined to be part 
     * of the Mandelbrot Set, then the returned value 
     * is equal to <code>-1</code>.
     */
    getEscapeIteration: function(complexNumber){}
    
});

/**
 * Default implementation of the IEvaluator
 * interface.
 */
mandelbrot.Evaluator = oop.class({
    __create__: function(iterations) {
        this.iterations = iterations;
        this.evaluation = new mandelbrot.ComplexNumber();
    },
    getEscapeIteration: function(complexNumber) {
        this.evaluation.setTo(complexNumber);
        for (var i = 0; i < this.iterations; ++i) {
            if (this.evaluation.getLengthSquared() >= 4.0) {
                return i;
            }
            this.evaluation.square();
            this.evaluation.inc(complexNumber);
        }
        return -1;
    }
});

mandelbrot.Renderer = oop.class({
    
    __create__ : function(graphics) {
        this.graphics = graphics;        
        this.clearColor = graphics.getIntFromRGB(0, 0, 0);
        this.prepareColor = graphics.getIntFromRGB(1, 1, 1);
        this.precision = 600;
        this.evaluator = new mandelbrot.Evaluator(this.precision);
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
        var complexNumber = new mandelbrot.ComplexNumber(a, b);
        var failedIteration = this.evaluator.getEscapeIteration(complexNumber);
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
