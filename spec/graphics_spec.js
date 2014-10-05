describe("graphics", function() {
    
    describe("ViewPort", function() {
        
        var viewPort;
        
        describe("when a ViewPort has been created with initial values", function() {
            
            beforeEach(function() {
                viewPort = new graphics.ViewPort(-1.0, 2.0, 3.0, -4.0);
            });
            
            it("should be possible to get left", function() {
                expect(viewPort.getLeft()).toBeCloseTo(-1.0);                
            });
            
            it("should be possible to get right", function() {
                expect(viewPort.getRight()).toBeCloseTo(3.0);
            });
            
            it("should be possible to get top", function() {
                expect(viewPort.getTop()).toBeCloseTo(2.0);
            });
            
            it("should be possible to get bottom", function() {
                expect(viewPort.getBottom()).toBeCloseTo(-4.0);
            });
            
            it("should be possible to get width", function() {
                expect(viewPort.getWidth()).toBeCloseTo(4.0);
            });
            
            it("should be possible to get height", function() {
                expect(viewPort.getHeight()).toBeCloseTo(-6.0);
            });
            
            describe("when the ViewPort has been centered at a new location", function() {
                beforeEach(function() {
                    viewPort.centerAt(-0.5, 1.5);
                });
                
                it("the borders of the viewport should have changed accordingly", function() {
                    expect(viewPort.getLeft()).toBeCloseTo(-2.5);
                    expect(viewPort.getRight()).toBeCloseTo(1.5);
                    expect(viewPort.getTop()).toBeCloseTo(4.5);
                    expect(viewPort.getBottom()).toBeCloseTo(-1.5);
                });
            });
            
            describe("when the ViewPort width and height have been changed", function() {
                beforeEach(function() {
                    viewPort.setWidth(8.0);
                    viewPort.setHeight(-12.0);
                });
                
                it("the borders of the viewport should have changed accordingly", function() {
                    expect(viewPort.getLeft()).toBeCloseTo(-3.0);
                    expect(viewPort.getRight()).toBeCloseTo(5.0);
                    expect(viewPort.getTop()).toBeCloseTo(5.0);
                    expect(viewPort.getBottom()).toBeCloseTo(-7.0);
                });
            });
        });
        
        describe("when an empty ViewPort has been created.", function() {
            beforeEach(function() {
                viewPort = new graphics.ViewPort();
            });
            
            it("should have its bounds initialized to zero.", function() {
                expect(viewPort.getLeft()).toBeCloseTo(0.0);
                expect(viewPort.getRight()).toBeCloseTo(0.0);
                expect(viewPort.getTop()).toBeCloseTo(0.0);
                expect(viewPort.getBottom()).toBeCloseTo(0.0);
            });
            
            describe("when new bounds have been set", function() {
                beforeEach(function() {
                    viewPort.setLeft(3.0);
                    viewPort.setRight(4.0);
                    viewPort.setTop(10.0);
                    viewPort.setBottom(2.0);
                });
                
                it("they should be accessible", function() {
                    expect(viewPort.getLeft()).toBeCloseTo(3.0);
                    expect(viewPort.getRight()).toBeCloseTo(4.0);
                    expect(viewPort.getTop()).toBeCloseTo(10.0);
                    expect(viewPort.getBottom()).toBeCloseTo(2.0);
                });
            });
        });
        
    });
    
    describe("ClipArea", function() {
        
        var clipArea;
        
        describe("when a ClipArea has been created with initial values", function() {
            
            beforeEach(function() {
                clipArea = new graphics.ClipArea(200, 100, 400, 300);
            });
            
            it("should be possible to get X", function() {
                expect(clipArea.getX()).toEqual(200);
            });
            
            it("should be possible to get Y", function() {
                expect(clipArea.getY()).toEqual(100);
            });
            
            it("should be possible to get Width", function() {
                expect(clipArea.getWidth()).toEqual(400);
            });
            
            it("should be possible to get height", function() {
                expect(clipArea.getHeight()).toEqual(300);
            });
            
        });
        
    });
});