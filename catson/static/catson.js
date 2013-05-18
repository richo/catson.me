function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  $('#drop_zone').remove();


  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.src = URL.createObjectURL(evt.dataTransfer.files[0]);
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;

    ctx.drawImage(img, 0, 0);
  }

}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}