/**
 * Created by Navit
 */

'use strict';
var Mongoose = require('mongoose');
var CONFIG = require('./config');



//Connect to MongoDB
Mongoose.connect(CONFIG.DB_CONFIG.mongo.URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        mongoLogger.debug("DB Error: ", err);
        process.exit(1);
    } else {
        mongoLogger.info('MongoDB Connected');
    }
});

exports.Mongoose = Mongoose;


