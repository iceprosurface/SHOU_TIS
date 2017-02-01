function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.status))
    }
}

function json(response) {
    var contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function(json){return json});
	} else {
        console.warn("this is not a JSON code");
    }
}
export {
    status,
	json
}
