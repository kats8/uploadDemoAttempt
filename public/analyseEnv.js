//THIS CODE FROM OTHER PROJECT, USED FOR TESTING - NOT IN USE HERE

let urlRemoteVR = 'https://us-south.functions.appdomain.cloud/api/v1/web/Katrina.Steen%40gmail.com_dev/default/AM%20Fish%20Analysis'
const urlClassify = '/classifyURL';
const checkFishMatch = '/checkFishMatch';
const qMark = 'assets/fishIcon.png';
let socketId;

$(document).ready(function () {
  document.documentElement.style.setProperty('--alertOpacity', `0`)
  $('#alertInfo').removeClass("hidden");
  console.log('Ready');

  $.get('/socketid', function (res) {
    socketId = res
  });


  var socketConnection = io.connect();
  socketConnection.on('connect', function () {
  });

  //to display matches of other users
  socketConnection.on('matchFound', match => {
    //only display if not me
    if (socketId != match.socket) {
      let theString = `Someone just identified a ${match.fish}!`;
      $('#alertInfo').html(theString);
      console.log(theString);
      console.log('socketId: ' + socketId);
      console.log('match.socket: ' + match.socket);

      document.documentElement.style.setProperty('--alertOpacity', `1`);
      setTimeout(function () { document.documentElement.style.setProperty('--alertOpacity', `0`); }, 4000);

    }
  });
  $('#textInfo').addClass("hidden");
  $('#textInfo').html("");

  $('#btnClassify').click(() => {
    let imageResult;

    //==========NEW
    //upload button ID is upload *****
    //let theFile = document.getElementById("upload");
    let theFile = document.getElementById("upload").files[0];
    //console.log(theFile.value);
    console.log(theFile);

    if (theFile) {
      //will 'try' at least, but doesn't do file correctly
    //  $.post("/classifyFile", { inFile: theFile.value, socket: socketId }, function () { console.log("trying to upload file") })
   //   $.post("/classifyFile", { inFile: theFile, socket: socketId }, function () { console.log("trying to upload file") })

      const formData = new FormData();
formData.append('anImage.png', theFile);

// Post the form, just make sure to set the 'Content-Type' header
const res = await axios.post('/classifyFile', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});


        //===
        /*
      const fd = new FormData();
      fd.append('avatar', file);

      // send `POST` request
      fetch('/upload-avatar', {
        method: 'POST',
        body: fd
      })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
      //====
      */
    }



    //from previous
    let inputURL = $('#urlBox').val();
    $('#textInfo').removeClass("hidden");
    //Displays 'please wait' while waiting for responses to be returned
    $('#textInfo').html("Please Wait...");
    $('#urlPic').attr("src", qMark);

    let input = {
      url: inputURL
    }
    let textString = "";
    let classFound = "";

    $.get(urlClassify, input, function (result) {
      $('#urlPic').attr("src", inputURL);
      try {
        imageResult = jQuery.parseJSON(result);
        classFound = imageResult[0].class;
      }
      catch (e) {
        console.log(e);
        $('#textInfo').html("We couldn't find a valid image at that URL");
        $('#urlPic').attr("src", qMark);
      }
      //  }).then(result => $.get("/checkFishMatch", { body: result }, function (matchInfo) {
    }).then(result => $.get("/checkFishMatch", { body: result, socket: socketId }, function (matchInfo) {

      let matchData = jQuery.parseJSON(matchInfo);
      //If a fish match was returned, fill in info accordingly
      if (matchData.fishMatch) {
        //if Noxious, add highlighted notice.
        if (matchData.noxious) {
          textString += `<p><b><font color="red">[Noxious]</font></b></p>`
        }
        //if Protected, add highlighted notice
        if (matchData.protected) {
          textString += `<p><b><font color="red">[Protected]</font></b></p>`
        }
        textString += `<b> ${matchData.fish} </b>`;
        textString += `<p>${matchData.info}</p>`;
      }
      else {
        //if no match, did we at least recognise an image object?
        if (imageResult[0].hasOwnProperty('class')) {
          textString = `Looks like a ${classFound}, but doesn't match any aquatic species on our database. More species are coming soon!`;
        }
        else {
          textString = "Couldn't find a valid image at that URL.";
          $('#urlPic').attr("src", qMark);
        }
      }
      $('#textInfo').html(textString);
    })).catch(function () {
      $('#textInfo').html("We couldn't find a valid image at that URL.");
      $('#urlPic').attr("src", qMark);
    });
  })
async function getPreciseLocation() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve({ lat: position.coords.latitude, long: position.coords.longitude });
      });
    });
  }

  $('#upload').click(function () {

    console.log('attempting to upload file')
    var fd = new FormData();
    fd.append('fishPic', $('#fishPic')[0].files[0]);

    $.ajax({
     // url: 'upload/uploadImage',
      url: 'http://localhost:8001/api/upload/uploadImage',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (data) {
        console.log('upload success!')
        $('#data').empty();
        $('#data').append(data);
      }
    });
  });

})

