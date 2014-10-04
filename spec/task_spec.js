BooleanTask = oop.class({
    isCalled: false,    
    execute: function() {
        this.isCalled = true;
    }
});

describe("AsyncTaskRunner", function() {
    
    describe("when a task runner and tasks have been created", function() {
        
        var taskRunner;
        var firstTask;
        var secondTask;
        var thirdTask;
        var fourthTask;
        
        scheduleFirstGroupOfTasks = function() {
            taskRunner.queue(firstTask);
            taskRunner.queue(secondTask);
        };
        
        expectFirstGroupOfTasksToBeExecuted = function() {
            waitsFor(function() {
                return firstTask.isCalled && secondTask.isCalled;
            }, "Tasks are executed", 5000);            
        };
        
        scheduleSecondGroupOfTasks = function() {
            taskRunner.queue(thirdTask);
            taskRunner.queue(fourthTask); 
        };  
        
        expectSecondGroupOfTasksToBeExecuted = function() {
            waitsFor(function() {
                return thirdTask.isCalled && fourthTask.isCalled;
            }, "Tasks are executed", 5000);

        };
        
        beforeEach(function() {
            taskRunner = new task.AsyncTaskRunner();
            expect(task.ITaskRunner.isImplementedBy(taskRunner)).toBeTruthy();
            
            firstTask = new BooleanTask();
            expect(task.ITask.isImplementedBy(firstTask)).toBeTruthy();
            
            secondTask = new BooleanTask();
            expect(task.ITask.isImplementedBy(secondTask)).toBeTruthy();            
            
            thirdTask = new BooleanTask();
            expect(task.ITask.isImplementedBy(thirdTask)).toBeTruthy();            
            
            fourthTask = new BooleanTask();
            expect(task.ITask.isImplementedBy(fourthTask)).toBeTruthy();            
        });
        
        afterEach(function() {
            taskRunner.cancel();
        });        
        
        describe("when tasks have been queued", function() {
            
            beforeEach(function() {
                scheduleFirstGroupOfTasks();
            });
            
            it("all tasks should eventually get executed", function() {
                expectFirstGroupOfTasksToBeExecuted();
            });
            
            describe("when the tasks have executed", function() {
                beforeEach(function() {
                    expectFirstGroupOfTasksToBeExecuted();
                });
                
                describe("when new tasks are scheduled", function() {
                    beforeEach(function() {
                        scheduleSecondGroupOfTasks();                  
                    });
                    
                    it("all new tasks should eventually get executed", function() {
                        expectSecondGroupOfTasksToBeExecuted();
                    });                    
                });
            });
            
            describe("when task runner is immediatelly cancelled", function() {
                
                beforeEach(function() {
                    taskRunner.cancel();
                });
                
                it("no tasks should get executed", function() {
                    waits(1000);
                    runs(function() {
                        expect(firstTask.isCalled).toBeFalsy();
                        expect(secondTask.isCalled).toBeFalsy();
                    });
                });
                
                describe("when new tasks are scheduled", function() {
                    
                    beforeEach(function() {
                        scheduleSecondGroupOfTasks();
                    });
                    
                    it("all new tasks should eventually get executed", function() {
                        expectSecondGroupOfTasksToBeExecuted();
                    });
                });
                
            });
        });
 
    });
    
});