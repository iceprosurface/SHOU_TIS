var mongoose = require('mongoose');
const Schema = mongoose.Schema

var noticeSchema = new mongoose.Schema({
	sender: Schema.Types.ObjectId,
	receiver: Schema.Types.ObjectId,
	extra: Schema.Types.Mixed,
	infomation: String,
});

exports.notice = mongoose.model('notice', noticeSchema);
