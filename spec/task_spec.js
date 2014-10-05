BooleanTask = oop.class({
    isCalled: false,    
    execute: function() {
        this.isCalled = true;
    }
});

describe("task", function() {
    
    describe("when a task runner and tasks have been created", function() {
        
        var taskRunner;
        var firstTask;
        var secondTask;
        
        beforeEach(function() {
            taskRunner = new task.AsyncTaskRunner();
            expect(task.ITaskRunner.isImplementedBy(taskRunner)).toBeTruthy();
            
            firstTask = new BooleanTask();
            expect(task.ITask.isImplementedBy(firstTask)).toBeTruthy();
            
            secondTask = new BooleanTask();
            expect(task.ITask.isImplementedBy(secondTask)).toBeTruthy();            
        });
        
        afterEach(function() {
            taskRunner.cancel();
        });
        
        it("queued tasks should eventually get executed in order.", function() {
            taskRunner.queue(firstTask);
            taskRunner.queue(secondTask);
            
            waitsFor(function() {
                return firstTask.isCalled && secondTask.isCalled;
            }, "All tasks are executed", 5000);
        });
    });
    
});