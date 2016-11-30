var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/TIS');
mongoose.Promise = global.Promise;

