//IGNORE THIS FILE - WAS USING IT TO TEST THINGS (TRIES TO USE EXPRESS APP)


//added to merge bits in servers.....
"use strict";
//External Dependencies
var Hapi = require("@hapi/hapi");

//Internal Dependencies
var Config = require("./config");
var Plugins = require("./plugins");
var SocketManager = require("./lib/socketManager");
var Routes = require("./routes");
var MongoConnect = require('./mongoConnect');
var BootStrap = require('./utils/bootStrap');
var Path = require("path");
var log4js = require('log4js');


global.appRoot = Path.resolve(__dirname)


//-------

var ibm = require('ibm-cos-sdk');
var util = require('util');
const fs = require('fs');

var config = {
  //endpoint: 'https://control.cloud-object-storage.cloud.ibm.com/v2/endpoints',
  endpoint: 's3.au-syd.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'EiGkr_k8UB2IU2UQrBhWKvVIuAdG4ZELqKrL4X2zrbxD',
  //serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/a45d044e68ff4d7a812125bc0a386c6a:72454b77-1720-42da-992d-3cb09d66a1db::',
  serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/a45d044e68ff4d7a812125bc0a386c6a:72454b77-1720-42da-992d-3cb09d66a1db:bucket:cloud-object-storage-fish-images',

  region: 'au-syd'
};
const myBucket = 'cloud-object-storage-fish-images';



const cors = require("cors");
const req = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let userSocket;

//required for sockets
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//======  testing bucket stuff

var cos = new ibm.S3(config);

/*
function doCreateBucket() {
    console.log('Creating bucket');
    return cos.createBucket({
        Bucket: 'my-bucket',
        CreateBucketConfiguration: {
 //   LocationConstraint: 'us-standard'

 LocationConstraint: 'au-syd'        },
    }).promise();
}

//var s3 = new aws.S3({endpoint: ep, region: 'au-syd'}); //au-syd? us-south?
//var myBucket = 'cloud-object-storage-fish-images';


function doCreateObject() {
    console.log('Creating object');
    return cos.putObject({
        Bucket: 'my-bucket',
        Key: 'foo',
        Body: 'bar'
    }).promise();
}

function doDeleteObject() {
    console.log('Deleting object');
    return cos.deleteObject({
        Bucket: 'my-bucket',
        Key: 'foo'
    }).promise();
}

function doDeleteBucket() {
    console.log('Deleting bucket');
    return cos.deleteBucket({
        Bucket: 'my-bucket'
    }).promise();
}

doCreateBucket()
    .then(doCreateObject)
    .then(doDeleteObject)
    .then(doDeleteBucket)
    .then(function() {
        console.log('Finished!');
    })
    .catch(function(err) {
        console.error('An error occurred:');
        console.error(util.inspect(err));
    });


*/
//=====
//function createTextFile(bucketName, itemName, fileText) {
function createNewFile(bucketName, itemName, file) {


  //function createTextFile(bucketName, itemName, filepath) {
  console.log(`Creating new item: ${itemName}`);
  //added to try
  // const      fileType = mime.contentType(filepath) || 'application/octet-stream'
  const fileType = mime.contentType(file) || 'application/octet-stream'

  return cos.putObject({
    Bucket: bucketName,
    Key: itemName,
    Body: fs.createReadStream(file.path),

    //  Body: fs.createReadStream(file.path),
    //works -     Body: fs.createReadStream(filepath),

    ContentType: fileType,

  }).promise()
    .then(() => {
      console.log(`Item: ${itemName} created!`);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

//--from other stuff...
var galleryController = function (title) {

  var aws = require('ibm-cos-sdk');
  var multer = require('multer');
  var multerS3 = require('multer-s3');
  var ep = new aws.Endpoint('s3.au-syd.cloud-object-storage.appdomain.cloud');
  var s3 = new aws.S3({ endpoint: ep, region: 'au-syd' }); //au-syd? us-south?
  var myBucket = 'cloud-object-storage-fish-images';

  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: myBucket,
      key: function (req, file, cb) {
        cb(null, file.originalname);
        console.log(file);
      }
    })
  });
}

/*
//this is a repeat of within above function *****
//var aws = require('ibm-cos-sdk');
  var multer = require('multer');
  var multerS3 = require('multer-s3');
 // var ep = new aws.Endpoint('s3.au-syd.cloud-object-storage.appdomain.cloud');
  //var s3 = new aws.S3({endpoint: ep, region: 'au-syd'}); //au-syd? us-south?
 // var myBucket = 'cloud-object-storage-fish-images';


var params = {
  Body: 'fishPic', 
  //filepath:   'public/assets/fishIcon.png', //added as test
  Bucket: myBucket, 
  Key: "HappyFace.png"
 };
 //s3.putObject(params, function(err, data) {

 cos.putObject(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
   /*
   data = {
    ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
    VersionId: "tpf3zF08nBplQK1XLOefGskR7mGDwcDk"
   }
   
 });
*/
/*
var upload = multer({
 storage: multerS3({
     s3: cos,
     bucket: myBucket,
     key: function (req, file, cb) {
         cb(null, file.originalname);
         console.log(file);
     }
 })
});




app.post('/upload', upload.array('photos', 3), function(req, res, next) {
 res.send('Successfully uploaded ' + req.files.length + ' files!')
})
*/
//---
/*
let obj = fs.readFileSync( parts.file );

await cos.putObject( {
  Body: obj,
  Bucket: 'file-upload',
  Key: parts.name   
} )
.promise()
.then( ( data ) => {
  console.log( 'File storage complete.' );
} );
*/
//---

const mime = require('mime-types');

/*
function cos_client (params) {
  const bx_creds = params['__bx_creds']
  if (!bx_creds) throw new Error('Missing __bx_creds parameter.')

  const cos_creds = bx_creds['cloud-object-storage']
  if (!cos_creds) throw new Error('Missing cloud-object-storage parameter.')

  const endpoint = params['cos_endpoint']
  if (!endpoint) throw new Error('Missing cos_endpoint parameter.')

  const config = {
    endpoint: endpoint,
    apiKeyId: cos_creds.apikey,
    serviceInstanceId: cos_creds.resource_instance_id
  }

  return new cos.S3(config);
}*/


function upload(params) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  if (!params.name) throw new Error("Missing name parameter.")
  if (!params.body) throw new Error("Missing object parameter.")

  // const client = cos_client(params)
  const body = Buffer.from(params.body, 'base64')

  const ContentType = mime.contentType(params.name) || 'application/octet-stream'
  const object = {
    Bucket: params.bucket,
    Key: params.name,
    Body: body,
    ContentType
  }

  return cos.upload(object).promise()
}
//======


var port = process.env.PORT || 8088;

app.use(express.static(__dirname + '/public'));


io.on('connection', (socket) => {
  //keep track of socket, as users don’t need updates on own matches
  userSocket = socket.id
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

//basic test to check functioning
app.get("/displayHello", function (request, response) {
  var user_name = request.query.name;
  response.json("Hello " + user_name + "!");
});

//endpoint to give client their socketId
app.get('/socketid', function (req, res) {
  res.send(userSocket)
});

//get request - forwarding API to check if there's an image match for a fish in the database and returns details
app.get('/checkFishMatch', function (request, response) {
  let inBody = request.query.body;
  // let theSocket = userSocket;
  //link for local testing (http://localhost:8081/) ------
  //reqObject = "http://localhost:8081/checkFishMatch?body=" + JSON.stringify(inBody);
  //----------
  //access via cloud (PAAS)
  reqObject = "https://anglermatehub.us-south.cf.appdomain.cloud/checkFishMatch?body=" + JSON.stringify(inBody);
  req(reqObject, (err, result) => {

    //if true match being returned in response, initiate alert via webserver
    try {
      let matchData = JSON.parse(result.body);
      let theSocket = request.query.socket;

      if (matchData.fishMatch) {
        const match = {
          fish: matchData.fish,
          lat: null,
          long: null,
          socket: theSocket
        }
        io.emit('matchFound', match);
        console.log('match is found');
      } else {
        console.log('match is not found');
      }
      console.log(matchData.fishMatch);
    } catch (e) {
      console.log(e);
    }

    if (err) { return console.log(err); }
    console.log(result.body)
    response.send(result.body);
  });
});

//get request - forwarding API for checking fish against database and returning details
app.get("/classifyURL", function (request, response) {
  let imageURL = request.query.url;
  console.log(imageURL)
  //--------------
  //(for shortcut straight to cloud FAAS (testing): reqObject = urlRemoteVR+"?url="+imageURL;
  //local testing via local machine: reqObject = "http://localhost:8081/classifyURL?url="+imageURL;
  //reqObject = "http://localhost:8081/classifyURL?url="+imageURL;
  //-------------
  reqObject = "https://anglermatehub.us-south.cf.appdomain.cloud/classifyURL?url=" + imageURL;

  req(reqObject, (err, result) => {
    if (err) { return console.log(err); }
    console.log(result.body)
    response.send(result.body);
  });
});



const getFishLocation = (resq) => {
  const https = require('https');
  var str = '';

  var options = {
    hostname: 'amlocatapi.us-south.cf.appdomain.cloud',
    port: 443,
    path: '/location',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '1q2w3e4r5t6yu7i8'
    }
  };

  callback = function (response) {

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      //console.log(req.data);
      //console.log(str);
      resq.send(JSON.parse(str));
      // your code here if you want to use the results !
    });
  }

  var req = https.request(options, callback).end();
}


app.get("/getAll", function (req, resq) {
  getFishLocation(resq);
})


http.listen(port);
console.log("Listening on port ", port);

//added to TEST *****
var params2 = {
  body: '/Users/Kat/Downloads/koi/koi1.jpeg',
  bucket: myBucket,
  name: "test.png",
  key: "testK.png"

};
//works but too many files now
//createTextFile(myBucket, "testItem.jpg", "/Users/Kat/Downloads/koi/koi1.jpeg");
//upload(params2);



app.post("/classifyFile", function (req, res) {


  console.log("Attempting file upload b1");
  let theFile = req.body.inFile;
  console.log(req.body.socket);
  // console.log(req.body.inFile.path);
  //console.log(req.body.fishPic);
  console.log(req.body);
  // console.log(req);
  createNewFile(myBucket, "testItemnow.jpg", theFile);



  var params3 = {
    //  body: theFile.file, 
    body: "testing",
    bucket: myBucket,
    name: "test3.png",
    key: "test3.png"

  };

  // upload(params3);
  res.send("200");

  /*
 // Error MiddleWare for multer file upload, so if any
 // error occurs, the image would not be uploaded!
 upload(req,res,function(err) {

     if(err) {

         // ERROR occured (here it can be occured due
         // to uploading image of size greater than
         // 1MB or uploading different file type)
         res.send(err)
     }
     else {

         // SUCCESS, image successfully uploaded
         res.send("Success, Image uploaded!")
     }
 })*/
})

//app.post("/uploadPicture", function (req, res) {
  //call something else for a minute to allow handle use by different code
  app.post("/uploadPic", function (req, res) {


  console.log("Attempting file upload");
  // let theFile = req.files.fishPic;
  let theFile = 'fishPic';
  // console.log(req);
  // console.log(req.query.socket);
  console.log(theFile);

  var params3 = {
    body: theFile,
    bucket: myBucket,
    name: 'test3.png',
    key: 'test3'

  };

  upload(params3);
  res.send("200");

  /*
 // Error MiddleWare for multer file upload, so if any
 // error occurs, the image would not be uploaded!
 upload(req,res,function(err) {

     if(err) {

         // ERROR occured (here it can be occured due
         // to uploading image of size greater than
         // 1MB or uploading different file type)
         res.send(err)
     }
     else {

         // SUCCESS, image successfully uploaded
         res.send("Success, Image uploaded!")
     }
 })*/
})

/*
app.get("/classifyFile", function (request, response) {
  console.log("Attempting file upload");
  let theFile = request.inFile;

  var params3 = {
    body: theFile.file,
    bucket: myBucket,
    name: "test3.png",
    key: "test3.png"

   };

   upload(params3);
   response.send("200");

   // response.send(result.body);
  });

*/

//  var x = document.getElementById("myFile"); 
//createTextFile(myBucket, "testItemnow.jpg", x);

 //This is navit's code
  /**
 * Created by Navit
 */
  // var UniversalFunctions = require("../../utils/universalFunctions");
   var Joi = require("joi");
   //var Config = require("../../config");
   //var Controller = require("../../controllers");
  
   var s3BucketCredentials = {
    //  "projectFolder":"doc_profiler",
   //   "bucket": "doc-profiler-bucket",
  
      "bucket": 'cloud-object-storage-fish-images',
  
     // "endpoint": 's3.au-syd.cloud-object-storage.appdomain.cloud',
      "endpoint": 's3.au-syd.cloud-object-storage.appdomain.cloud',
  
     // "apiKeyId": 'mhNbtjQUlsq2LBh5F03g81g1Wcq8hN6H1ZrWnpRtcD3L',
      "apiKeyId": 'EiGkr_k8UB2IU2UQrBhWKvVIuAdG4ZELqKrL4X2zrbxD',
  
    //  "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/200d885c6c6a4629814c74e3c7594d35:bb53fed0-c301-4705-ad41-27a08a0ae3a6:bucket:doc-profiler-bucket",
      "serviceInstanceId": 'crn:v1:bluemix:public:cloud-object-storage:global:a/a45d044e68ff4d7a812125bc0a386c6a:72454b77-1720-42da-992d-3cb09d66a1db:bucket:cloud-object-storage-fish-images',
  
  //these credentials didn't use
  "region": 'au-syd',
  
  
      "folder": {
          "profilePicture": "profilePicture",
          "thumb": "thumb",
          "original": "original",
          "image": "image",
          "docs":"docs",
          "files":"files"
      },
    //  "agentDefaultPicUrl": "http://instamow.s3.amazonaws.com/agent/profilePicture/default.png",
     // "fbUrl": "https://graph.facebook.com/"
  
  
  
  
  };
   
  
  
   var uploadImage = function (payloadData, callback) {
      var imageFileURL;
      var imageFile = payloadData.imageFile
      if (payloadData.imageFile && payloadData.imageFile.filename) {
        imageFileURL = {
          original: null,
          thumbnail: null
        }
      }
      console.log("????????",checkFileExtension(imageFile.hapi.filename))
      async.series([
        function (cb) {
          if (payloadData.hasOwnProperty("imageFile") && imageFile && imageFile.hapi.filename) {
  //            UploadManager.uploadProfilePicture(imageFile, s3BucketCredentials.folder.image, UniversalFunctions.generateRandomString(), function (err, uploadedInfo) {
  
            UploadManager.uploadProfilePicture(imageFile, s3BucketCredentials.folder.image, "pretend rand string", function (err, uploadedInfo) {
              if (err) {
                cb(err)
              } else {
                imageFileURL = {
                  original: uploadedInfo.profilePicture,
                  thumbnail: uploadedInfo.profilePictureThumb
                }
                cb();
              }
            });
          }
          else {
            cb()
          }
        }
      ], function (err, result) {
        if (err) callback(err)
        else callback(null, { imageFileURL: imageFileURL })
      })
    }
  
  
   var uploadImage =
   {
     method: 'POST',
    // path: '/api/upload/uploadImage',
       path: '/uploadPicture',
  
     handler: function (request, reply) {
       var payloadData = request.payload;
       return new Promise((resolve, reject) => {
         uploadImage(payloadData, function (err, data) {
           if (err) {
           //  reject(UniversalFunctions.sendError(err));
           } else {
           //  resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
           }
         });
       });
     },
     config: {
       description: 'image upload',
       tags: ['api', 'upload', 'image'],
       payload: {
         maxBytes: 20715200,
         output: 'stream',
         parse: true,
         allow: 'multipart/form-data'
       },
       validate: {
         payload: {
           imageFile: Joi.any()
             .meta({ swaggerType: 'file' })
             .required()
             .description('image file')
         },
        // failAction: UniversalFunctions.failActionFunction
       },
       plugins: {
         'hapi-swagger': {
          // responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
         }
       }
     }
   }