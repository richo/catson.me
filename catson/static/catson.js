function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  $('#drop_zone').remove();

  function post(comp) {
    // alert("done");
    // document.getElementById("num-faces").innerHTML = comp.length.toString();
    // document.getElementById("detection-time").innerHTML = Math.round((new Date()).getTime() - elapsed_time).toString() + "ms";
    var scale = 100;
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'rgba(125,125,125,0.8)';
    /* draw detected area */
    if (comp.length === 0) {
      alert("No faces found");
      return;
    }
    for (var i = 0; i < comp.length; i++) {
      ctx.beginPath();
      ctx.arc((comp[i].x + comp[i].width * 0.5) * scale, (comp[i].y + comp[i].height * 0.5) * scale,
          (comp[i].width + comp[i].height) * 0.25 * scale * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(comp[i].x,comp[i].y,comp[i].width,comp[i].height);
    }
  }


  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.src = URL.createObjectURL(evt.dataTransfer.files[0]);
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;

    ctx.drawImage(img, 0, 0);

    var comp = ccv.detect_objects({ "canvas" : canvas,
      "cascade" : cascade,
        "interval" : 5,
        "min_neighbors" : 1 });
    post(comp);
  }

}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function number_of_cats() {
  // Try to get it from the hostname
  var cats = window.cats;

  if (cats !== undefined)
    return cats;

  cats = parseInt(window.location.hostname.split(".")[0], 10);
  if (isNaN(cats))
    cats = Math.floor(Math.random() * 100);

  window.cats = cats;
  return cats;
}
