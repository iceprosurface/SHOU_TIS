// 暂时不需要分离出去
var mongoose = require('mongoose');
// 游客，项目管理者，项目审核专员，同时拥有审核和创建，admin管理者
const PERMISSION = exports.PERMISSION = {
	TOURISTS: 0,
	PROJECT: 1,
	AUDIT: 2,
	PROJECT_AUDIT: 3,
	ADMIN: 777,
	READY_CHECK:-1
}
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
	sid: {
		type: Number,
		index: {
			unique: true,
		}
	},
	psw: {
		type: String
	},
	permission: {
		type: Number,
		default: PERMISSION.TOURISTS	
	}
});
exports.fn = mongoose.model('usr', usrSchema);
