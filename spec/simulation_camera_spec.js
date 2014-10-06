describe("Camera", function() {
    
    var camera;
    
    beforeEach(function() {
        var viewPort = new graphics.ViewPort(-1.0, 1.0, 2.0, -1.0);
        var clipArea = new graphics.ClipArea(10, 20, 40, 50);
        camera = new simulation.Camera(viewPort, clipArea);
    });
    
    expectCameraViewPortValues = function(left, top, right, bottom) {
        var viewPort = camera.getViewPort();
        expect(viewPort.getLeft()).toBeCloseTo(left);
        expect(viewPort.getTop()).toBeCloseTo(top);
        expect(viewPort.getRight()).toBeCloseTo(right);
        expect(viewPort.getBottom()).toBeCloseTo(bottom);        
    };
    
    it("should implement ICamera interface", function() {
        expect(simulation.ICamera.isImplementedBy(camera)).toBeTruthy();
    });
    
    it("should be possible to get the ViewPort", function() {
        expectCameraViewPortValues(-1.0, 1.0, 2.0, -1.0);
    });
    
    it("should be possible to get the ClipArea", function() {
        var clipArea = camera.getClipArea();
        expect(clipArea.getX()).toEqual(10);
        expect(clipArea.getY()).toEqual(20);
        expect(clipArea.getWidth()).toEqual(40);
        expect(clipArea.getHeight()).toEqual(50);
    });
    
    it("should have a default zoom depth of 1", function() {
        expect(camera.getZoomDepth()).toEqual(1);
    });
    
    it("should have an initial max zoom depth of 20", function() {
        expect(camera.getMaxZoomDepth()).toEqual(20);
    });
    
    it("should be possible to convert ClipArea coords to ViewPort coords", function() {
        expect(camera.getViewPortXFromClipAreaX(10)).toBeCloseTo(-1.0);
        expect(camera.getViewPortXFromClipAreaX(50)).toBeCloseTo(2.0);
        expect(camera.getViewPortXFromClipAreaX(30)).toBeCloseTo(0.5);
        
        expect(camera.getViewPortYFromClipAreaY(20)).toBeCloseTo(1.0);
        expect(camera.getViewPortYFromClipAreaY(70)).toBeCloseTo(-1.0);
        expect(camera.getViewPortYFromClipAreaY(45)).toBeCloseTo(0.0);
    });
    
    it("should be possible to get a sub-ViewPort from a sub-ClipArea", function() {
        var subClipArea = new graphics.ClipArea(20, 30, 20, 30);
        var subViewPort = camera.getSubViewPortFromSubClipArea(subClipArea);
        
        expect(subViewPort.getLeft()).toBeCloseTo(-0.25);
        expect(subViewPort.getRight()).toBeCloseTo(1.25);
        expect(subViewPort.getTop()).toBeCloseTo(0.6);
        expect(subViewPort.getBottom()).toBeCloseTo(-0.6);
    });
    
    describe("when the max zoom depth has been changed", function() {
        beforeEach(function() {
            camera.setMaxZoomDepth(20);
        });
        
        it("the value should have changed accordingly", function() {
            expect(camera.getMaxZoomDepth()).toEqual(20);
        });
    });
    
    describe("when the camera has been zoomed in on a given location", function() {
        
        beforeEach(function() {
            camera.zoomInOn(-0.5, 0.5);
        });
        
        it("the zoom depth should have incremented", function() {
            expect(camera.getZoomDepth()).toEqual(2);
        });
        
        it("the ViewPort values should have changed accordingly", function() {
            expectCameraViewPortValues(-0.875, 0.75, -0.125, 0.25);
        });
        
        describe("when the camera has been zoomed out to a given location", function() {
            
            beforeEach(function() {
                camera.zoomOutTo(2.5, -0.5);
            });
            
            it("the zoom depth should have decremented", function() {
                expect(camera.getZoomDepth()).toEqual(1);
            });
            
            it("the ViewPort values should have changed accordingly", function() {
                var viewPort = camera.getViewPort();
                expect(viewPort.getLeft()).toBeCloseTo(1.0);
                expect(viewPort.getTop()).toBeCloseTo(0.5);
                expect(viewPort.getRight()).toBeCloseTo(4.0);
                expect(viewPort.getBottom()).toBeCloseTo(-1.5);
            });
            
        });
        
        describe("when the maximum zoom depth has been reached and a zoom is performed", function() {
            
            beforeEach(function() {
                // Cheat by setting the max zoom depth to the current depth
                camera.setMaxZoomDepth(2);
                camera.zoomInOn(1.0, 3.0);
            });
            
            it("the zoom depth should NOT have incremented", function() {
                expect(camera.getZoomDepth()).toEqual(2);
            });

            it("the ViewPort should have only moved and NOT zoomed", function() {
                expectCameraViewPortValues(0.625, 3.25, 1.375, 2.75);
            });
            
        });
    });
    
    describe("when camera is minimum depth and a zoom out is performed", function() {
        
        beforeEach(function() {
            camera.zoomOutTo(-2.0, -1.0);
        });
        
        it("the camera depth should NOT have decremented", function() {
            expect(camera.getZoomDepth()).toEqual(1);
        });
        
        it("the ViewPort should have only moved and NOT zoomed", function() {
            expectCameraViewPortValues(-3.5, 0.0, -0.5, -2.0);
        });
        
    });
    
});