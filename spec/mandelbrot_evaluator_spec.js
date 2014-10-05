describe("Evaluator", function() {
    
    var ITERATIONS = 400;
    var evaluator;
    
    beforeEach(function() {
        evaluator = new mandelbrot.Evaluator(ITERATIONS);
    });
    
    it("should implement the IEvaluator interface", function() {
        expect(mandelbrot.IEvaluator.isImplementedBy(evaluator)).toBeTruthy();
    });
    
    it("should return -1 for complex numbers that are part of the Mandelbrot Set", function() {
        var complexNumber = new mandelbrot.ComplexNumber(0.0, 0.0); 
        expect(evaluator.getEscapeIteration(complexNumber)).toEqual(-1);
    });
    
    it("should return 0 for complex numbers that are quite far from the Mandelbrot Set", function() {
        var complexNumber = new mandelbrot.ComplexNumber(25.0, 25.0);
        expect(evaluator.getEscapeIteration(complexNumber)).toEqual(0);
    });
    
    it("should return some value for complex numbers that are near the edge of the Mandelbrot Set", function() {
        // Feigenbaum point
        var complexNumber = new mandelbrot.ComplexNumber(-0.1528, 1.0397);
        expect(evaluator.getEscapeIteration(complexNumber)).toBeGreaterThan(0);
    });
    
});
