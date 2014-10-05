describe("ColorProvider", function() {
    
    var ITERATIONS = 100;
    var colorProvider;
    
    beforeEach(function() {
        colorProvider = new mandelbrot.ColorProvider(ITERATIONS);        
    });
    
    it("should implement the IColorProvider interface", function() {
        expect(mandelbrot.IColorProvider.isImplementedBy(colorProvider)).toBeTruthy();
    });
    
    it("should return a valid black color for values that are part of the MandelbrotSet", function() {
        var color = colorProvider.getColorForEscapedIteration(-1);
        expect(color).toBeDefined();
        expect(color).toEqual(0x000000FF);
    });
    
    it("should return a valid non-black color for values outside the Mandelbrot Set", function() {
        var color = colorProvider.getColorForEscapedIteration(ITERATIONS / 2);
        expect(color).toBeDefined();
        expect(color).not.toEqual(0x000000FF);
    });
    
});