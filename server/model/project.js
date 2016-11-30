// 暂时不需要分离出去
var mongoose = require('mongoose');
const Schema = mongoose.Schema
var staffSchema = new mongoose.Schema({
    name:  String,
    age: Number,
    canEdit: Boolean,
    info: String,
    sid: {
        type: Schema.Types.ObjectId,
        ref: 'usr'
    }
});
var projectSchema = new mongoose.Schema({
    pid: {
        type: Number,
		required: true,
        index: {
            unique: true
        }
    },
    name:  String, 
    infomations: String,
    endTime: Date,
    staffs: [staffSchema],
	adminUsr: {
        type: Schema.Types.ObjectId,
        ref: 'usr'
    }

});
exports.project = mongoose.model('project', projectSchema);
exports.staff = mongoose.model('staff', staffSchema);
