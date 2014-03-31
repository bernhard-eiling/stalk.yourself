$(document).ready(function() {

    
    var imageObj = new Image();
    var canvas = document.getElementById('canvas');
    var data;
    var imageWidth = $(window).width();
    var imageHeight = $(window).height();

    $("#canvas").attr("width", imageWidth)
    $("#canvas").attr("height", imageHeight)

    console.log(imageWidth);

    imageObj.onload = function() {
        drawImage(this);
    };

    imageObj.src = "res/obama.jpg";

    function drawImage(imageObj) {

        imageRatio = imageObj.width / imageObj.height;

        context = canvas.getContext('2d');
        imageX = 0;
        imageY = 0;
        var ratioHeight = imageWidth / imageRatio

        context.drawImage(imageObj, imageX, imageY, imageWidth, ratioHeight);

        imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
        data = imageData.data;

         for(var y = 0; y < imageHeight; y++) {
              // loop through each column
              for(var x = 0; x < imageWidth; x++) {
                var red = data[((imageWidth * y) + x) * 4];
                var green = data[((imageWidth * y) + x) * 4 + 1];
                var blue = data[((imageWidth * y) + x) * 4 + 2];
                var alpha = data[((imageWidth * y) + x) * 4 + 3];

                red = 255;
                
                var index = (x + y * imageWidth) * 4;
                data[index+0] = red;
                data[index+1] = green;
                data[index+2] = blue;
                data[index+3] = alpha;
            } 
        }

        context.putImageData(imageData, imageX, imageY);
    }
});