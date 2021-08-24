(function(ns, undefined) {

  ns.Task = class Task {
    execute() {}
  };

  ns.TaskRunner = class AsyncTaskRunner {
    constructor() {
      this.tasks = [];
      this.timerId = null;
    }

    cancel() {
      if (this.isTimerScheduled()) {
          this.cancelTimer();
      }
      this.tasks = [];
    }

    queue(task) {
      this.tasks.push(task);
      if (!this.isTimerScheduled()) {
          this.scheduleTimer();
      }
    }

    isTimerScheduled() {
      return this.timerId !== null;
    }

    scheduleTimer() {
      let callback = $.proxy(this.executeNextTask, this);
      this.timerId = setTimeout(callback, 1);
    }

    cancelTimer() {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    executeNextTask() {
      if (this.tasks.length === 0) {
          this.timerId = null;
          return;
      }

      let task = this.tasks.shift();
      task.execute();

      this.scheduleTimer();
    }
  };

})(window.async = window.async || {});
