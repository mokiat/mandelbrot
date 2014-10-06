oop.namespace("task");

/**
 * Represents a task that can be execute by
 * an ITaskRunner implementation.
 */
task.ITask = oop.interface({
    /**
     * The method that will be called 
     * by the task runner.
     */
    execute: function() {}
});

/**
 * Represents a class that can execute ITask
 * instances.
 */
task.ITaskRunner = oop.interface({
    /**
     * Cancels any future scheduled tasks and clears
     * the task list.
     */
    cancel: function() {},
    /**
     * Queues the specified task for future execution.
     */
    queue: function(task) {}
});

/**
 * An implementation of ITaskRunner that runs
 * tasks asynchronously via the use of setTimeout.
 */
task.AsyncTaskRunner = oop.class({
    
    __create__: function() {
        this.tasks = [];
        this.timerId = null;
    },
    cancel: function() {
        if (this.isTimerScheduled()) {
            this.cancelTimer();
        }
        this.tasks = [];
    },
    queue: function(task) {
        this.tasks.push(task);
        if (!this.isTimerScheduled()) {
            this.scheduleTimer();
        }
    },
    isTimerScheduled: function() {
        return this.timerId !== null;
    },
    scheduleTimer: function() {
        var callback = $.proxy(this.executeNextTask, this);
        this.timerId = setTimeout(callback, 1);
    },
    cancelTimer: function() {
        clearTimeout(this.timerId);
        this.timerId = null;
    },
    executeNextTask: function() {
        if (this.tasks.length === 0) {
            this.timerId = null;
            return;
        }
        
        var task = this.tasks.shift();
        task.execute();
        
        this.scheduleTimer();
    }
    
});