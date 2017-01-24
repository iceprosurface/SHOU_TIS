// 修正输入的内容，移除其他的空元素
exports.clearNullObj =  function() {
    for (let i in this) {
        // 排除boolean型，有可能需要输入boolean，但是诸如[]或者其他的可能被判断为空的元素都必须要移除
        if (Object.prototype.toString.call(this[i]).toLowerCase() == '[object boolean]') continue;
        if (!this[i]) delete this[i];
    }
    return this;
}

// 修正array中的obj目标，多数情况下我们只需要一个name和一个id并不需要多余的内容
exports.tansObjToName = function() {
    var tmpRes = [];
    for (let i = 0; i < this.length; i++) {
        tmpRes.push({
            name: this[i].name,
            id: this[i].id
        });
    }
    return tmpRes;
}

// fixed object and parse it into type like 
exports.tansListToName = function(name,target){

	for(let i = 0 ;i < this.length ; i++){
		this[name] = this[name][target];
	}
	return this;	
}

// exports.validate = 

