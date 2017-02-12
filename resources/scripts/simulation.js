(function(ns, undefined) {

  ns.Camera = class Camera {
    constructor(viewPort, clipArea) {
      this.viewPort = viewPort;
      this.clipArea = clipArea;
      this.zoomDepth = 1;
      this.maxZoomDepth = 20;
    }

    setMaxZoomDepth(value) {
      this.maxZoomDepth = value;
    }

    getMaxZoomDepth() {
      return this.maxZoomDepth;
    }

    getZoomDepth() {
      return this.zoomDepth;
    }

    getViewPort() {
      return this.viewPort;
    }

    getClipArea() {
      return this.clipArea;
    }

    getViewPortXFromClipAreaX(clipX) {
      let ratio = (clipX - this.clipArea.getX()) / this.clipArea.getWidth();
      return this.viewPort.getLeft() + this.viewPort.getWidth() * ratio;
    }

    getViewPortYFromClipAreaY(clipY) {
      let ratio = (clipY - this.clipArea.getY()) / this.clipArea.getHeight();
      return this.viewPort.getTop() + this.viewPort.getHeight() * ratio;
    }

    getSubViewPortFromSubClipArea(subClipArea) {
      let result = new graphics.ViewPort();
      result.setLeft(this.getViewPortXFromClipAreaX(subClipArea.getX()));
      result.setRight(this.getViewPortXFromClipAreaX(subClipArea.getX() + subClipArea.getWidth()));
      result.setTop(this.getViewPortYFromClipAreaY(subClipArea.getY()));
      result.setBottom(this.getViewPortYFromClipAreaY(subClipArea.getY() + subClipArea.getHeight()));
      return result;
    }

    zoomInOn(x, y) {
      this.viewPort.centerAt(x, y);
      if (this.zoomDepth < this.maxZoomDepth) {
          this.zoomDepth++;
          this.scaleAboutCenter(0.25);
      }
    }

    zoomOutTo(x, y) {
      this.viewPort.centerAt(x, y);
      if (this.zoomDepth > 1) {
          this.zoomDepth--;
          this.scaleAboutCenter(4.0);
      }
    }

    scaleAboutCenter(amount) {
      this.viewPort.setWidth(this.viewPort.getWidth() * amount);
      this.viewPort.setHeight(this.viewPort.getHeight() * amount);
    }
  };


  ns.RenderTask = class RenderTask {
    constructor(mandelbrotRenderer) {
      this.mandelbrotRenderer = mandelbrotRenderer;
      this.viewPort = null;
      this.clipArea = null;
      this.prepClipArea = null;
    }

    getMandelbrotRenderer() {
      return this.mandelbrotRenderer;
    }

    setViewPort(viewPort) {
      this.viewPort = viewPort;
    }

    getViewPort() {
      return this.viewPort;
    }

    setClipArea(clipArea) {
      this.clipArea = clipArea;
    }

    getClipArea() {
      return this.clipArea;
    }

    setPreparationClipArea(prepClipArea) {
      this.prepClipArea = prepClipArea;
    }

    getPreparationClipArea() {
      return this.prepClipArea;
    }

    execute() {
      if (this.clipArea && this.viewPort) {
          this.mandelbrotRenderer.renderArea(this.clipArea, this.viewPort);
      }
      if (this.prepClipArea) {
          this.mandelbrotRenderer.prepareArea(this.prepClipArea);
      }
      this.mandelbrotRenderer.renderToSurface();
    }
  };


  ns.Scene = class Scene {
    constructor(mandelbrotRenderer, taskRunner) {
      this.mandelbrotRenderer = mandelbrotRenderer;
      this.taskRunner = taskRunner;
    }

    update(camera) {
      this.taskRunner.cancel();

      let cameraClipStartX = camera.getClipArea().getX();
      let cameraClipEndX = cameraClipStartX + camera.getClipArea().getWidth();
      let cameraClipStartY = camera.getClipArea().getY();
      let cameraClipEndY = cameraClipStartY + camera.getClipArea().getHeight();

      let windowWidth = this.getClipAreaWidthFromDepth(camera.getZoomDepth());
      let windowHeight = this.getClipAreaHeightFromDepth(camera.getZoomDepth());

      let oldRenderTask = null;

      let windowY = cameraClipStartY;
      while (windowY < cameraClipEndY) {
          let windowX = cameraClipStartX;
          while (windowX < cameraClipEndX) {
              let renderTask = this.createRenderTask();
              this.configureTaskPreparationArea(camera, renderTask, windowX, windowY, windowWidth, windowHeight);
              this.configureTaskRenderArea(camera, renderTask, oldRenderTask);
              this.taskRunner.queue(renderTask);
              oldRenderTask = renderTask;
              windowX += windowWidth;
          }
          windowY += windowHeight;
      }
      if (oldRenderTask) {
          let renderTask = this.createRenderTask();
          this.configureTaskRenderArea(camera, renderTask, oldRenderTask);
          this.taskRunner.queue(renderTask);
      }
    }

    createRenderTask() {
      return new simulation.RenderTask(this.mandelbrotRenderer);
    }

    configureTaskPreparationArea(camera, renderTask, windowX, windowY, windowWidth, windowHeight) {
      if (windowX + windowWidth > camera.getClipArea().getX() + camera.getClipArea().getWidth()) {
          windowWidth = camera.getClipArea().getX() + camera.getClipArea().getWidth() - windowX;
      }
      if (windowY + windowHeight > camera.getClipArea().getY() + camera.getClipArea().getHeight()) {
          windowHeight = camera.getClipArea().getY() + camera.getClipArea().getHeight() - windowY;
      }
      let clipArea = new graphics.ClipArea(windowX, windowY, windowWidth, windowHeight);
      renderTask.setPreparationClipArea(clipArea);
    }

    configureTaskRenderArea(camera, renderTask, oldRenderTask) {
      if (!oldRenderTask) {
          return;
      }
      let clipArea = oldRenderTask.getPreparationClipArea();
      renderTask.setClipArea(clipArea);
      let viewPort = camera.getSubViewPortFromSubClipArea(clipArea);
      renderTask.setViewPort(viewPort);
    }

    getClipAreaWidthFromDepth(depth) {
      if (depth < 2) {
          return 200;
      } else if (depth < 18) {
          return 80;
      } else {
          return 50;
      }
    }

    getClipAreaHeightFromDepth(depth) {
      if (depth < 2) {
          return 150;
      } else if (depth < 18) {
          return 60;
      } else {
          return 50;
      }
    }
  };

})(window.simulation = window.simulation || {});
