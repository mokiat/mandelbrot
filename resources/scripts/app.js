(function(angular, undefined) {

  let app = angular.module('home', []);
  app.controller('simulation-ctrl', function($scope) {
      let canvas = document.getElementById("simulation-canvas");
      let surface = new graphics.Surface(canvas);
      let viewPort = new graphics.ViewPort(-2.5, 1.5, 1.5, -1.5);
      let clipArea = new graphics.ClipArea(0, 0, surface.getWidth(), surface.getHeight());
      $scope.camera = new simulation.Camera(viewPort, clipArea);

      const ITERATIONS = 600;
      let colorProvider = new mandelbrot.ColorProvider(ITERATIONS);
      let evaluator = new mandelbrot.Evaluator(ITERATIONS);
      let mandelbrotRenderer = new mandelbrot.Renderer(surface, evaluator, colorProvider);

      let taskRunner = new async.TaskRunner();
      $scope.scene = new simulation.Scene(mandelbrotRenderer, taskRunner);

      $scope.isZoom = true;

      $scope.updateScene = function() {
          $scope.scene.update($scope.camera);
      };

      $scope.onCanvasClick = function(event) {
          // Nasty hack because of Firefox
          let x = event.offsetX ? event.offsetX : event.clientX-event.target.offsetLeft;
          let y = event.offsetY ? event.offsetY : event.clientY-event.target.offsetTop;

          let viewPortX = $scope.camera.getViewPortXFromClipAreaX(x);
          let viewPortY = $scope.camera.getViewPortYFromClipAreaY(y);
          if ($scope.isZoom) {
              $scope.camera.zoomInOn(viewPortX, viewPortY);
          } else {
              $scope.camera.zoomOutTo(viewPortX, viewPortY);
          }

          $scope.updateScene();
      };

      $scope.updateScene();
  });

})(angular);
