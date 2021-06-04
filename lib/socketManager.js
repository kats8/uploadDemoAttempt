'use strict';
/**
 * Created by Navit.
 */

 /**
 * Please use socketLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 */

var SocketIO = require('socket.io');

exports.connectSocket = function (server) {
    var io = SocketIO.listen(server.listener);

    socketLogger.info("socket server started");

    io.on('connection', function (socket) {
        socketLogger.info("connection established: ",socket.id);
        socket.emit('message', {message: {type:'connection',statusCode:200,statusMessage:'WELCOME TO USER ONBOARDING MODULE',data:""}});
    })
}