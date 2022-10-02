let history = [];
let hist = history.reverse();
let run = 0;
let val = '';
$('#get').css('left', '700px');
$('#get').hide();
$('#send').css('right', '700px');
$('#send').hide();
$('#sendB').click(function() {
  $('#back').html('Back');
  $('#send').show();
  $('#send').css('right', '0');
  $('.area').hide();
  $('#page').hide();
});
$('#getB').click(function() {
  $('#back').html('Back');
  $('#get').show();
  $('#get').css('left', '0');
  $('.area').hide();
  $('#page').hide();
});
$('#scalepad').click(function() {
  if ($('#scalepad').html() == 'Close') {
    $('#scalepad').html('Scale-pad');
    $('#fill, #table').css('bottom', '-500px');
    $('#messages button').css('height', '100px');
  } else {
    $('#scalepad').html('Close');
    $('#fill, #table').css('bottom', '0');
    $('#messages button').css('height', '60px');
  }
});
$('#ctrl button').click(function() {
  if ($('#ctrl button').html() == 'Start') {
    $('#ctrl button').html('Stop');
    $('#ctrl button').css('background-color', 'var(--c3)');
    $('#display').css('border-color', 'var(--c3)');
    get_run();
    run = 1;
    $('#info').html("<img src='https://icons.alexmattyou.repl.co/notes-c/comment.svg'><p>Wait for the sender</p>");
  } else {
    $('#ctrl button').html('Start');
    $('#ctrl button').css('background-color', 'var(--c2)');
    $('#display').css('border-color', 'var(--c2)');
    get_run();
    run = 0;
    $('#info').html("<img src='https://icons.alexmattyou.repl.co/notes-c/d.svg'><p>Press the start to run</p>");
  }
});
let data = '';
let gotData = '';
function send(x) {
  switch (x) {
    case 'v+':
      data = 'Increase the Volume';
      break;
    case 'v-':
      data = 'Decrease the Volume';
      break;
    case 't+':
      data = 'Increase the Tempo';
      break;
    case 't-':
      data = 'Decrease the Tempo';
      break;
    case 'ok':
      data = 'Change the scale to: ' + $('#noteDisp').html();
      break;
    case 'send':
      data = $('#own textarea').val();
      break;
  }
  sendAPI(data);
}
function sendAPI(x) {
  store.edit("Sheet1", {
    search: { x: user },
    set: { message: x, update: 1 }
  }).then(res => {
    if (res.totalUpdatedRows !==1){
      alert('ERROR:\n\tUnable to send data');
      $('#info').html("<img src='https://icons.alexmattyou.repl.co/notes-c/error.svg'><p>Error, can't receive data</p>");
    }
  });
} function readAPI() {
  store.read("Sheet1", { limit: 1, offset: 1 }).then(data => {
    gotData = data[0];
    if (data === undefined){
      alert('ERROR:\n\tUnable to receive data');
    }
  });
}
let kkey = 2;
function get_run() {
  setTimeout(function() {
    if (run == 0) {
      return;
    }
    readAPI();
    if (gotData.update != undefined || gotData.update != 0) {
      if (gotData.update == '1') {
        history.push(gotData.message);
        if (kkey === 1) {
          history.pop();
          kkey = 2;
        } else {
          kkey -= 1;
        }
        val = ''
        for (i in hist) {
          val = '<p>'+hist[i]+'</p>'+val;
        }
        $('#history').html(val);
        $('#display p').html(gotData.message);
        $('#info').html("<img src='https://icons.alexmattyou.repl.co/notes-c/d.svg'><p>Press the Stop when unused</p>");
        $('body').css('background-color','var(--c5)');
        setTimeout(function(){
          $('body').css('background-color','var(--c1)');
        },500);
        if (gotData.update == '1') {
          store.edit("Sheet1", {
            search: { x: user },
            set: { update: 0 }
          }).then(() => {
            gotData.update = 0;
          });
        }
      }
    }
    get_run();
  }, 2000);
}
let scale = ['', '', '']
function add(x) {
  if (x == 'm') {
    if ($('#note').html() == 'm') {
      $('#note').html('M');
      scale[2] = 'm';
    } else {
      $('#note').html('m');
      scale[2] = '';
    }
  } else {
    if (x == '#' || x == '♭') {
      if (scale[1] == '') {
        scale[1] = x;
      } else if (scale[1] == x) {
        scale[1] = '';
      } else {
        scale[1] = x;
      }
    } else {
      scale[0] = x;
    }
  }
  $('#noteDisp').html(scale[0] + scale[1] + scale[2]);
}
function back(){
  location.reload();
}
