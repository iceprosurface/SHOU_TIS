// 暂时不需要分离出去
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PROJECT_STATUS = exports.PROJECT_STATUS = {
	BEGIN: 0,
	BEGIN_LOCK: 1,
	BEGIN_FAIL: 2,
	REPLY_LOCK: 3,
	REPLY_FAIL: 4,
	ON_PROCESS: 5,
	PROCESS_LOCK: 6,
	PROCESS_END: 7,
	MID_TERM_FAIL: 8,
	END_TERM: 9
}
    // staff 只是保存数据使用,只有主要管理员和普通管理员两者可以对项目作出操作，主要管理员的权限设置将会比普通的更高
var staffSchema = new mongoose.Schema({
    name: String,
    age: Number,
    info: String,
	sid: Number
});
var projectSchema = new mongoose.Schema({
    pid: {
        type: Number,
        required: true,
        index: {
            unique: true
        }
    },
    name: String,
    information: String,
    endTime: Date,
    createTime: Date,
    staffs: [staffSchema],
    // 有效的邀请token，只能对adminUsr有效
    inviteToken: [String],
    adminUsrChief: {
        type: Schema.Types.ObjectId,
        ref: 'usr'
    },
	file: {
		type: Buffer
	},
    adminUsr: [{
        type: Schema.Types.ObjectId,
        ref: 'usr'
    }],
	nowStatus:{
		type: Number,
		default: PROJECT_STATUS.BEGIN
	}
});
exports.project = mongoose.model('project', projectSchema);
exports.staff = mongoose.model('staff', staffSchema);
