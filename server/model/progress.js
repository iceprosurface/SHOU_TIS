var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 这里储存以下内容
// name：提交的progress的name
// info：相关信息
// from：来源pid
// file: 此次提交的文件
const TYPE = exports.TYPE = {
	NOMAL: 0,
	MID_TERM: 1,
	FIX: 2
}
var progressSchema = new mongoose.Schema({
	name: String,
	info: String,
	from: Number,
	type: {
		type: Number,
		default: TYPE.NOMAL
	},
	haveFiles:{
		type: Boolean,
		default: false
	},
	file: {
		type: Buffer
	},
	operator: {
        type: Schema.Types.ObjectId,
        ref: 'usr'
    },
    createTime: Date,
});
exports.fn = mongoose.model('progress', progressSchema);
