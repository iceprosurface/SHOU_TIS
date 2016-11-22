// 暂时不需要分离出去
var mongoose = require('mongoose');
var usrSchema = new mongoose.Schema({
    name: {
        type: String,
        index: {
            unique: true
        }
    },
    age: {
        type: Number,
        min: 0
    },
	psw: {
		type: String
	}

});
exports.fn = mongoose.model('usr', usrSchema);
