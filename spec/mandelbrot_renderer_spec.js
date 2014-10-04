describe("Renderer", function() {
    
    var surface;
    var evaluator;
    var colorProvider;
    var renderer;
    var clipArea;
    var viewPort;

    beforeEach(function() {
        surface = new graphics.ISurface();
        spyOn(surface, 'putPixel');

        evaluator = new mandelbrot.IEvaluator();
        colorProvider = new mandelbrot.IColorProvider();

        renderer = new mandelbrot.Renderer(surface, evaluator, colorProvider);
        
        clipArea = new graphics.ClipArea(1, 3, 2, 3);
        viewPort = new graphics.ViewPort(-1.0, 2.0, 3.0, -4.0);
    });
    
    it("should implement the IRenderer interface", function() {
        expect(mandelbrot.IRenderer.isImplementedBy(renderer)).toBeTruthy();
    });
    
    describe("when a prepare is performed on an area", function() {
        
        beforeEach(function() {
            renderer.prepareArea(clipArea);
        });
        
        it("should have filled the area with color", function() {
            var expectedColor = graphics.getIntFromRGB(1.0, 1.0, 1.0);
            expect(surface.putPixel).toHaveBeenCalledWith(1, 3, expectedColor);
            expect(surface.putPixel).toHaveBeenCalledWith(2, 3, expectedColor);
            expect(surface.putPixel).toHaveBeenCalledWith(1, 4, expectedColor);
            expect(surface.putPixel).toHaveBeenCalledWith(2, 4, expectedColor);
            expect(surface.putPixel).toHaveBeenCalledWith(1, 5, expectedColor);
            expect(surface.putPixel).toHaveBeenCalledWith(2, 5, expectedColor);
        });
        
    });
    
    describe("when a render is performed on an area", function() {
        
        var isSameComplex = function(complex, real, imaginary) {
            return Math.abs(complex.getReal() - real) < 0.0001 &&
                    Math.abs(complex.getImaginary() - imaginary) < 0.0001;
        };
        
        beforeEach(function() {
            spyOn(evaluator, 'getEscapeIteration').andCallFake(function(complexNumber) {
                if (isSameComplex(complexNumber, -1.0, 2.0)) {
                    return 0;
                }
                if (isSameComplex(complexNumber, 3.0, 2.0)) {
                    return 1;
                }
                if (isSameComplex(complexNumber, -1.0, -1.0)) {
                    return 2;
                }
                if (isSameComplex(complexNumber, 3.0, -1.0)) {
                    return 3;
                }
                if (isSameComplex(complexNumber, -1.0, -4.0)) {
                    return 4;
                }
                if (isSameComplex(complexNumber, 3.0, -4.0)) {
                    return 5;
                }
                return 100;
            });
            spyOn(colorProvider, 'getColorForEscapedIteration').andCallFake(function(iteration) {
                return iteration;
            });
            renderer.renderArea(clipArea, viewPort);
        });
        
        it("should have filled the area with the proper color", function() {
            expect(surface.putPixel).toHaveBeenCalledWith(1, 3, 0);
            expect(surface.putPixel).toHaveBeenCalledWith(2, 3, 1);
            expect(surface.putPixel).toHaveBeenCalledWith(1, 4, 2);
            expect(surface.putPixel).toHaveBeenCalledWith(2, 4, 3);
            expect(surface.putPixel).toHaveBeenCalledWith(1, 5, 4);
            expect(surface.putPixel).toHaveBeenCalledWith(2, 5, 5);            
        });
        
    });
    
    describe("when a render to surface is performed", function() {
        
        beforeEach(function() {
            spyOn(surface, 'swapBuffer'); 
            renderer.renderToSurface();
        });
        
        it("should have asked the surface to swap buffers", function() {
            expect(surface.swapBuffer).toHaveBeenCalled();
        });
        
    });
    
});