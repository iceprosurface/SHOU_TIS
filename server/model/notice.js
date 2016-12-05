var mongoose = require('mongoose');
const Schema = mongoose.Schema

var noticeSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'usr'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'usr'
    },
    extra: Schema.Types.Mixed,
    information: String,
	createTime: Date,
});

exports.notice = mongoose.model('notice', noticeSchema);
