/**
 * Created by Navit
 */


var UniversalFunctions = require("../../utils/universalFunctions");
var Joi = require("joi");
var Config = require("../../config");
var Controller = require("../../controllers");

var uploadImage =
{
  method: 'POST',
  path: '/api/upload/uploadImage',
  handler: function (request, reply) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UploadBaseController.uploadImage(payloadData, function (err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
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
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


var uploadVideo =
{
  method: 'POST',
  path: '/api/upload/uploadVideo',
  handler: function (request, reply) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UploadBaseController.uploadVideo(payloadData, function (err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
        }
      });
    });
  },
  config: {
    description: 'video upload',
    tags: ['api', 'upload', 'video'],
    payload: {
      maxBytes: 207152000,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: {
        videoFile: Joi.any()
          .meta({ swaggerType: 'file' })
          .required()
          .description('video file')
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


var uploadDocument =
{
  method: 'POST',
  path: '/api/upload/uploadDocument',
  handler: function (request, reply) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UploadBaseController.uploadDocument(payloadData, function (err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
        }
      });
    });
  },
  config: {
    description: 'upload document',
    tags: ['api', 'upload', 'document'],
    payload: {
      maxBytes: 20715200,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: {
        documentFile: Joi.any()
          .meta({ swaggerType: 'file' })
          .required()
          .description('document file')
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

var UploadBaseRoute = [uploadImage, uploadDocument, uploadVideo];
module.exports = UploadBaseRoute;
