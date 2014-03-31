// author: Bernhard Eiling

$(document).ready(function() {

  var stalkCount = 0;
  var imageObj = new Image();
  var canvas = document.getElementById('canvas');
  var imageWidth = 400;
  var imageHeight = 400;
  var imageX = 0;
  var imageY = 0;
  //var ctx = canvas.getContext('2d');
  var imageRatio = imageObj.width / imageObj.height;
  var ratioHeight = imageWidth / imageRatio;
  $("#canvas").attr("width", imageWidth);
  $("#canvas").attr("height", imageHeight);


  window.fbAsyncInit = function() {
    FB.init({
      appId      : '151550108360985', // App ID
      channelUrl : 'http://stalkyourself.eu01.aws.af.cm/', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
  };

  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
  }(document));
 


  $("#button").click(function() {

     FB.login(function(response) {
     if (response.authResponse) {


      function getMusic(callback) {
         FB.api('/me/music', function(response) {
          stalkCount += response.data.length;
          callback();
         });
       }

      function getMovies(callback) {
       FB.api('/me/movies', function(response) {
        stalkCount += response.data.length;
        callback();
       });
      }

      function getBooks(callback) {
       FB.api('/me/books', function(response) {
        stalkCount += response.data.length;
        callback();
       });
      }

       
      function getPic(stalkc, callback) {
       FB.api('/me', function(response) {
         var picString = "https://graph.facebook.com/" + response.username + "/picture?type=large";

         imageObj.onload = function() {
          drawImage(stalkc, this);
        }

        imageObj.crossOrigin = "anonymous";
        imageObj.src = picString;

        callback();

       });
      }


      getMusic(function() {
        getMovies(function() {
          getBooks(function() {
            getPic(stalkCount);
          });
        });
      });

     } else {
       console.log('User cancelled login or did not fully authorize.');
    }
    
    },{scope: 'email, user_likes'});

  });

  // IMAGE STUFF
    function drawImage(stalkc, imageObj) {

        imageRatio = imageObj.width / imageObj.height;
        var numPix = imageObj.width * imageObj.height;
        var modVal = 60;
        var stalkSkalar = Math.abs(stalkc - modVal);

        context = canvas.getContext('2d');
        imageX = 0;
        imageY = 0;
        var ratioHeight = imageWidth / imageRatio;

        context.drawImage(imageObj, imageX, imageY, imageWidth, ratioHeight);

        imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);

        data = imageData.data;
        //data = localStorage.image.data;

        var srcData = new Array();
        for(var i = 0; i < data.length; i++) {
          srcData[i] = data[i];
        }
        
        var refreshId = setInterval( function() 
          {
             modVal = modVal - 1;
             if (modVal <= stalkSkalar) {
              modVal = stalkSkalar;
             }
             pixelatePic(modVal); 
          }, 80);


        function pixelatePic(modVal) {
         for(var y = 0; y < imageHeight; y++) {
              for(var x = 0; x < imageWidth; x++) {

               if ( x % modVal == 0 && y % modVal == 0) {
                  var red = srcData[((imageWidth * y) + x) * 4];
                  var green = srcData[((imageWidth * y) + x) * 4 + 1];
                  var blue = srcData[((imageWidth * y) + x) * 4 + 2];
                  var alpha = srcData[((imageWidth * y) + x) * 4 + 3];

                  for(var yintern = 0; yintern < modVal; yintern++) {
                    for(var xintern = 0; xintern < modVal; xintern++) {
                      var index = ((x + xintern) + (y + yintern) * imageWidth) * 4;
                      data[index+0] = red;
                      data[index+1] = green;
                      data[index+2] = blue;
                      data[index+3] = alpha;
                    }
                  }
               }
            } 
          }
          context.putImageData(imageData, imageX, imageY);
        }
    }
  
})