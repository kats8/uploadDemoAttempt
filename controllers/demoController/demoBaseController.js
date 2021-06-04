/**
 * Created by Navit
 */

/**
 * Please use appLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 */

var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var demoFunction = function(payloadData, callback) {
  return callback(null,payloadData);
};

var demoFunctionAuth = function(userData,payloadData, callback) {
  appLogger.debug(">>>>",userData,payloadData)
  return callback(null,payloadData);
};

module.exports = {
  demoFunction: demoFunction,
  demoFunctionAuth: demoFunctionAuth
};
