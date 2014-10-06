describe("Scene", function() {
    
    var scene;
    var mandelbrotRenderer;
    var taskRunner;
    var scheduledTasks;
    var camera;
    
    beforeEach(function() {
        mandelbrotRenderer = new mandelbrot.IRenderer();
        
        scheduledTasks = [];
        taskRunner = new task.ITaskRunner();
        spyOn(taskRunner, 'cancel');
        spyOn(taskRunner, 'queue').andCallFake(function(task) {
            scheduledTasks.push(task);
        });
        
        var viewPort = new graphics.ViewPort(-2.0, 1.0, 2.0, -1.0);
        var clipArea = new graphics.ClipArea(200, 100, 600, 500);
        camera = new simulation.Camera(viewPort, clipArea);
        
        scene = new simulation.Scene(mandelbrotRenderer, taskRunner);
    });
    
    it("should implement IScene interface", function() {
        expect(simulation.IScene.isImplementedBy(scene)).toBeTruthy();
    });
    
    describe("when an update is performed with camera at min zoom depth", function() {
        
        beforeEach(function() {
            scene.update(camera);
        });
        
        it("should cancel old and schedule 5 new tasks for rendering", function() {
            // They are five because of one leading prepare task
            expect(taskRunner.cancel).toHaveBeenCalled();
            expect(scheduledTasks.length).toEqual(5);
        });
        
        it("all tasks should use the proper mandelbrot renderer", function() {
            for (var i = 0; i < scheduledTasks.length; ++i) {
                expect(scheduledTasks[i].getMandelbrotRenderer()).toEqual(mandelbrotRenderer);
            }
        });
        
        it("the first task should prepare the top left corner", function() {
            var expectedClipArea = new graphics.ClipArea(200, 100, 400, 300);

            var task = scheduledTasks[0];
            expect(task.getPreparationClipArea()).toEqual(expectedClipArea);
        });

        it("the second task should render the top left corner", function() {
            var expectedClipArea = new graphics.ClipArea(200, 100, 400, 300);
            var expectedViewArea = new graphics.ViewPort(-2.0, 1.0, 0.6666666666666665, -0.19999999999999996);

            var task = scheduledTasks[1];
            expect(task.getClipArea()).toEqual(expectedClipArea);
            expect(task.getViewPort()).toEqual(expectedViewArea);
        });
        
        it("the second task should prepare the top right corner", function() {
            var expectedClipArea = new graphics.ClipArea(600, 100, 200, 300);

            var task = scheduledTasks[1];
            expect(task.getPreparationClipArea()).toEqual(expectedClipArea);
        });
        
        it("the thrid task should render the top right corner", function() {
            var expectedClipArea = new graphics.ClipArea(600, 100, 200, 300);
            var expectedViewArea = new graphics.ViewPort(0.6666666666666665, 1.0, 2.0, -0.19999999999999996);

            var task = scheduledTasks[2];
            expect(task.getClipArea()).toEqual(expectedClipArea);
            expect(task.getViewPort()).toEqual(expectedViewArea);
        });

        it("the third task should prepare the bottom left corner", function() {
            var expectedClipArea = new graphics.ClipArea(200, 400, 400, 200);

            var task = scheduledTasks[2];
            expect(task.getPreparationClipArea()).toEqual(expectedClipArea);
        });
        
        it("the fourth task should render the bottom left corner", function() {
            var expectedClipArea = new graphics.ClipArea(200, 400, 400, 200);
            var expectedViewArea = new graphics.ViewPort(-2.0, -0.19999999999999996, 0.6666666666666665, -1.0);

            var task = scheduledTasks[3];
            expect(task.getClipArea()).toEqual(expectedClipArea);
            expect(task.getViewPort()).toEqual(expectedViewArea);
        });

        it("the fourth task should prepare the bottom right corner", function() {
            var expectedClipArea = new graphics.ClipArea(600, 400, 200, 200);

            var task = scheduledTasks[3];
            expect(task.getPreparationClipArea()).toEqual(expectedClipArea);
        });

        it("the fifth task should render the bottom right corner", function() {
            var expectedClipArea = new graphics.ClipArea(600, 400, 200, 200);
            var expectedViewArea = new graphics.ViewPort(0.6666666666666665, -0.19999999999999996, 2.0, -1.0);

            var task = scheduledTasks[4];
            expect(task.getClipArea()).toEqual(expectedClipArea);
            expect(task.getViewPort()).toEqual(expectedViewArea);
        });
    });
    
    describe("when an update is performed with camera at depth between 2 and 18", function() {
        beforeEach(function() {
            for (var i = 0; i < 4; ++i) {
                camera.zoomInOn(0.0, 0.0);
            }
            scene.update(camera);
        });
        
        it("should cancel old and schedule 31 new tasks for rendering", function() {
            // They are 31 and not 30 because of one leading prepare task
            expect(taskRunner.cancel).toHaveBeenCalled();
            expect(scheduledTasks.length).toEqual(31);
        });
    });
    
    describe("when an update is performed with camera at depth greater than 18", function() {
        beforeEach(function() {
            for (var i = 0; i < 19; ++i) {
                camera.zoomInOn(0.0, 0.0);
            }
            scene.update(camera);
        });
        
        it("should cancel old and schedule 121 new tasks for rendering", function() {
            // They are 121 and not 120 because of one leading prepare task
            expect(taskRunner.cancel).toHaveBeenCalled();
            expect(scheduledTasks.length).toEqual(121);
        });
    });
    
});