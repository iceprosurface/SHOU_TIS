var listener = {};
var addTargetListener = function(name, callback) {
    if (listener.hasOwnProperty(name)) {
        if (listener[name].indexOf(callback) == -1) {
            listener[name].push(callback)
        }
    } else {
        listener[name] = [];
        listener[name].push(callback);
    }

}
var emitTarget = function(name, ...argument) {
    if (!listener.hasOwnProperty(name)) {
        throw `there is no declear of ${name} `;
        return false;
    }
    if (listener[name].length <= 0) {
        throw `there is no target to emit`;
        return false
    }
    for (let i in listener[name]) {
        listener[name][i](...argument);
    }
}
var distoryTarget = function(name, callback) {
    if (listener.hasOwnProperty(name)) {
        let fnIndex = listener[name].indexOf(callback);
        if (fnIndex != -1) {
            listener[name].splice(fnIndex, 1);
        }
    }
}
export {
    emitTarget,
    distoryTarget,
    addTargetListener
}
