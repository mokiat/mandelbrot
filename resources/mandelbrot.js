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

/**
 * The IColorProvider interface is reponsible for
 * providing the colors with which the Mandelbrot Set
 * will be rendered.
 */
mandelbrot.IColorProvider = oop.interface({
    /**
     * Returns the color in which a given point of the
     * coordinate should be drawn depending on the iteration
     * at which the point was evaluated not to be part of
     * the Mandelbrot Set, or the reverse.
     */
    getColorForEscapedIteration: function(iteration) {}
});

/**
 * Default implementation of the IColorProvider interface.
 */
mandelbrot.ColorProvider = oop.class({
    __create__: function(iterations) {
        this.colors = [0x000000FF];
        for (var i = 0; i < iterations; ++i) {
            this.colors[i + 1] = this.createColor(i);
        }
    },
    createColor: function(iteration) {
        var colorAmount = 1.0 - 30.0 / (30.0 + iteration);
        var threshold = 1.0 - 250.0 / (250.0 + iteration);
        var gradient = (0.5 + 0.5 * Math.sin(threshold * 10.0 * Math.PI / 2.0)) * colorAmount;
        return graphics.getIntFromRGB(gradient, gradient, 0.3 + gradient * 0.7);        
    },
    getColorForEscapedIteration: function(iteration) {
        return this.colors[iteration + 1];
    }
});


/**
 * Represents an algorithm that can render
 * a Mandelbrot Set or a section of one.
 */
mandelbrot.IRenderer = oop.interface({
    
    /**
     * Prepares the specified clip area for
     * rendering.
     * <p>
     * In general, this should render a mask over
     * the area to indicate to the user to expect
     * a render operation there.
     */
    prepareArea: function(clipArea){},
    
    /**
     * Renders a section of the Mandelbrot Set
     * to the specified clip area by using
     * the view port as an indication to which
     * part of the Mandelbrot Set to render.
     */
    renderArea: function(clipArea, viewPort){},
    
    /**
     * Assures that everything is rendered to
     * the surface.
     */
    renderToSurface: function() {}
    
});

/**
 * Default implementation of the IRenderer interface.
 */
mandelbrot.Renderer = oop.class({
    
    __create__ : function(surface, evaluator, colorProvider) {
        this.surface = surface;        
        this.evaluator = evaluator;
        this.colorProvider = colorProvider;
        
        this.prepareColor = graphics.getIntFromRGB(1.0, 1.0, 1.0);
        this.complexNumber = new mandelbrot.ComplexNumber();
    },    
    
    prepareArea: function(clipArea) {
        var endX = clipArea.getX() + clipArea.getWidth();
        var endY = clipArea.getY() + clipArea.getHeight();
        
        for (var y = clipArea.getY(); y < endY; ++y) {
            for (var x = clipArea.getX(); x < endX; ++x) {
                this.surface.putPixel(x, y, this.prepareColor);
            }
        }
    },
    
    renderArea: function(clipArea, viewPort) {
        var endX = clipArea.getX() + clipArea.getWidth();
        var endY = clipArea.getY() + clipArea.getHeight();
        
        var horizontalStep = viewPort.getWidth() / (clipArea.getWidth() - 1);
        var verticalStep = viewPort.getHeight() / (clipArea.getHeight() - 1);
        
        this.complexNumber.setImaginary(viewPort.getTop());
        for (var y = clipArea.getY(); y < endY; ++y) {
            this.complexNumber.setReal(viewPort.getLeft());
            for (var x = clipArea.getX(); x < endX; ++x) {
                var iteration = this.evaluator.getEscapeIteration(this.complexNumber);
                var color = this.colorProvider.getColorForEscapedIteration(iteration);
                this.surface.putPixel(x, y, color);
                this.complexNumber.setReal(this.complexNumber.getReal() + horizontalStep);
            }
            this.complexNumber.setImaginary(this.complexNumber.getImaginary() + verticalStep);
        }        
    },
    
    renderToSurface: function() {
        this.surface.swapBuffer();
    }

});
