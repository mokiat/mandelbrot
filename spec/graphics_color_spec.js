describe("color", function() {
    
    describe("when a color is defined as Red, Green and Blue", function() {
        var red;
        var green;
        var blue;
        
        beforeEach(function() {
            red = 0.5;
            green = 1.0;
            blue = 0.25;
        });
        
        it("should be possible to convert it to integer", function() {
            var intColor = graphics.getIntFromRGB(red, green, blue);
            expect(intColor).toEqual(0x7FFF3FFF);
        });
        
    });
    
});