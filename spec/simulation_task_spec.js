describe("RenderTask", function() {
    
    var mandelbrotRenderer;
    var prepClipArea;
    var viewPort;
    var clipArea;

    var renderTask;
    
    beforeEach(function() {
        mandelbrotRenderer = new mandelbrot.IRenderer();
        spyOn(mandelbrotRenderer, 'prepareArea');
        spyOn(mandelbrotRenderer, 'renderArea');
        spyOn(mandelbrotRenderer, 'renderToSurface');
        
        prepClipArea = new graphics.ClipArea(30, 40, 2, 3);
        viewPort = new graphics.ViewPort(-2.0, 1.0, 2.0, -1.0);
        clipArea = new graphics.ClipArea(10, 20, 2, 3);
        
        renderTask = new simulation.RenderTask(mandelbrotRenderer);
    });
    
    it("should be possible to get the Mandelbrot Renderer", function() {
        expect(renderTask.getMandelbrotRenderer()).toEqual(mandelbrotRenderer);
    });
    
    describe("when a RenderTask has been created without any areas", function() {
        
        it("getting the ClipArea should return null", function() {
            expect(renderTask.getClipArea()).toBeNull();
        });
        
        it("getting the ViewPort should return null", function() {
            expect(renderTask.getViewPort()).toBeNull();
        });
        
        it("getting the preparation ClipArea should return null", function() {
            expect(renderTask.getPreparationClipArea()).toBeNull();
        });
        
    });
    
    describe("when a RenderTask has been created with a preparation area", function() {
        
        beforeEach(function() {
            renderTask.setPreparationClipArea(prepClipArea);
        });
        
        it("should be possible to get the preparation ClipArea", function() {
            expect(renderTask.getPreparationClipArea()).toEqual(prepClipArea);
        });
        
        describe("when the RenderTask has been executed", function() {
            
            beforeEach(function() {
                renderTask.execute();
            });
            
            it("should NOT have rendered the render area", function() {
                expect(mandelbrotRenderer.renderArea).not.toHaveBeenCalled();
            });
            
            it("should have prepared the preparation area", function() {
                expect(mandelbrotRenderer.prepareArea).toHaveBeenCalledWith(prepClipArea);
            });
            
            it("should have rendered to surface", function() {
                expect(mandelbrotRenderer.renderToSurface).toHaveBeenCalled();
            });
            
        });
        
    });
    
    describe("when a RenderTask has been created with a render area", function() {
        
        beforeEach(function() {
            renderTask.setViewPort(viewPort);
            renderTask.setClipArea(clipArea);
        });
        
        it("should be possible to get the ClipArea", function() {
            expect(renderTask.getClipArea()).toEqual(clipArea);
        });
        
        it("should be possible to get the ViewPort", function() {
            expect(renderTask.getViewPort()).toEqual(viewPort);
        });
        
        describe("when the RenderTask has been executed", function() {
            
            beforeEach(function() {
                renderTask.execute();
            });
            
            it("should have rendered the render area", function() {
                expect(mandelbrotRenderer.renderArea).toHaveBeenCalledWith(clipArea, viewPort);
            });
            
            it("should NOT have preapred the preparation area", function() {
                expect(mandelbrotRenderer.prepareArea).not.toHaveBeenCalled();
            });
            
            it("should have rendered to surface", function() {
                expect(mandelbrotRenderer.renderToSurface).toHaveBeenCalled();
            });

            
        });
        
    });
    
});