console.log('...loaded');

angular.module('PixlArt', ['ngCookies']);

angular.module('PixlArt')
  .controller('UsersController', ['$scope', '$rootScope', '$http', '$cookies', function($scope, $rootScope, $http, $cookies){
    $scope.signUp = false;
    $scope.logIn = true;
    $scope.welcome = true;
    $rootScope.user = {};
    $scope.newUser = {};
    $scope.logInUser = {};
    $rootScope.controls = false;
    $rootScope.pixelDiv = false;
    $rootScope.gallery = false;
    $rootScope.toggleGalleryButton = false;
    $scope.error = false;

    $scope.createUser = function(){
      $http.post('/api/users',
      $scope.newUser).then(function(response){
        $scope.newUser = {};
        $scope.signUp = false;
        $scope.logIn = true;
      });
    };

    $scope.obtainToken = function(){
      $http.post('/api/users/authentication_token',
      $scope.logInUser).then(function(response){
        if (response.data.status === 401){
          $scope.error = true;
        } else {
          $scope.error = false;
          $rootScope.token = response.data.token;
          $cookies.put('token', $rootScope.token);
          $rootScope.user = response.data;
          $rootScope.paintings = $rootScope.user.paintings;
          $rootScope.pixelDiv = true;
          $rootScope.toggleGalleryButton = true;
          $scope.logInUser = {};
          $scope.logIn = false;
          $scope.welcome = false;
        }

      });
    };

    $scope.removeToken = function(){
      if (confirm('Are you sure you want to log out?')) {
        $cookies.remove('token');
        $rootScope.user = {};
        $rootScope.paintings = [];
        $rootScope.controls = false;
        $rootScope.pixelDiv = false;
        $scope.logIn = true;
        $scope.welcome = true;
        $rootScope.gallery = false;
        $rootScope.toggleGalleryButton = false;
      }

    };
  }])

  .controller('PaintingsController', ['$scope', '$rootScope', '$http', '$cookies', function($scope, $rootScope, $http, $cookies){

    $scope.Math = window.Math;

    $scope.pixels = [];

    $rootScope.paintings = [];

    $scope.pixelSize = null;

    $scope.newPainting ={};

    $scope.togglePainting = false;

    $scope.color = '#E7E5DB';

    $scope.click = false;

    var trace = 1;

    $scope.trace = "both";

    $scope.findPixel = function(pixel){
      if (pixel.length===6){
        return pixel;
      } else {
        return "E7E5DB";
      }
    };

    $scope.renderCanvas = function(){
      if (!$scope.newPainting.url){
        $scope.newPainting.url = '';
      }
      $scope.newPainting.paintingTitle = "untitled";
      $scope.pixels = [];
      $rootScope.pixelDiv = false;
      $rootScope.controls = true;
      $scope.togglePainting = true;
      // $('#underPainting').css({background: 'url(' + $('#underPaintingChoice').val() +') no-repeat', backgroundSize: '100% 100%'});
      // $('#underPaintingImage').attr('src', $('#underPaintingChoice').val() );
      $scope.pixelSize = $('#pixelChoice').val();
      var width = Math.floor(1300 / $scope.pixelSize );
      var height = Math.floor(650 / $scope.pixelSize);
      var numPixels = width * height;
      for (var i=0; i < numPixels; i++){
        $scope.pixels.push(i);
      }
    };

    $scope.showCanvas = function(canvasPixels, url, title) {
      $scope.pixels = [];
      $rootScope.gallery = false;
      $rootScope.pixelDiv = false;
      $rootScope.controls = true;
      $scope.togglePainting = false;
      $('#canvas').css('opacity', '1');
      trace = 2;
      // $('#underPaintingImage').attr('src', url );
      for (var i=0; i < canvasPixels.length; i++){
        $scope.pixels.push(canvasPixels[i]);
      }
      $scope.newPainting.url = url;
      $scope.newPainting.paintingTitle = title;
      console.log($scope.newPainting);
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
      if (confirm('Are you sure you want to reset the canvas?')) {
        var pixels = $('.square');
        for (var i =0; i < pixels.length; i++){
          $(pixels[i]).css('background-color', '#E7E5DB');
        }
      }
    };

    $scope.newPaintingScreen = function(){
      if (confirm('Are you sure you want to start over?')) {
        $rootScope.pixelDiv = true;
        $rootScope.controls = false;
        $scope.pixels = [];
      }
    };

    $scope.toggleCanvas = function(){
      trace += 1;
      if (trace == 4){
        trace = 1;
      }
      if (trace == 1){
        $('#canvas').css('opacity', '0.5');
      } else if (trace == 2){
        $('#canvas').css('opacity', '1');
      } else if (trace == 3){
        $('#canvas').css('opacity', '0');
      }
    //   $scope.togglePainting = !$scope.togglePainting;
    //   if ($scope.togglePainting===false){
    //     $('#canvas').css('opacity', '1');
    //   } else {
    //     $('#canvas').css('opacity', '0.5');
    //   }
    };

    $scope.toggleGallery = function(){
      $rootScope.gallery = !$rootScope.gallery;
    };

    function rgb2hex(orig){
      var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
      return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
    }

    $scope.createPainting = function(){
      if ($scope.newPainting.paintingTitle === null){
        $scope.newPainting.paintingTitle = "untitled";
      }
      console.log($scope.newPainting);
      html2canvas($('#canvas'), {
        onrendered: function(canvas) {
          var img = canvas.toDataURL("image/png");
          $scope.newPainting.img = img;
          $('#titleText').html("");
          var paintingString = "";
          var pixels = $('.square');
          for (var i = 0; i < pixels.length; i++){
            paintingString += rgb2hex($(pixels[i]).css('background-color'));
          }
          $http({
            url: '/api/paintings',
            method: 'post',
            headers: {
              token: $rootScope.token
            },
            data: {
              img: $scope.newPainting.img,
              title: $scope.newPainting.paintingTitle,
              colors: paintingString.slice(1),
              url: $scope.newPainting.url
            }
          }).then(function(response){
            $rootScope.paintings = response.data.paintings;
            console.log($rootScope.paintings);
          });
        }
      });
    };

    $scope.removePainting = function($index){
      if (confirm('Are you sure you want to delete this?')) {
        var painting = $scope.paintings[$index];
        var url = '/api/paintings/';
        $http({
          url: url,
          method: 'put',
          headers: {
            token: $rootScope.token
          },
          data: {id:painting._id}
        }).then(function(response){
          $scope.paintings.splice($index, 1);
        });
      }

    };

    $scope.defaultPixel = function(){
      $scope.color = '#E7E5DB';
    };

    $scope.screenshot = function(){
      html2canvas($('#canvas'), {
        onrendered: function(canvas) {
          var img = canvas.toDataURL("image/png");
          console.log(img);
          // document.body.appendChild(canvas);
        }
      });
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
