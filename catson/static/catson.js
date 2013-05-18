var cats = [
'https://d217f0ay5mnho1.cloudfront.net/01.png',
'https://d217f0ay5mnho1.cloudfront.net/02.png',
'https://d217f0ay5mnho1.cloudfront.net/03.png',
'https://d217f0ay5mnho1.cloudfront.net/04.png',
'https://d217f0ay5mnho1.cloudfront.net/05.png',
'https://d217f0ay5mnho1.cloudfront.net/06.png',
'https://d217f0ay5mnho1.cloudfront.net/07.png',
'https://d217f0ay5mnho1.cloudfront.net/08.png',
'https://d217f0ay5mnho1.cloudfront.net/09.png',
'https://d217f0ay5mnho1.cloudfront.net/10.png',
'https://d217f0ay5mnho1.cloudfront.net/11.png',
'https://d217f0ay5mnho1.cloudfront.net/12.png',
'https://d217f0ay5mnho1.cloudfront.net/13.png',
'https://d217f0ay5mnho1.cloudfront.net/14.png'
];

function use_webcam() {
  $('#dropzone_content').hide();
  $('#webcam_content').show();

  var video = document.querySelector('video');

  // userGetMedia = (navigator.webkitGetUserMedia ? navigator.webkitGetUserMedia : navigator.getUserMedia);

  // userGetMedia({video: true}, function(stream) {
  //     video.src = window.URL.createObjectURL(stream);
  //       localMediaStream = stream;
  // },
  // function(err) { console.log("This didn't go to plan"); }
  // );
  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  getUserMedia({video: true},
      function(stream) {
                    video.src = window.webkitURL.createObjectURL(stream);
      },
      function(erro) {
        alert("camera isn't so good");
        use_dropzone();
      }
      );
}

function take_snapshot() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var video = document.querySelector('video');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  $('video').remove();
  handleFileSelect(null);
}

function use_dropzone() {
  $('#dropzone_content').show();
  $('#webcam_content').hide();
}

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
  if (evt !== null) {
    evt.stopPropagation();
    evt.preventDefault();
  }
  $('#drop_zone').remove();
  $('#webcam_content').remove();

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
  if (evt !== null) {
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
  } else {
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
  var cats = window.__cats;

  if (cats !== undefined)
    return cats;

  cats = parseInt(window.location.hostname.split(".")[0], 10);
  if (isNaN(cats))
    cats = Math.floor(Math.random() * 100);

  window.__cats = cats;
  return cats;
}
