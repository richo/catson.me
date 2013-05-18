var cats = [
  'static/cats/1.png',
  'static/cats/2.png',
  'static/cats/3.png',
  'static/cats/4.png',
  'static/cats/5.png',
  'static/cats/6.png',
  'static/cats/7.png',
  'static/cats/8.png',
  'static/cats/9.png'
];

function get_cat() {
  return cats[Math.floor(Math.random() * cats.length)];
}

function cat_img(draw_cat) {
  var cat = get_cat();
  var img = new Image();
  // img.src = URL.createObjectURL(cat);
  img.src = cat;
  img.onload = function() {
    while (!draw_cat(img)) {}
  };
  return img;
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  $('#drop_zone').remove();

  var exempt = [];

  function real_draw_cat(cat, x, y) {
    ctx.drawImage(cat, x, y);
  }

  function post(comp) {
    // alert("done");
    // document.getElementById("num-faces").innerHTML = comp.length.toString();
    // document.getElementById("detection-time").innerHTML = Math.round((new Date()).getTime() - elapsed_time).toString() + "ms";
    var i;
    var scale = 100;
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'rgba(125,125,125,0.8)';
    /* draw detected area */
    if (comp.length === 0) {
      alert("No faces found");
      return;
    }
    for (i = 0; i < comp.length; i++) {
      // ctx.beginPath();
      // ctx.arc((comp[i].x + comp[i].width * 0.5) * scale, (comp[i].y + comp[i].height * 0.5) * scale,
      //     (comp[i].width + comp[i].height) * 0.25 * scale * 1.2, 0, Math.PI * 2);
      // ctx.stroke();
      // ctx.strokeRect(comp[i].x,comp[i].y,comp[i].width,comp[i].height);
      exempt.push([comp[i].x,comp[i].y,comp[i].width,comp[i].height]);
    }
    var num_cats = number_of_cats();
    for (i = 0; i < num_cats; i++) {
      cat_img(draw_cat);
    }
  }

  function draw_cat(cat) {
    loc_x = Math.floor(Math.random() * canvas.width);
    loc_y = Math.floor(Math.random() * canvas.height);

    for (var i = 0; i < exempt.length; i++) {
      var t = exempt[i];
      var x = t[0],
          y = t[1],
          w = t[2],
          h = t[3];

      if ((loc_x > (x + w)) || (((loc_x + cat.width) < x))) {
        continue;
      } else if ((loc_y > (y + h)) || ((loc_y + cat.height) < y)) {
        continue;
      } else {
        return false;
      }
    }
    real_draw_cat(cat, loc_x, loc_y);
    return true;
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
  };
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function number_of_cats() {
  // Try to get it from the hostname
  var cats = window.__cats;

  if (cats !== undefined)
    return cats;

  cats = parseInt(window.location.hostname.split(".")[0], 10);
  if (isNaN(cats))
    cats = Math.floor(Math.random() * 100);

  window.__cats = cats;
  return cats;
}
