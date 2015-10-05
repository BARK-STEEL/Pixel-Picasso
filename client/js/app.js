console.log('...loaded');

angular.module('PixlArt', []);

angular.module('PixlArt')
  .controller('PaintingsController', ['$scope', '$http', function($scope, $http){

    $scope.Math = window.Math;

    $scope.pixels = [];

    $scope.paintings = [];

    $scope.pixelSize = null;

    $scope.newPainting =[];

    $scope.pixelDiv = true;
    $scope.togglePainting = false;

    $scope.color = '#E7E5DB';

    $scope.click = false;

    $http.get('/api/paintings').then(function(response){
      $scope.paintings = response.data;
    });

    $scope.showInput = function(){

    };

    $scope.renderCanvas = function(){
      $scope.pixelDiv = false;
      $scope.togglePainting = true;
      // $('#underPainting').css({background: 'url(' + $('#underPaintingChoice').val() +') no-repeat', backgroundSize: '100% 100%'});
      $('#underPaintingImage').attr('src', $('#underPaintingChoice').val() );
      $scope.pixelSize = $('#pixelChoice').val();
      var width = Math.floor(1300 / $scope.pixelSize );
      var height = Math.floor(650 / $scope.pixelSize);
      var numPixels = width * height;
      for (var i=0; i < numPixels; i++){
        $scope.pixels.push(i);
      }
    };

    $scope.showCanvas = function(canvasPixels) {
      console.log('click');
      $scope.pixelDiv = false;
      $scope.togglePainting = false;
      for (var i=0; i < canvasPixels.length; i++){
        $scope.pixels.push(canvasPixels[i]);
      }
      console.log($scope.pixels);
    };

    $scope.findPixelSize = function(numPixels){
      var pixelSize;
      switch(numPixels){
        case 136:
          pixelSize = 75;
          break;
        case 338:
          pixelSize = 50;
          break;
        case 903:
          pixelSize = 30;
          break;
        case 3698:
          pixelSize = 15;
          break;
        case 8450:
          pixelSize = 10;
          break;
        case 17020:
          pixelSize = 7;
          break;
      }
      return pixelSize;
    };

    // $scope.renderNewCanvas = function(colors){
    //   var colorsArray = colors.split("#");
    //   for (var i = 0; i < colorsArray.length; i++){
    //
    //   }
    // };

    $scope.setListeners = function(e){
      $scope.click = true;
      var pixel = angular.element(e.target);      $(pixel).css({backgroundColor:$scope.color});
      $(".square").on('mouseover', function(){
        $(this).css({backgroundColor:$scope.color});
      });
    };

    $scope.unsetListeners = function(){
      $('.square').off('mouseover');
      $scope.click = false;
    };

    // $scope.brushPreviewOn = function(e){
    //   if (!$scope.click) {
    //     console.log('hover');
    //     var pixel = angular.element(e.target);
    //     var oldcolor = $(pixel).css('background-color');
    //     var color = $scope.color;
    //     $(pixel).css({backgroundColor:color});
    //     $(pixel).on('mouseleave', function(){
    //       $(this).css('background-color', oldcolor);
    //     });
    //   }
    // };

    $scope.resetCanvas = function(){
      console.log('reset');
      var pixels = $('.square');
      for (var i =0; i < pixels.length; i++){
        $(pixels[i]).css('background-color', '#E7E5DB');
      }
    };

    $scope.toggleCanvas = function(){
      $scope.togglePainting = !$scope.togglePainting;
      if ($scope.togglePainting===false){
        $('#canvas').css('opacity', '1');
      } else {
        $('#canvas').css('opacity', '0.5');
      }
    };

    function rgb2hex(orig){
      var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
      return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
    }

    $scope.createPainting = function(){
      var paintingString = "";
      var pixels = $('.square');
      for (var i = 0; i < pixels.length; i++){
        paintingString += rgb2hex($(pixels[i]).css('background-color'));
      }
      $http.post('/api/paintings', {colors: paintingString.slice(1)}).then(function(response){
        $scope.paintings.push(response.data);
        console.log($scope.paintings);
      });
    };

    $scope.removePainting = function($index){
      var painting = $scope.paintings[$index];
      var url = '/api/paintings/' + painting._id;
      $http.delete(url).then(function(){
        $scope.paintings.splice($index, 1);
      });
    };

    $scope.defaultPixel = function(){
      console.log('erase');
      $scope.color = '#E7E5DB';
    };

    $("#custom").spectrum({
      color: "#f00",
      showPalette: true,
      showButtons: false,
      palette: [
          ['black', 'white', 'blanchedalmond'],
          ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
      ]
    });
    $("#custom").on('change.spectrum', function(){
      $scope.color = $('#custom').spectrum('get').toHexString();
      // $(".setColor").attr('data-color', color);
    });

  }]);
